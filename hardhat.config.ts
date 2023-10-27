import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";
import "hardhat-gas-reporter";
require("dotenv").config();

task("accounts", "Print the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

export default {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: process.env.RPC_URL,
      accounts: [process.env.WALLET_SECRET],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    topos: {
      url: process.env.RPC_URL,
      accounts: [process.env.WALLET_SECRET],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
    alwaysGenerateOverloads: false,
  },
  gasReporter: {
    enabled: true,
  },
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: false,
        },
      },
    },
  },
};
