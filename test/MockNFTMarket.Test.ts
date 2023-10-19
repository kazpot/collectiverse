import { ethers, waffle } from "hardhat";
import MockNFTMarketAbi from "../artifacts/contracts/MockNFTMarket.sol/MockNFTMarket.json";
import MockNFTAbi from "../artifacts/contracts/MockNFT.sol/MockNFT.json";
import { MockNFTMarket } from "../types/MockNFTMarket";
import { MockNFT } from "../types/MockNFT";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { deployContract } = waffle;

describe("TestNFTMarket", () => {
  let nft: MockNFT;
  let nftAddress: string;
  let market: MockNFTMarket;
  let marketAddress: string;

  let owner: SignerWithAddress;
  let buyerAddress: SignerWithAddress;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    buyerAddress = signers[1];

    market = (await deployContract(owner, MockNFTMarketAbi)) as MockNFTMarket;
    marketAddress = market.address;

    nft = (await deployContract(owner, MockNFTAbi, [marketAddress])) as MockNFT;
    nftAddress = nft.address;
  });

  it("Should create and execute market sales", async () => {
    let listingPriceBN = await market.getListingPrice();
    let listingPrice = listingPriceBN.toString();

    await nft.createToken("https://example1.com");
    await nft.createToken("https://example2.com");

    const auctionPrice = ethers.utils.parseUnits("100", "ether");
    await market.createMarketItem(nftAddress, 1, auctionPrice, "category", {
      value: listingPrice,
    });
    await market.createMarketItem(nftAddress, 2, auctionPrice, "category", {
      value: listingPrice,
    });

    await market
      .connect(buyerAddress)
      .createMarketSale(nftAddress, 1, { value: auctionPrice });

    let items = await market.getMarketItems();
    let unsoldItems = await Promise.all(
      items.map(async (item) => {
        const tokenUri = await nft.tokenURI(item.tokenId);
        let newitem = {
          price: item.price.toString(),
          tokenId: item.tokenId.toString(),
          seller: item.seller,
          owner: item.owner,
          tokenUri,
        };
        return newitem;
      })
    );
    expect(unsoldItems.length).to.equal(1);
    expect(unsoldItems[0].tokenUri).to.equal("https://example2.com");
  });
});
