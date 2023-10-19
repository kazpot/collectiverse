import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import ExchangeAbi from "../artifacts/contracts/Exchange.sol/Exchange.json";
import ProxyRegistryabi from "../artifacts/contracts/ProxyRegistry.sol/ProxyRegistry.json";
import CommissionFeeRecipientAbi from "../artifacts/contracts/CommissionFeeRecipient.sol/CommissionFeeRecipent.json";
import NFTAbi from "../artifacts/contracts/NFT.sol/NFT.json";
import MockWETHAbi from "../artifacts/contracts/MockWETH.sol/MockWETH.json";
import { Exchange } from "../types/Exchange";
import { ProxyRegistry } from "../types/ProxyRegistry";
import { CommissionFeeRecipent } from "../types/CommissionFeeRecipent";
import { NFT } from "../types/NFT";
import { MockWETH } from "../types/MockWETH";
import { OrderStruct, SigStruct } from "../types/Exchange";
import {
  computeHashOrder,
  computeHashOrderWithPrefix,
  Side,
  emptySig,
} from "./helper";
import { BigNumber } from "ethereum-waffle/node_modules/ethers";

const { deployContract } = waffle;

describe("Exchange", () => {
  let owner: SignerWithAddress;
  let buyer1: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer2: SignerWithAddress;
  let buyer3: SignerWithAddress;
  let buyer4: SignerWithAddress;

  let exchange: Exchange;
  let proxyRegistry: ProxyRegistry;
  let commissionFeeRecipient: CommissionFeeRecipent;
  let nft: NFT;
  let weth: MockWETH;

  const zeroAddress = "0x0000000000000000000000000000000000000000";

  // tokenId for NFT token
  const tokenId = 1;
  const tokenIdTwo = 2;

  // GMT: 2022年1月10日 Monday 09:48:24
  const listingTime = 1641808104;

  // +3 minutes
  const expirationTime = listingTime + 3 * 60;

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    buyer1 = signers[1];
    seller = signers[2];
    buyer2 = signers[3];
    buyer3 = signers[4];
    buyer4 = signers[5];

    exchange = (await deployContract(owner, ExchangeAbi)) as Exchange;

    await exchange.approveArtist(await owner.getAddress());
    await exchange.approveArtist(await seller.getAddress());

    commissionFeeRecipient = (await deployContract(
      owner,
      CommissionFeeRecipientAbi
    )) as CommissionFeeRecipent;
    await exchange.setCommissionFeeRecipient(commissionFeeRecipient.address);

    proxyRegistry = (await deployContract(
      owner,
      ProxyRegistryabi
    )) as ProxyRegistry;
    await proxyRegistry.beginGrantAuth(exchange.address);
    await proxyRegistry.finishGrantAuth(exchange.address);
    await exchange.setNewProxyRegistry(proxyRegistry.address);

    nft = (await deployContract(owner, NFTAbi)) as NFT;
    weth = (await deployContract(owner, MockWETHAbi)) as MockWETH;
  });

  it("Should set the right owner", async () => {
    expect(await exchange.owner()).to.equal(owner.address);
  });

  it("Set commission fee", async () => {
    const defaultCommissionFee = 150;
    const defaultSecondCommissionfee = 70;

    const commissionFee = 200;
    const secondCommissionfee = 100;

    await exchange.setCommissionFee(commissionFee);
    const c1 = await exchange.commissionFee();
    expect(c1.toString()).to.equal(commissionFee.toString());

    await exchange.setSecondCommissionFee(secondCommissionfee);
    const c2 = await exchange.secondCommissionFee();
    expect(c2.toString()).to.equal(secondCommissionfee.toString());

    // revert
    await exchange.setCommissionFee(defaultCommissionFee);
    const c3 = await exchange.commissionFee();
    expect(c3.toString()).to.equal(defaultCommissionFee.toString());

    await exchange.setSecondCommissionFee(defaultSecondCommissionfee);
    const c4 = await exchange.secondCommissionFee();
    expect(c4.toString()).to.equal(defaultSecondCommissionfee.toString());
  });

  it("Set royalty", async () => {
    const defaultRoyalty = 100;
    const royalty = 50;

    await exchange.setRoyaltyFee(royalty);
    const r = await exchange.royaltyFee();
    expect(r.toString()).to.equal(royalty.toString());

    await exchange.setRoyaltyFee(defaultRoyalty);
    const r2 = await exchange.royaltyFee();
    expect(r2.toString()).to.equal(defaultRoyalty.toString());
  });

  it("Failed to set commission fee", async () => {
    const commissionFee = 200;
    await expect(
      exchange.connect(buyer1).setCommissionFee(commissionFee)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Failed to set second commission fee", async () => {
    const commissionFee = 200;
    await expect(
      exchange.connect(buyer1).setSecondCommissionFee(commissionFee)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Failed to set royalty", async () => {
    const royalty = 200;
    await expect(
      exchange.connect(buyer1).setRoyaltyFee(royalty)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Check if commissionFeeRecipient is set", async () => {
    const commissionFeeRecipient = await exchange.commissionFeeRecipient();
    expect(commissionFeeRecipient).to.not.equal(zeroAddress);
  });

  it("Create token by seller", async () => {
    await expect(nft.connect(seller).createToken("http://example.com"))
      .to.emit(nft, "Transfer")
      .withArgs(zeroAddress, seller.address, 1);
    const sellerTokenBalance = await nft.balanceOf(seller.address);
    expect(sellerTokenBalance).to.equal(1);
  });

  it("Transfer initial funds", async () => {
    const amountForBuyer = ethers.utils.parseUnits("100", "ether");
    await weth.approve(owner.address, amountForBuyer);
    await weth.transferFrom(owner.address, buyer1.address, amountForBuyer);
    const buyerBalance = await weth.balanceOf(buyer1.address);
    expect(buyerBalance.toString()).to.equal("100000000000000000000");

    await weth.approve(owner.address, amountForBuyer);
    await weth.transferFrom(owner.address, buyer2.address, amountForBuyer);
    const buyer2Balance = await weth.balanceOf(buyer2.address);
    expect(buyer2Balance.toString()).to.equal("100000000000000000000");

    await weth.approve(owner.address, amountForBuyer);
    await weth.transferFrom(owner.address, buyer3.address, amountForBuyer);
    const buyer3Balance = await weth.balanceOf(buyer3.address);
    expect(buyer3Balance.toString()).to.equal("100000000000000000000");

    await weth.approve(owner.address, amountForBuyer);
    await weth.transferFrom(owner.address, buyer4.address, amountForBuyer);
    const buyer4Balance = await weth.balanceOf(buyer4.address);
    expect(buyer4Balance.toString()).to.equal("100000000000000000000");

    const amountForSeller = ethers.utils.parseUnits("100", "ether");
    await weth.approve(owner.address, amountForSeller);
    await weth.transferFrom(owner.address, seller.address, amountForSeller);
    const sellerBalance = await weth.balanceOf(seller.address);
    expect(sellerBalance.toString()).to.equal("100000000000000000000");
  });

  it("Create sell order", async () => {
    const firstPrice = ethers.utils.parseUnits("2", "ether");

    let sell: OrderStruct = {
      exchange: exchange.address,
      maker: seller.address,
      taker: zeroAddress,
      royaltyRecipient: zeroAddress,
      side: Side.Sell,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenId),
      basePrice: ethers.BigNumber.from(firstPrice),
      listingTime: ethers.BigNumber.from(listingTime),
      expirationTime: ethers.BigNumber.from(expirationTime),
      paymentToken: weth.address,
    };

    const hash = computeHashOrderWithPrefix(sell);
    await expect(exchange.connect(seller).createOrder(sell))
      .to.emit(exchange, "OrderCreated")
      .withArgs(
        Side.Sell,
        hash,
        seller.address,
        zeroAddress,
        zeroAddress,
        nft.address,
        ethers.BigNumber.from(tokenId),
        ethers.BigNumber.from(firstPrice),
        listingTime,
        expirationTime,
        weth.address
      );
  });

  it("Crate buy order", async () => {
    // first bid
    const bidPrice1 = ethers.utils.parseUnits("3", "ether");

    let buy1: OrderStruct = {
      exchange: exchange.address,
      maker: zeroAddress,
      taker: buyer1.address,
      royaltyRecipient: zeroAddress,
      side: Side.Buy,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenId),
      basePrice: ethers.BigNumber.from(bidPrice1),
      listingTime: ethers.BigNumber.from(listingTime),
      expirationTime: ethers.BigNumber.from(expirationTime),
      paymentToken: weth.address,
    };

    const hash1 = computeHashOrderWithPrefix(buy1);
    await expect(exchange.connect(buyer1).createOrder(buy1))
      .to.emit(exchange, "OrderCreated")
      .withArgs(
        Side.Buy,
        hash1,
        zeroAddress,
        buyer1.address,
        zeroAddress,
        nft.address,
        ethers.BigNumber.from(tokenId),
        ethers.BigNumber.from(bidPrice1),
        listingTime,
        expirationTime,
        weth.address
      );
    await weth.connect(buyer1).approve(exchange.address, bidPrice1);
    const buyer1Allowance = await weth
      .connect(buyer1)
      .allowance(buyer1.address, exchange.address);
    expect(buyer1Allowance.toString()).to.equal("3000000000000000000");

    // second bid
    const bidPrice2 = ethers.utils.parseUnits("4", "ether");

    let buy2: OrderStruct = {
      exchange: exchange.address,
      maker: zeroAddress,
      taker: buyer2.address,
      royaltyRecipient: zeroAddress,
      side: Side.Buy,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenId),
      basePrice: ethers.BigNumber.from(bidPrice2),
      listingTime: ethers.BigNumber.from(listingTime),
      expirationTime: ethers.BigNumber.from(expirationTime),
      paymentToken: weth.address,
    };

    const hash2 = computeHashOrderWithPrefix(buy2);
    await expect(exchange.connect(buyer2).createOrder(buy2))
      .to.emit(exchange, "OrderCreated")
      .withArgs(
        Side.Buy,
        hash2,
        zeroAddress,
        buyer2.address,
        zeroAddress,
        nft.address,
        ethers.BigNumber.from(tokenId),
        ethers.BigNumber.from(bidPrice2),
        listingTime,
        expirationTime,
        weth.address
      );
    await weth.connect(buyer2).approve(exchange.address, bidPrice2);
    const buyer2Allowance = await weth
      .connect(buyer2)
      .allowance(buyer2.address, exchange.address);
    expect(buyer2Allowance.toString()).to.equal("4000000000000000000");
  });

  it("Accept order", async () => {
    let listingT = Math.floor(Date.now() / 1000);

    // +3 minutes
    let expirationT = listingT + 3 * 60;

    const basePrice = ethers.utils.parseUnits("2", "ether");
    const bidPrice = ethers.utils.parseUnits("4", "ether");

    let sell: OrderStruct = {
      exchange: exchange.address,
      maker: seller.address,
      taker: zeroAddress,
      royaltyRecipient: zeroAddress,
      side: Side.Sell,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenId),
      basePrice: ethers.BigNumber.from(basePrice),
      listingTime: ethers.BigNumber.from(listingT),
      expirationTime: ethers.BigNumber.from(expirationT),
      paymentToken: weth.address,
    };

    let buy: OrderStruct = {
      exchange: exchange.address,
      maker: zeroAddress,
      taker: buyer1.address,
      royaltyRecipient: zeroAddress,
      side: Side.Buy,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenId),
      basePrice: ethers.BigNumber.from(bidPrice),
      listingTime: ethers.BigNumber.from(listingT),
      expirationTime: ethers.BigNumber.from(expirationT),
      paymentToken: weth.address,
    };

    await exchange.connect(seller).createOrder(sell);
    await exchange.connect(buyer1).createOrder(buy);

    // sell sid signature
    const sellHash = computeHashOrder(sell);
    const sig = await seller.signMessage(ethers.utils.arrayify(sellHash));
    const expanded = ethers.utils.splitSignature(sig);
    let sellSig: SigStruct = {
      v: expanded.v,
      r: expanded.r,
      s: expanded.s,
    };

    // verify signature
    const recoverd = ethers.utils.verifyMessage(
      ethers.utils.arrayify(sellHash),
      sig
    );
    expect(recoverd).to.equal(seller.address);

    // 15%
    const commissionFeeRate = await exchange.commissionFee();
    const commissionFeeRateBN: BigNumber =
      ethers.BigNumber.from(commissionFeeRate);

    // 4 ETH
    const buyPriceBN: BigNumber = ethers.BigNumber.from(bidPrice);

    // 4 * 0.15 = 0.6 ETH
    const commissionFee: BigNumber = buyPriceBN
      .mul(commissionFeeRateBN)
      .div(1000);

    // approvals for token transfer
    await weth.connect(buyer1).approve(exchange.address, bidPrice);
    await weth.connect(seller).approve(exchange.address, commissionFee);

    // approve proxy implementation for transferting NFT from seller
    const proxyImplAddress = await exchange.proxyImplementation();
    await nft.connect(seller).approve(proxyImplAddress, tokenId);

    // seller accepts order
    const sellHashPrefix = computeHashOrderWithPrefix(sell);
    const buyHashPrefix = computeHashOrderWithPrefix(buy);

    await expect(
      exchange.connect(seller).acceptOrder(buy, emptySig, sell, sellSig)
    )
      .to.emit(exchange, "MatchedOrder")
      .withArgs(
        buyHashPrefix,
        sellHashPrefix,
        sell.maker,
        buy.taker,
        bidPrice,
        sell.paymentToken
      );

    // platform receives 0.6ETH
    const platformBalance = await commissionFeeRecipient.totalTokenBalance(
      weth.address
    );
    expect(platformBalance).to.equal(commissionFee);

    // seller balance = 100ETH + 4ETH - 0.6ETH = 103.4ETH
    const sellerBalance = await weth.balanceOf(seller.address);
    expect(sellerBalance).to.equal(
      ethers.BigNumber.from("100000000000000000000")
        .add(bidPrice)
        .sub(commissionFee)
    );

    // buyer balance = 100ETH - 4ETH = 96ETH
    const buyer1Balance = await weth.balanceOf(buyer1.address);
    expect(buyer1Balance).to.equal(
      ethers.BigNumber.from("100000000000000000000").sub(bidPrice)
    );

    // sellet NFT balance after transaction
    const sellerTokenBalance = await nft.balanceOf(seller.address);
    expect(sellerTokenBalance).to.equal(0);

    // buyer NFT balance after transaction
    const buyer1TokenBalance = await nft.balanceOf(buyer1.address);
    expect(buyer1TokenBalance).to.equal(1);

    // make sure if orders are finalized
    const sellFinalized = await exchange.cancelledOrFinalized(sellHashPrefix);
    expect(sellFinalized).to.equal(true);

    const buyFinalized = await exchange.cancelledOrFinalized(buyHashPrefix);
    expect(buyFinalized).to.equal(true);
  });

  it("Buy now", async () => {
    // seller mints NFT token
    await expect(nft.connect(seller).createToken("http://example.com"))
      .to.emit(nft, "Transfer")
      .withArgs(zeroAddress, seller.address, tokenIdTwo);
    const sellerTokenBalance = await nft.balanceOf(seller.address);
    expect(sellerTokenBalance).to.equal(1);

    let listingT = Math.floor(Date.now() / 1000);

    const basePrice = ethers.utils.parseUnits("2", "ether");
    const buyPrice = ethers.utils.parseUnits("2", "ether");

    let sell: OrderStruct = {
      exchange: exchange.address,
      maker: seller.address,
      taker: zeroAddress,
      royaltyRecipient: zeroAddress,
      side: Side.Sell,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenIdTwo),
      basePrice: ethers.BigNumber.from(basePrice),
      listingTime: ethers.BigNumber.from(listingT),
      expirationTime: ethers.BigNumber.from(0),
      paymentToken: zeroAddress,
    };

    let buy: OrderStruct = {
      exchange: exchange.address,
      maker: zeroAddress,
      taker: buyer2.address,
      royaltyRecipient: zeroAddress,
      side: Side.Buy,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenIdTwo),
      basePrice: ethers.BigNumber.from(buyPrice),
      listingTime: ethers.BigNumber.from(listingT),
      expirationTime: ethers.BigNumber.from(0),
      paymentToken: zeroAddress,
    };

    await exchange.connect(seller).createOrder(sell);
    await exchange.connect(buyer2).createOrder(buy);

    // buy side signature
    const buyHash = computeHashOrder(buy);
    const sig = await buyer2.signMessage(ethers.utils.arrayify(buyHash));
    const expanded = ethers.utils.splitSignature(sig);
    let buySig: SigStruct = {
      v: expanded.v,
      r: expanded.r,
      s: expanded.s,
    };

    // verify signature
    const recoverd = ethers.utils.verifyMessage(
      ethers.utils.arrayify(buyHash),
      sig
    );
    expect(recoverd).to.equal(buyer2.address);

    // 15%
    const commissionFeeRate = await exchange.commissionFee();
    const commissionFeeRateBN: BigNumber =
      ethers.BigNumber.from(commissionFeeRate);

    // 2 ETH
    const buyPriceBN: BigNumber = ethers.BigNumber.from(buyPrice);

    // 2 * 0.15 = 0.3 ETH
    const commissionFee: BigNumber = buyPriceBN
      .mul(commissionFeeRateBN)
      .div(1000);

    // approve proxy implementation for transferting NFT from seller
    const proxyImplAddress = await exchange.proxyImplementation();
    await nft.connect(seller).approve(proxyImplAddress, tokenIdTwo);

    // buyer accepts order
    const sellHashPrefix = computeHashOrderWithPrefix(sell);
    const buyHashPrefix = computeHashOrderWithPrefix(buy);

    await expect(
      exchange
        .connect(buyer2)
        .acceptOrder(buy, buySig, sell, emptySig, { value: buyPrice })
    )
      .to.emit(exchange, "MatchedOrder")
      .withArgs(
        buyHashPrefix,
        sellHashPrefix,
        sell.maker,
        buy.taker,
        buyPrice,
        sell.paymentToken
      );

    // platform receives 0.3 ETH
    const platformBalance = await commissionFeeRecipient.totalEthBalance();
    expect(platformBalance).to.equal(commissionFee);

    // sellet NFT balance after transaction
    const sellerResultBalance = await nft.balanceOf(seller.address);
    expect(sellerResultBalance).to.equal(0);

    // buyer NFT balance after transaction
    const buyer2TokenBalance = await nft.balanceOf(buyer2.address);
    expect(buyer2TokenBalance).to.equal(1);
  });

  it("Accept order - Resell buyer1 -> buyer3", async () => {
    // seller -> minter
    // buyer1 -> seller
    // buyer3 -> buyer

    let listingT = Math.floor(Date.now() / 1000);

    // +3 minutes
    let expirationT = listingT + 3 * 60;

    const basePrice = ethers.utils.parseUnits("2", "ether");
    const bidPrice = ethers.utils.parseUnits("4", "ether");

    let sell: OrderStruct = {
      exchange: exchange.address,
      maker: buyer1.address,
      taker: zeroAddress,
      royaltyRecipient: seller.address,
      side: Side.Sell,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenId),
      basePrice: ethers.BigNumber.from(basePrice),
      listingTime: ethers.BigNumber.from(listingT),
      expirationTime: ethers.BigNumber.from(expirationT),
      paymentToken: weth.address,
    };

    let buy: OrderStruct = {
      exchange: exchange.address,
      maker: zeroAddress,
      taker: buyer3.address,
      royaltyRecipient: zeroAddress,
      side: Side.Buy,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenId),
      basePrice: ethers.BigNumber.from(bidPrice),
      listingTime: ethers.BigNumber.from(listingT),
      expirationTime: ethers.BigNumber.from(expirationT),
      paymentToken: weth.address,
    };

    await exchange.connect(buyer1).createOrder(sell);
    await exchange.connect(buyer3).createOrder(buy);

    // sell sid signature
    const sellHash = computeHashOrder(sell);
    const sig = await buyer1.signMessage(ethers.utils.arrayify(sellHash));
    const expanded = ethers.utils.splitSignature(sig);
    let sellSig: SigStruct = {
      v: expanded.v,
      r: expanded.r,
      s: expanded.s,
    };

    // verify signature
    const recoverd = ethers.utils.verifyMessage(
      ethers.utils.arrayify(sellHash),
      sig
    );
    expect(recoverd).to.equal(buyer1.address);

    // 7%
    const secondCommissionFeeRate = await exchange.secondCommissionFee();
    const secondCommissionFeeRateBN: BigNumber = ethers.BigNumber.from(
      secondCommissionFeeRate
    );

    // 10%
    const royaltyFeeRate = await exchange.royaltyFee();
    const royaltyFeeRateBN: BigNumber = ethers.BigNumber.from(royaltyFeeRate);

    // 4 ETH
    const buyPriceBN: BigNumber = ethers.BigNumber.from(bidPrice);

    // 4 ETH * 0.07 = 0.28 ETH
    const secondCommissionFee: BigNumber = buyPriceBN
      .mul(secondCommissionFeeRateBN)
      .div(1000);

    // 4 ETH * 0.1 = 0.4 ETH
    const royaltyFee: BigNumber = buyPriceBN.mul(royaltyFeeRateBN).div(1000);

    // approvals for token transfer
    await weth.connect(buyer3).approve(exchange.address, bidPrice);
    await weth
      .connect(buyer1)
      .approve(exchange.address, secondCommissionFee.add(royaltyFee));

    // approve proxy implementation for transferting NFT from seller
    const proxyImplAddress = await exchange.proxyImplementation();
    await nft.connect(buyer1).approve(proxyImplAddress, tokenId);

    // seller accepts order
    const sellHashPrefix = computeHashOrderWithPrefix(sell);
    const buyHashPrefix = computeHashOrderWithPrefix(buy);

    await expect(
      exchange.connect(buyer1).acceptOrder(buy, emptySig, sell, sellSig)
    )
      .to.emit(exchange, "MatchedOrder")
      .withArgs(
        buyHashPrefix,
        sellHashPrefix,
        sell.maker,
        buy.taker,
        bidPrice,
        sell.paymentToken
      );

    // platform receives 0.6 ETH + 0.28 ETH = 0.88 ETH
    const platformBalance = await commissionFeeRecipient.totalTokenBalance(
      weth.address
    );
    expect(platformBalance.toString()).to.equal("880000000000000000");

    // buyer1 balance = 96 ETH - (4 ETH - 0.68 ETH) = 99.32 ETH
    const buyer1Balance = await weth.balanceOf(buyer1.address);
    expect(buyer1Balance.toString()).to.equal("99320000000000000000");

    // buyer balance = 100 ETH - 4 ETH = 96 ETH
    const buyer3Balance = await weth.balanceOf(buyer3.address);
    expect(buyer3Balance.toString()).to.equal("96000000000000000000");

    // minter balance = 103.4 ETH + 0.4 ETH = 103.8 ETH
    const minterBalance = await weth.balanceOf(seller.address);
    expect(minterBalance.toString()).to.equal("103800000000000000000");

    // sellet NFT balance after transaction
    const sellerTokenBalance = await nft.balanceOf(buyer1.address);
    expect(sellerTokenBalance).to.equal(0);

    // buyer NFT balance after transaction
    const buyer1TokenBalance = await nft.balanceOf(buyer3.address);
    expect(buyer1TokenBalance).to.equal(1);

    // make sure if orders are finalized
    const sellFinalized = await exchange.cancelledOrFinalized(sellHashPrefix);
    expect(sellFinalized).to.equal(true);

    const buyFinalized = await exchange.cancelledOrFinalized(buyHashPrefix);
    expect(buyFinalized).to.equal(true);
  });

  it("Buy now - Resell buyer2 -> buyer4", async () => {
    // buyer2 has 1 NFT
    const sellerTokenBalance = await nft.balanceOf(buyer2.address);
    expect(sellerTokenBalance).to.equal(1);

    let listingT = Math.floor(Date.now() / 1000);

    const basePrice = ethers.utils.parseUnits("2", "ether");
    const buyPrice = ethers.utils.parseUnits("2", "ether");

    let sell: OrderStruct = {
      exchange: exchange.address,
      maker: buyer2.address,
      taker: zeroAddress,
      royaltyRecipient: seller.address,
      side: Side.Sell,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenIdTwo),
      basePrice: ethers.BigNumber.from(basePrice),
      listingTime: ethers.BigNumber.from(listingT),
      expirationTime: ethers.BigNumber.from(0),
      paymentToken: zeroAddress,
    };

    let buy: OrderStruct = {
      exchange: exchange.address,
      maker: zeroAddress,
      taker: buyer4.address,
      royaltyRecipient: seller.address,
      side: Side.Buy,
      nftAddress: nft.address,
      tokenId: ethers.BigNumber.from(tokenIdTwo),
      basePrice: ethers.BigNumber.from(buyPrice),
      listingTime: ethers.BigNumber.from(listingT),
      expirationTime: ethers.BigNumber.from(0),
      paymentToken: zeroAddress,
    };

    await exchange.connect(buyer2).createOrder(sell);
    await exchange.connect(buyer4).createOrder(buy);

    // buy side signature
    const buyHash = computeHashOrder(buy);
    const sig = await buyer4.signMessage(ethers.utils.arrayify(buyHash));
    const expanded = ethers.utils.splitSignature(sig);
    let buySig: SigStruct = {
      v: expanded.v,
      r: expanded.r,
      s: expanded.s,
    };

    // verify signature
    const recoverd = ethers.utils.verifyMessage(
      ethers.utils.arrayify(buyHash),
      sig
    );
    expect(recoverd).to.equal(buyer4.address);

    // 7%
    const secondCommissionFeeRate = await exchange.secondCommissionFee();
    const secondCommissionFeeRateBN: BigNumber = ethers.BigNumber.from(
      secondCommissionFeeRate
    );

    // 10%
    const royaltyFeeRate = await exchange.royaltyFee();
    const royaltyFeeRateBN: BigNumber = ethers.BigNumber.from(royaltyFeeRate);

    // 2 ETH
    const buyPriceBN: BigNumber = ethers.BigNumber.from(buyPrice);

    // 2 ETH * 0.07 = 0.14 ETH
    const secondCommissionFee: BigNumber = buyPriceBN
      .mul(secondCommissionFeeRateBN)
      .div(1000);
    expect(secondCommissionFee.toString()).to.equal("140000000000000000");

    // 2 ETH * 0.1 = 0.2 ETH
    const royaltyFee: BigNumber = buyPriceBN.mul(royaltyFeeRateBN).div(1000);

    // approve proxy implementation for transferting NFT from seller
    const proxyImplAddress = await exchange.proxyImplementation();
    await nft.connect(buyer2).approve(proxyImplAddress, tokenIdTwo);

    // seller accepts order
    const sellHashPrefix = computeHashOrderWithPrefix(sell);
    const buyHashPrefix = computeHashOrderWithPrefix(buy);

    // minter balance before transaction
    const minterBalance1 = await seller.getBalance();

    await expect(
      exchange
        .connect(buyer4)
        .acceptOrder(buy, buySig, sell, emptySig, { value: buyPrice })
    )
      .to.emit(exchange, "MatchedOrder")
      .withArgs(
        buyHashPrefix,
        sellHashPrefix,
        sell.maker,
        buy.taker,
        buyPrice,
        sell.paymentToken
      );

    // platform receives 0.3 ETH + 0.14 ETH = 0.44 ETH
    const platformBalance = await commissionFeeRecipient.totalEthBalance();
    expect(platformBalance.toString()).to.equal("440000000000000000");

    // minter balance after transaction
    const minterBalance2 = await seller.getBalance();

    // minter receives royalty fee 0.2 ETH
    expect(minterBalance2.sub(minterBalance1)).to.equal(royaltyFee);

    // sellet NFT balance after transaction
    const sellerResultBalance = await nft.balanceOf(buyer2.address);
    expect(sellerResultBalance).to.equal(0);

    // buyer NFT balance after transaction
    const buyer4TokenBalance = await nft.balanceOf(buyer4.address);
    expect(buyer4TokenBalance).to.equal(1);
  });
});
