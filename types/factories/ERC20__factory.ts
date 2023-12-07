/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ERC20, ERC20Interface } from "../ERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000d4138038062000d4183398101604081905262000034916200024b565b81516200004990600390602085019062000068565b5080516200005f90600490602084019062000068565b5050506200030c565b8280546200007690620002db565b90600052602060002090601f0160209004810192826200009a5760008555620000e5565b82601f10620000b557805160ff1916838001178555620000e5565b82800160010185558215620000e5579182015b82811115620000e5578251825591602001919060010190620000c8565b50620000f3929150620000f7565b5090565b5b80821115620000f35760008155600101620000f8565b634e487b7160e01b600052604160045260246000fd5b601f19601f83011681018181106001600160401b03821117156200014c576200014c6200010e565b6040525050565b60006200015f60405190565b90506200016d828262000124565b919050565b60006001600160401b038211156200018e576200018e6200010e565b601f19601f83011660200192915050565b60005b83811015620001bc578181015183820152602001620001a2565b83811115620001cc576000848401525b50505050565b6000620001e9620001e38462000172565b62000153565b905082815260208101848484011115620002065762000206600080fd5b620002138482856200019f565b509392505050565b600082601f830112620002315762000231600080fd5b815162000243848260208601620001d2565b949350505050565b60008060408385031215620002635762000263600080fd5b82516001600160401b038111156200027e576200027e600080fd5b6200028c858286016200021b565b92505060208301516001600160401b03811115620002ad57620002ad600080fd5b620002bb858286016200021b565b9150509250929050565b634e487b7160e01b600052602260045260246000fd5b600281046001821680620002f057607f821691505b60208210811415620003065762000306620002c5565b50919050565b610a25806200031c6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461011f57806370a082311461013257806395d89b411461015b578063a457c2d714610163578063a9059cbb14610176578063dd62ed3e1461018957600080fd5b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100ec57806323b872dd146100fd578063313ce56714610110575b600080fd5b6100b66101c2565b6040516100c391906105b7565b60405180910390f35b6100df6100da366004610613565b610254565b6040516100c3919061065a565b6002545b6040516100c3919061066e565b6100df61010b36600461067c565b61026b565b60126040516100c391906106d5565b6100df61012d366004610613565b6102dd565b6100f06101403660046106e3565b6001600160a01b031660009081526020819052604090205490565b6100b6610319565b6100df610171366004610613565b610328565b6100df610184366004610613565b610383565b6100f061019736600461070c565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6060600380546101d190610755565b80601f01602080910402602001604051908101604052809291908181526020018280546101fd90610755565b801561024a5780601f1061021f5761010080835404028352916020019161024a565b820191906000526020600020905b81548152906001019060200180831161022d57829003601f168201915b5050505050905090565b6000610261338484610390565b5060015b92915050565b6000610278848484610444565b6001600160a01b0384166000908152600160209081526040808320338452909152902054828110156102c55760405162461bcd60e51b81526004016102bc906107ca565b60405180910390fd5b6102d28533858403610390565b506001949350505050565b3360008181526001602090815260408083206001600160a01b038716845290915281205490916102619185906103149086906107f0565b610390565b6060600480546101d190610755565b3360009081526001602090815260408083206001600160a01b03861684529091528120548281101561036c5760405162461bcd60e51b81526004016102bc9061084a565b6103793385858403610390565b5060019392505050565b6000610261338484610444565b6001600160a01b0383166103b65760405162461bcd60e51b81526004016102bc9061089b565b6001600160a01b0382166103dc5760405162461bcd60e51b81526004016102bc906108ea565b6001600160a01b0380841660008181526001602090815260408083209487168084529490915290819020849055517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259061043790859061066e565b60405180910390a3505050565b6001600160a01b03831661046a5760405162461bcd60e51b81526004016102bc9061093c565b6001600160a01b0382166104905760405162461bcd60e51b81526004016102bc9061098c565b6001600160a01b038316600090815260208190526040902054818110156104c95760405162461bcd60e51b81526004016102bc906109df565b6001600160a01b038085166000908152602081905260408082208585039055918516815290812080548492906105009084906107f0565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161054a919061066e565b60405180910390a35b50505050565b60005b8381101561057457818101518382015260200161055c565b838111156105535750506000910152565b600061058f825190565b8084526020840193506105a6818560208601610559565b601f01601f19169290920192915050565b602080825281016105c88184610585565b9392505050565b60006001600160a01b038216610265565b6105e9816105cf565b81146105f457600080fd5b50565b8035610265816105e0565b806105e9565b803561026581610602565b6000806040838503121561062957610629600080fd5b600061063585856105f7565b925050602061064685828601610608565b9150509250929050565b8015155b82525050565b602081016102658284610650565b80610654565b602081016102658284610668565b60008060006060848603121561069457610694600080fd5b60006106a086866105f7565b93505060206106b1868287016105f7565b92505060406106c286828701610608565b9150509250925092565b60ff8116610654565b6020810161026582846106cc565b6000602082840312156106f8576106f8600080fd5b600061070484846105f7565b949350505050565b6000806040838503121561072257610722600080fd5b600061072e85856105f7565b9250506020610646858286016105f7565b634e487b7160e01b600052602260045260246000fd5b60028104600182168061076957607f821691505b6020821081141561077c5761077c61073f565b50919050565b602881526000602082017f45524332303a207472616e7366657220616d6f756e74206578636565647320618152676c6c6f77616e636560c01b602082015291505b5060400190565b6020808252810161026581610782565b634e487b7160e01b600052601160045260246000fd5b60008219821115610803576108036107da565b500190565b602581526000602082017f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77815264207a65726f60d81b602082015291506107c3565b6020808252810161026581610808565b602481526000602082017f45524332303a20617070726f76652066726f6d20746865207a65726f206164648152637265737360e01b602082015291506107c3565b602080825281016102658161085a565b602281526000602082017f45524332303a20617070726f766520746f20746865207a65726f206164647265815261737360f01b602082015291506107c3565b60208082528101610265816108ab565b602581526000602082017f45524332303a207472616e736665722066726f6d20746865207a65726f206164815264647265737360d81b602082015291506107c3565b60208082528101610265816108fa565b602381526000602082017f45524332303a207472616e7366657220746f20746865207a65726f206164647281526265737360e81b602082015291506107c3565b602080825281016102658161094c565b602681526000602082017f45524332303a207472616e7366657220616d6f756e7420657863656564732062815265616c616e636560d01b602082015291506107c3565b602080825281016102658161099c56fea2646970667358221220c8e43822eca9c19ced7ea54dd5ebe5cfb06dc4aa9ab7c73da9898db17cddd57464736f6c634300080b0033";

type ERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC20__factory extends ContractFactory {
  constructor(...args: ERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC20> {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<ERC20>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  attach(address: string): ERC20 {
    return super.attach(address) as ERC20;
  }
  connect(signer: Signer): ERC20__factory {
    return super.connect(signer) as ERC20__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC20Interface {
    return new utils.Interface(_abi) as ERC20Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC20 {
    return new Contract(address, _abi, signerOrProvider) as ERC20;
  }
}
