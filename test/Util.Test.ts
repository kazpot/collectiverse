import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import TestUtilAbi from "../artifacts/contracts/TestUtil.sol/TestUtil.json";
import UtilAbi from "../artifacts/contracts/Util.sol/Util.json";
import { Util } from "../types/Util";
import { TestUtil } from "../types/TestUtil";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { link } from "ethereum-waffle";
import { StandardContractJSON } from "ethereum-waffle/dist/esm/ContractJSON";

const { deployContract } = waffle;

describe("Util", () => {
  let owner: SignerWithAddress;
  let testUtil: TestUtil;
  let util: Util;

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];

    const contract: StandardContractJSON = {
      abi: TestUtilAbi.abi,
      evm: {
        bytecode: {
          object: TestUtilAbi.bytecode,
        },
      },
    };

    util = (await deployContract(owner, UtilAbi)) as Util;
    link(contract, "contracts/Util.sol:Util", util.address);
    testUtil = (await deployContract(owner, contract)) as TestUtil;
  });

  it("bytes32ToString", async () => {
    const arg = ethers.utils.formatBytes32String("helloworld");
    const hex = await testUtil.testBytes32ToString(arg);
    expect(hex).to.equal(
      "68656c6c6f776f726c6400000000000000000000000000000000000000000000"
    );
  });
});
