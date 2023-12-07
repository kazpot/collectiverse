/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Util, UtilInterface } from "../Util";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "addressToString",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_bytes32",
        type: "bytes32",
      },
    ],
    name: "bytes32ToString",
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
  "0x6105e361003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100405760003560e01c80635e57966d146100455780639201de551461006e575b600080fd5b6100586100533660046103f6565b610081565b6040516100659190610481565b60405180910390f35b61005861007c3660046104a3565b61026c565b604080518082018252601081526f181899199a1a9b1b9c1cb0b131b232b360811b60208201528151603380825260608281019094526001600160a01b0385169291600091602082018180368337019050509050600360fc1b816000815181106100ec576100ec6104c4565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061011b5761011b6104c4565b60200101906001600160f81b031916908160001a90535060005b6014811015610263578260048561014d84600c6104f0565b6020811061015d5761015d6104c4565b1a60f81b6001600160f81b031916901c60f81c60ff1681518110610183576101836104c4565b01602001516001600160f81b0319168261019e836002610508565b6101a99060026104f0565b815181106101b9576101b96104c4565b60200101906001600160f81b031916908160001a90535082846101dd83600c6104f0565b602081106101ed576101ed6104c4565b825191901a600f16908110610204576102046104c4565b01602001516001600160f81b0319168261021f836002610508565b61022a9060036104f0565b8151811061023a5761023a6104c4565b60200101906001600160f81b031916908160001a9053508061025b81610527565b915050610135565b50949350505050565b6040805181815260608181018352916000918291602082018180368337019050509050600091505b80518260ff16101561038d5760006004856102b0600286610558565b60ff16602081106102c3576102c36104c4565b1a60f81b6001600160f81b031916901c60f81c90506000856002856102e89190610558565b60ff16602081106102fb576102fb6104c4565b1a600f16905061030a82610394565b838560ff168151811061031f5761031f6104c4565b60200101906001600160f81b031916908160001a905350610341846001610573565b935061034c81610394565b838560ff1681518110610361576103616104c4565b60200101906001600160f81b031916908160001a9053505050818061038590610594565b925050610294565b9392505050565b6000600a8260ff1610156103b6576103ad826030610573565b60f81b92915050565b6103ad826057610573565b60006001600160a01b0382165b92915050565b6103dd816103c1565b81146103e857600080fd5b50565b80356103ce816103d4565b60006020828403121561040b5761040b600080fd5b600061041784846103eb565b949350505050565b60005b8381101561043a578181015183820152602001610422565b83811115610449576000848401525b50505050565b6000610459825190565b80845260208401935061047081856020860161041f565b601f01601f19169290920192915050565b6020808252810161038d818461044f565b806103dd565b80356103ce81610492565b6000602082840312156104b8576104b8600080fd5b60006104178484610498565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60008219821115610503576105036104da565b500190565b6000816000190483118215151615610522576105226104da565b500290565b600060001982141561053b5761053b6104da565b5060010190565b634e487b7160e01b600052601260045260246000fd5b60ff918216911660008261056e5761056e610542565b500490565b600060ff8216915060ff831692508260ff03821115610503576105036104da565b600060ff8216915060ff82141561053b5761053b6104da56fea264697066735822122002aa027140504a8ecc4e083e32ce6467e89f3c7c2ce2464120be70309dafcfbf64736f6c634300080b0033";

type UtilConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UtilConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Util__factory extends ContractFactory {
  constructor(...args: UtilConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Util> {
    return super.deploy(overrides || {}) as Promise<Util>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Util {
    return super.attach(address) as Util;
  }
  connect(signer: Signer): Util__factory {
    return super.connect(signer) as Util__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UtilInterface {
    return new utils.Interface(_abi) as UtilInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Util {
    return new Contract(address, _abi, signerOrProvider) as Util;
  }
}
