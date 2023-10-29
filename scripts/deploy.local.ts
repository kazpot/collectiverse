import { run, ethers } from "hardhat";

async function main() {
  console.log("⬜️ Start deploying to local ⬜️");

  await run("compile");

  const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();
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
  console.log("🔷 commisionFeeRecipientAddr was set to exchange: ");

  // ProxyRegistry
  const ProxyRegistry = await ethers.getContractFactory("ProxyRegistry");
  const proxyRegistry = await ProxyRegistry.deploy();
  await proxyRegistry.deployed();

  await proxyRegistry.beginGrantAuth(exchange.address);
  await proxyRegistry.finishGrantAuth(exchange.address);
  await exchange.setNewProxyRegistry(proxyRegistry.address);
  console.log("🔷 proxyRegistry was set to exchange: ", proxyRegistry.address);

  // MockERC20
  const MockWETH = await ethers.getContractFactory("MockWETH");
  const mockWETH = await MockWETH.deploy();
  await mockWETH.deployed();

  // NFT
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();

  // distribute 100 WETH for each user
  const amount = ethers.utils.parseUnits("100", "ether");
  await mockWETH.approve(owner.address, amount.mul(5));

  await mockWETH.transferFrom(owner.address, user1.address, amount);
  const user1Balance = await mockWETH.balanceOf(user1.address);
  console.log(
    `🔷 user1 balance: ${ethers.utils.formatEther(
      user1Balance.toString()
    )} WETH`
  );

  await mockWETH.transferFrom(owner.address, user2.address, amount);
  const user2Balance = await mockWETH.balanceOf(user2.address);
  console.log(
    `🔷 user2 balance: ${ethers.utils.formatEther(
      user2Balance.toString()
    )} WETH`
  );

  await mockWETH.transferFrom(owner.address, user3.address, amount);
  const user3Balance = await mockWETH.balanceOf(user3.address);
  console.log(
    `🔷 user3 balance: ${ethers.utils.formatEther(
      user3Balance.toString()
    )} WETH`
  );

  await mockWETH.transferFrom(owner.address, user4.address, amount);
  const user4Balance = await mockWETH.balanceOf(user4.address);
  console.log(
    `🔷 user4 balance: ${ethers.utils.formatEther(
      user4Balance.toString()
    )} WETH`
  );

  await mockWETH.transferFrom(owner.address, user5.address, amount);
  const user5Balance = await mockWETH.balanceOf(user5.address);
  console.log(
    `🔷 user5 balance: ${ethers.utils.formatEther(
      user5Balance.toString()
    )} WETH`
  );

  console.log("✅ exchange address:", exchange.address);
  console.log(
    "✅ commissionFeeRecipent address:",
    commissionFeeRecipent.address
  );
  console.log("✅ proxyRegistry address:", proxyRegistry.address);
  console.log("✅ mockWETH address:", mockWETH.address);
  console.log("✅ nft address:", nft.address);

  console.log("-- .env --");
  console.log(`NEXT_PUBLIC_EXCHANGE_ADDRESS=${exchange.address}`);
  console.log(`NEXT_PUBLIC_NFT_ADDRESS=${nft.address}`);
  console.log(`NEXT_PUBLIC_WETH_ADDRESS=${mockWETH.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
