// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
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

    // FIXME: paymentToken is no longer needed
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

    event Received(address indexed sender, uint256 amount);

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
     * @dev This is called when the bid was accepted by seller or buy now by buyer
     * @param buy buy order
     * @param sell sell order
     */
    function _finalize(Order memory buy, Order memory sell)
        private
        returns (uint256)
    {
        // closing price must be greater than sell price
        uint256 sellPrice = sell.basePrice;
        uint256 closingPrice = buy.basePrice;
        require(closingPrice >= sellPrice);

        uint256 commission;

        // auction
        if (sell.maker == msg.sender) {
            sell.maker.transfer(closingPrice);

            if (sell.royaltyRecipient != address(0)) {
                commission = (closingPrice * _secondCommissionFee) / BASIS_UNIT;
                uint256 royalty = (closingPrice * _royalty) / BASIS_UNIT;

                sell.royaltyRecipient.transfer(royalty);
                _commissionFeeRecipent.transfer(commission);
            } else {
                commission = (closingPrice * _commissionFee) / BASIS_UNIT;
                _commissionFeeRecipent.transfer(commission);
            }
        // buy now 
        } else if (buy.taker == msg.sender) {
            require(msg.value >= closingPrice);
            if (sell.royaltyRecipient != address(0)) {
                commission = (closingPrice * _secondCommissionFee) / BASIS_UNIT;
                uint256 royalty = (closingPrice * _royalty) / BASIS_UNIT;

                // maker receives sales amount
                uint256 receiveAmount = closingPrice - commission - royalty;
                sell.maker.transfer(receiveAmount);

                // NFT minter receives royalty fee
                sell.royaltyRecipient.transfer(royalty);
                // exchange receives commission fee
                _commissionFeeRecipent.transfer(commission);
            } else {
                commission = (closingPrice * _commissionFee) / BASIS_UNIT;

                // maker receives sales amount
                uint256 receiveAmount = closingPrice - commission;
                sell.maker.transfer(receiveAmount);
                // exchange receives commission fee
                _commissionFeeRecipent.transfer(commission);
            }
        }

        return closingPrice;
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
     * Create sell order
     */
    function createOrder(Order memory order) external {
        require(msg.sender == order.maker && order.taker == address(0), "sender must be maker");

        bytes32 hash = hashOrder(order);
        require(!orders[hash]);

        // transfer NFT to escrow account
        ExchangeProxyImpl impl = proxyImplementation();
        require(
            impl.invoke(order.nftAddress, order.maker, address(this), order.tokenId)
        );

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
     * Create buy now order
     */
    function creatBuyNowOrder(Order memory order) external {
        require((msg.sender == order.taker && order.maker == address(0)), "sender must be taker");

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
     * Create bid order
     */
    function createBidOrder(Order memory order, Order memory prevOrder) external payable {
        require(msg.sender == order.taker && order.maker == address(0));

        // New bid must be greater than prev bid
        require(order.basePrice > prevOrder.basePrice);

        // Send bid price to escrow account
        require(msg.value == order.basePrice);

        // Refund previous bid from escrow account to buyer
        prevOrder.taker.transfer(prevOrder.basePrice);
        _cancelPrevBidOrder(prevOrder);

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
     * Create bid order
     */
    function createFirstBidOrder(Order memory order) external payable {
        require(msg.sender == order.taker && order.maker == address(0));

        bytes32 hash = hashOrder(order);
        require(!orders[hash]);

         // Send bid price to escrow account
        require(msg.value == order.basePrice);

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
     * Cancel sell order
     */
    function cancelOrder(Order memory order, Sig memory sig) external {
        require(msg.sender == order.maker);
        
        bytes32 hash = hashOrder(order);
        require(_validateOrder(hash, order, sig));

        // transfer back NFT from escrow account to seller
        ExchangeProxyImpl impl = proxyImplementation();
        require(
            impl.invoke(order.nftAddress, address(this), order.maker, order.tokenId),
            "Failed to escrow"
        );

        cancelledOrFinalized[hash] = true;
        emit CancelOrder(hash);
    }

    /**
     * Cancel previous bid
     */
    function _cancelPrevBidOrder(Order memory order) private {
        bytes32 hash = hashOrder(order);
        cancelledOrFinalized[hash] = true;
        emit CancelOrder(hash);
    }

    /**
     * Cancel order by violation
     */
    function cancelOrdeByViolation(Order memory order) external onlyOwner {
        // transfer back NFT from escrow account to seller
        ExchangeProxyImpl impl = proxyImplementation();
        require(
            impl.invoke(order.nftAddress, address(this), order.maker, order.tokenId)
        );
        bytes32 hash = hashOrder(order);
        cancelledOrFinalized[hash] = true;
        emit CancelOrder(hash);
    }

    /**
     * Accept order
     * 1. Seller accept the best bid price
     * 2. Buyer selects buy now
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

        // transfer funds
        uint256 closingPrice = _finalize(buy, sell);


        // transfer NFT from escrow account to buyer
        ExchangeProxyImpl impl = proxyImplementation();

        // approve exchange implementation contract
        IERC721 nftContract = IERC721(sell.nftAddress);
        nftContract.approve(address(impl), sell.tokenId);

        require(
            impl.invoke(sell.nftAddress, address(this), buy.taker, sell.tokenId),
            "Failed to transfer to buyer"
        );

        // mark orders as finalized
        cancelledOrFinalized[buyHash] = true;
        cancelledOrFinalized[sellHash] = true;

        emit MatchedOrder(
            buyHash,
            sellHash,
            sell.maker,
            buy.taker,
            closingPrice,
            sell.paymentToken
        );
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

    function withdraw(uint256 amount) external nonReentrant onlyOwner {
        require(amount <= payable(address(this)).balance);
        payable(msg.sender).transfer(amount);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }
}
