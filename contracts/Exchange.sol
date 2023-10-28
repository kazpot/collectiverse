// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ProxyRegistry.sol";
import "./ExchangeProxyImpl.sol";
import "./NFT.sol";

// for debug
import "hardhat/console.sol";

contract Exchange is ReentrancyGuard, Ownable {
    // proxy registry that stores proxy for transfering NFT
    ProxyRegistry private _registry;

    // commission fee recipient
    address payable private _commissionFeeRecipent;

    // order that has been cancelled or finalized
    mapping(bytes32 => bool) public cancelledOrFinalized;

    // buy/sell orders
    mapping(bytes32 => bool) public orders;

    // commission / BASIS_UNIT = 0.03
    uint256 private constant BASIS_UNIT = 1000;
    // 15%
    uint256 private _commissionFee = 150;
    // 7%
    uint256 private _secondCommissionFee = 70;
    // 10%
    uint256 private _royalty = 100;

    // prefix for signature
    string private constant prefix = "\x19Ethereum Signed Message:\n32";

    enum Side {
        Buy,
        Sell
    }

    struct Sig {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct Order {
        // this contract address
        address exchange;
        // order maker address
        address payable maker;
        // order taker address
        address payable taker;
        // royalty recipient address
        address payable royaltyRecipient;
        // Sell or Buy
        Side side;
        // target address for NFT token
        address nftAddress;
        // tokenId
        uint256 tokenId;
        // minimum bid price
        uint256 basePrice;
        // listing timestamp
        uint256 listingTime;
        // expiration timestamp
        uint256 expirationTime;
        // payment token address
        address paymentToken;
    }

    event OrderCreated(
        Side indexed side,
        bytes32 indexed hash,
        address indexed maker,
        address taker,
        address royaltyRecipient,
        address nftAddress,
        uint256 tokenId,
        uint256 basePrice,
        uint256 listingTime,
        uint256 expirationTime,
        address paymentToken
    );

    event CancelOrder(bytes32 indexed hash);

    event MatchedOrder(
        bytes32 indexed buyHash,
        bytes32 indexed sellHash,
        address indexed maker,
        address taker,
        uint256 price,
        address paymentToken
    );

    function _validateOrder(
        bytes32 hash,
        Order memory order,
        Sig memory sig
    ) private view returns (bool) {
        if (order.exchange != address(this)) {
            return false;
        }

        if (cancelledOrFinalized[hash]) {
            return false;
        }

        address makerOrTaker = order.side == Side.Sell
            ? order.maker
            : order.taker;

        if (ecrecover(hash, sig.v, sig.r, sig.s) == makerOrTaker) {
            return true;
        }
        return false;
    }

    /**
     * @dev Check if parameters of buy and sell orders match
     * @param buy buy order
     * @param sell sell order
     */
    function _ordersCanMatch(Order memory buy, Order memory sell)
        private
        view
        returns (bool)
    {
        return
            (buy.side == Side.Buy && sell.side == Side.Sell) &&
            (buy.maker == address(0) && sell.taker == address(0)) &&
            (buy.nftAddress == sell.nftAddress) &&
            (buy.listingTime < block.timestamp) &&
            (sell.listingTime < block.timestamp);
    }

    /**
     * @dev Tranfer tokens (only for WETH)
     * @param token specific token contract address
     * @param from from address
     * @param to to address
     * @param amount amount
     */
    function _transferToken(
        address token,
        address from,
        address to,
        uint256 amount
    ) private {
        require(_registry.contracts(address(this)));
        require(ERC20(token).transferFrom(from, to, amount));
    }

    /**
     * @dev this is called when the bid was accepted by seller or buy now by buyer
     * @param buy buy order
     * @param sell sell order
     */
    function _finalize(Order memory buy, Order memory sell)
        private
        returns (uint256)
    {
        // hammer price must be greater than sell price
        uint256 sellPrice = sell.basePrice;
        uint256 hammerPrice = buy.basePrice;
        require(hammerPrice >= sellPrice);

        uint256 commission;
        if (sell.paymentToken != address(0) && sell.maker == msg.sender) {
            require(msg.value == 0);
            // maker receives sales amount
            _transferToken(
                sell.paymentToken,
                buy.taker,
                sell.maker,
                hammerPrice
            );

            if (sell.royaltyRecipient != address(0)) {
                commission = SafeMath.div(
                    SafeMath.mul(hammerPrice, _secondCommissionFee),
                    BASIS_UNIT
                );

                uint256 royalty = SafeMath.div(
                    SafeMath.mul(hammerPrice, _royalty),
                    BASIS_UNIT
                );

                // NFT minter receives royalty fee
                _transferToken(
                    sell.paymentToken,
                    sell.maker,
                    sell.royaltyRecipient,
                    royalty
                );

                // exchange receives commission fee
                _transferToken(
                    sell.paymentToken,
                    sell.maker,
                    _commissionFeeRecipent,
                    commission
                );
            } else {
                commission = SafeMath.div(
                    SafeMath.mul(hammerPrice, _commissionFee),
                    BASIS_UNIT
                );

                // exchange receives commission fee
                _transferToken(
                    sell.paymentToken,
                    sell.maker,
                    _commissionFeeRecipent,
                    commission
                );
            }
        } else if (sell.paymentToken == address(0) && buy.taker == msg.sender) {
            require(msg.value >= hammerPrice);
            if (sell.royaltyRecipient != address(0)) {
                commission = SafeMath.div(
                    SafeMath.mul(hammerPrice, _secondCommissionFee),
                    BASIS_UNIT
                );

                uint256 royalty = SafeMath.div(
                    SafeMath.mul(hammerPrice, _royalty),
                    BASIS_UNIT
                );

                // maker receives sales amount
                uint256 receiveAmount = SafeMath.sub(
                    SafeMath.sub(hammerPrice, commission),
                    royalty
                );
                sell.maker.transfer(receiveAmount);

                // NFT minter receives royalty fee
                sell.royaltyRecipient.transfer(royalty);

                // exchange receives commission fee
                _commissionFeeRecipent.transfer(commission);
            } else {
                commission = SafeMath.div(
                    SafeMath.mul(hammerPrice, _commissionFee),
                    BASIS_UNIT
                );

                // maker receives sales amount
                uint256 receiveAmount = SafeMath.sub(hammerPrice, commission);
                sell.maker.transfer(receiveAmount);

                // exchange receives commission fee
                _commissionFeeRecipent.transfer(commission);
            }
        }

        return hammerPrice;
    }

    function hashOrder(Order memory order) private pure returns (bytes32 hash) {
        string memory side = order.side == Side.Sell ? "sell" : "buy";
        bytes32 payload = keccak256(
            abi.encodePacked(
                order.exchange,
                order.maker,
                order.taker,
                side,
                order.nftAddress,
                order.tokenId,
                order.basePrice,
                order.listingTime,
                order.expirationTime,
                order.paymentToken,
                order.royaltyRecipient
            )
        );
        return keccak256(abi.encodePacked(prefix, payload));
    }

    function setCommissionFee(uint256 newCommissionFee) external onlyOwner {
        _commissionFee = newCommissionFee;
    }

    function commissionFee() external view returns (uint256) {
        return _commissionFee;
    }

    function setSecondCommissionFee(uint256 newSecondCommissionFee)
        external
        onlyOwner
    {
        _secondCommissionFee = newSecondCommissionFee;
    }

    function secondCommissionFee() external view returns (uint256) {
        return _secondCommissionFee;
    }

    function setRoyaltyFee(uint256 newRoyalty) external onlyOwner {
        _royalty = newRoyalty;
    }

    function royaltyFee() external view returns (uint256) {
        return _royalty;
    }

    function setCommissionFeeRecipient(
        address payable newCommissionFeeRecipient
    ) external onlyOwner {
        require(newCommissionFeeRecipient != address(0));
        _commissionFeeRecipent = newCommissionFeeRecipient;
    }

    function commissionFeeRecipient() external view returns (address) {
        return _commissionFeeRecipent;
    }

    function setNewProxyRegistry(address newProxyRegistry) external onlyOwner {
        require(ProxyRegistry(newProxyRegistry).registerProxy());
        _registry = ProxyRegistry(newProxyRegistry);
    }

    function setNewProxyImplementation(address newImpl) external onlyOwner {
        require(address(_registry) != address(0));
        _registry.setNewProxyImpl(newImpl);
    }

    function proxyImplementation() public view returns (ExchangeProxyImpl) {
        ExchangeProxy proxy = ExchangeProxy(_registry.proxies(address(this)));
        require(address(proxy) != address(0));
        ExchangeProxyImpl impl = ExchangeProxyImpl(proxy.getImpl());
        require(address(impl) != address(0));
        return impl;
    }

    /**
     * Create sell/buy order
     */
    function createOrder(Order memory order) external {
        require(
            (msg.sender == order.maker && order.taker == address(0)) ||
                (msg.sender == order.taker && order.maker == address(0))
        );

        bytes32 hash = hashOrder(order);
        require(!orders[hash]);
        orders[hash] = true;
        emit OrderCreated(
            order.side,
            hash,
            order.maker,
            order.taker,
            order.royaltyRecipient,
            order.nftAddress,
            order.tokenId,
            order.basePrice,
            order.listingTime,
            order.expirationTime,
            order.paymentToken
        );
    }

    /**
     * Cancel order
     */
    function cancelOrder(Order memory order, Sig memory sig) external {
        bytes32 hash = hashOrder(order);
        require(_validateOrder(hash, order, sig));
        require(msg.sender == order.maker);
        cancelledOrFinalized[hash] = true;
        emit CancelOrder(hash);
    }

    /**
     * Accept order - seller accept the best bid price
     */
    function acceptOrder(
        Order memory buy,
        Sig memory buySig,
        Order memory sell,
        Sig memory sellSig
    ) external payable nonReentrant {
        // validate buy order
        bytes32 buyHash = hashOrder(buy);
        // when buyer selects buy now
        if (buy.taker == msg.sender) {
            require(_validateOrder(buyHash, buy, buySig), "invalid taker");
        }

        // validate sell order
        bytes32 sellHash = hashOrder(sell);
        // when seller accept bid price
        if (sell.maker == msg.sender) {
            require(_validateOrder(sellHash, sell, sellSig), "invalid maker");
        }

        require(_ordersCanMatch(buy, sell), "order does not match");

        // Check if target contract address really exists
        uint256 size;
        address nftTarget = sell.nftAddress;
        assembly {
            size := extcodesize(nftTarget)
        }
        require(size > 0);

        ExchangeProxyImpl impl = proxyImplementation();

        // transfer funds
        uint256 hammerPrice = _finalize(buy, sell);

        // transfer NFT
        require(
            impl.invoke(sell.nftAddress, sell.maker, buy.taker, sell.tokenId)
        );

        // mark orders as finalized
        cancelledOrFinalized[buyHash] = true;
        cancelledOrFinalized[sellHash] = true;

        emit MatchedOrder(
            buyHash,
            sellHash,
            sell.maker,
            buy.taker,
            hammerPrice,
            sell.paymentToken
        );
    }
}
