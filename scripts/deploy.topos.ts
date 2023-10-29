import { run, ethers } from "hardhat";

async function main() {
  console.log("🟥 Start deploying to mainnet 🟥");
  await run("compile");

  const [owner] = await ethers.getSigners();
  console.log("🔷 owner: ", owner.address);
  console.log("🔷 account balance:", (await owner.getBalance()).toString());

  // Exchange
  const Exchange = await ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy();
  await exchange.deployed();

  const defaultCommissionFeeRate = await exchange.commissionFee();
  const defaultSeconCommissionFeeRate = await exchange.secondCommissionFee();
  const defaultRoyaltyFeeRate = await exchange.royaltyFee();
  console.log(
    `🔷 exchange commission fee rate: ${defaultCommissionFeeRate
      .div(10)
      .toString()}%`
  );
  console.log(
    `🔷 exchange second commnission fee rate: ${defaultSeconCommissionFeeRate
      .div(10)
      .toString()}%`
  );
  console.log(
    `🔷 exchange royalty fee rate: ${defaultRoyaltyFeeRate.div(10).toString()}%`
  );

  // CommissionFeeRecipent
  const CommissionFeeRecipent = await ethers.getContractFactory(
    "CommissionFeeRecipent"
  );
  const commissionFeeRecipent = await CommissionFeeRecipent.deploy();
  await commissionFeeRecipent.deployed();
  console.log(
    "🔷 commisionFeeRecipient address: ",
    commissionFeeRecipent.address
  );

  await exchange.setCommissionFeeRecipient(commissionFeeRecipent.address);
  console.log("🔷 commisionFeeRecipientAddr was set to exchange");

  // ProxyRegistry
  const ProxyRegistry = await ethers.getContractFactory("ProxyRegistry");
  const proxyRegistry = await ProxyRegistry.deploy();
  await proxyRegistry.deployed();

  await proxyRegistry.beginGrantAuth(exchange.address);
  await proxyRegistry.finishGrantAuth(exchange.address);
  await exchange.setNewProxyRegistry(proxyRegistry.address);
  console.log("🔷 proxyRegistry was set to exchange: ", proxyRegistry.address);

  // NFT
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();

  console.log("✅ exchange address:", exchange.address);
  console.log(
    "✅ commissionFeeRecipent address:",
    commissionFeeRecipent.address
  );
  console.log("✅ proxyRegistry address:", proxyRegistry.address);
  console.log("✅ nft address:", nft.address);

  console.log("-- .env --");
  console.log(`NEXT_PUBLIC_EXCHANGE_ADDRESS=${exchange.address}`);
  console.log(`NEXT_PUBLIC_NFT_ADDRESS=${nft.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
