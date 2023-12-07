/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TestUtil, TestUtilInterface } from "../TestUtil";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "message",
        type: "bytes32",
      },
    ],
    name: "testBytes32ToString",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506102f4806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80630a21ef9514610030575b600080fd5b61004361003e3660046100e5565b610059565b6040516100509190610170565b60405180910390f35b604051639201de5560e01b815260609073__$f781bb3d3060cc7c00f7d655d3b188f1f9$__90639201de5590610093908590600401610188565b600060405180830381865af41580156100b0573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526100d89190810190610283565b92915050565b80356100d8565b6000602082840312156100fa576100fa600080fd5b600061010684846100de565b949350505050565b60005b83811015610129578181015183820152602001610111565b83811115610138576000848401525b50505050565b6000610148825190565b80845260208401935061015f81856020860161010e565b601f01601f19169290920192915050565b60208082528101610181818461013e565b9392505050565b818152602081016100d8565b634e487b7160e01b600052604160045260246000fd5b601f19601f830116810181811067ffffffffffffffff821117156101d0576101d0610194565b6040525050565b60006101e260405190565b90506101ee82826101aa565b919050565b600067ffffffffffffffff82111561020d5761020d610194565b601f19601f83011660200192915050565b600061023161022c846101f3565b6101d7565b90508281526020810184848401111561024c5761024c600080fd5b61025784828561010e565b509392505050565b600082601f83011261027357610273600080fd5b815161010684826020860161021e565b60006020828403121561029857610298600080fd5b815167ffffffffffffffff8111156102b2576102b2600080fd5b6101068482850161025f56fea2646970667358221220d9cbf68185b48eee3a3c9f11b68d32c3934623245ef57ee5e596cb03eea47e4d64736f6c634300080b0033";

type TestUtilConstructorParams =
  | [linkLibraryAddresses: TestUtilLibraryAddresses, signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestUtilConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => {
  return (
    typeof xs[0] === "string" ||
    (Array.isArray as (arg: any) => arg is readonly any[])(xs[0]) ||
    "_isInterface" in xs[0]
  );
};

export class TestUtil__factory extends ContractFactory {
  constructor(...args: TestUtilConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      const [linkLibraryAddresses, signer] = args;
      super(_abi, TestUtil__factory.linkBytecode(linkLibraryAddresses), signer);
    }
  }

  static linkBytecode(linkLibraryAddresses: TestUtilLibraryAddresses): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$f781bb3d3060cc7c00f7d655d3b188f1f9\\$__", "g"),
      linkLibraryAddresses["contracts/Util.sol:Util"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestUtil> {
    return super.deploy(overrides || {}) as Promise<TestUtil>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TestUtil {
    return super.attach(address) as TestUtil;
  }
  connect(signer: Signer): TestUtil__factory {
    return super.connect(signer) as TestUtil__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestUtilInterface {
    return new utils.Interface(_abi) as TestUtilInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestUtil {
    return new Contract(address, _abi, signerOrProvider) as TestUtil;
  }
}

export interface TestUtilLibraryAddresses {
  ["contracts/Util.sol:Util"]: string;
}
