/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ProxyRegistry, ProxyRegistryInterface } from "../ProxyRegistry";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddr",
        type: "address",
      },
    ],
    name: "beginGrantAuth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "contracts",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddr",
        type: "address",
      },
    ],
    name: "finishGrantAuth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "pending",
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
        name: "",
        type: "address",
      },
    ],
    name: "proxies",
    outputs: [
      {
        internalType: "contract ExchangeProxy",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registerProxy",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddr",
        type: "address",
      },
    ],
    name: "revokeAuth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImpl",
        type: "address",
      },
    ],
    name: "setNewProxyImpl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6116a48061007e6000396000f3fe60806040523480156200001157600080fd5b5060043610620000b75760003560e01c80638da5cb5b116200007a5780638da5cb5b1462000166578063a8fcd60d1462000181578063c45527911462000198578063ddd81f8214620001d3578063f2fde38b14620001dd578063f8171dfa14620001f457600080fd5b80635ae4950c14620000bc5780635eebea2014620000d557806369dc9ff31462000110578063715018a6146200014557806385d47d1f146200014f575b600080fd5b620000d3620000cd366004620006a0565b6200020b565b005b620000f8620000e6366004620006a0565b60036020526000908152604090205481565b604051620001079190620006d5565b60405180910390f35b6200013662000121366004620006a0565b60026020526000908152604090205460ff1681565b604051620001079190620006ee565b620000d3620002a8565b620000d362000160366004620006a0565b620002e3565b6000546001600160a01b031660405162000107919062000709565b620000d362000192366004620006a0565b6200038c565b620001c4620001a9366004620006a0565b6001602052600090815260409020546001600160a01b031681565b60405162000107919062000750565b6200013662000468565b620000d3620001ee366004620006a0565b62000559565b620000d362000205366004620006a0565b620005bd565b6000546001600160a01b03163314620002415760405162461bcd60e51b8152600401620002389062000760565b60405180910390fd5b6001600160a01b03811660009081526002602052604090205460ff161580156200028157506001600160a01b038116600090815260036020526040902054155b6200028b57600080fd5b6001600160a01b0316600090815260036020526040902060019055565b6000546001600160a01b03163314620002d55760405162461bcd60e51b8152600401620002389062000760565b620002e160006200060b565b565b6000546001600160a01b03163314620003105760405162461bcd60e51b8152600401620002389062000760565b6001600160a01b03811660009081526002602052604090205460ff161580156200035157506001600160a01b03811660009081526003602052604090205415155b6200035b57600080fd5b6001600160a01b0316600090815260036020908152604080832083905560029091529020805460ff19166001179055565b3360009081526002602052604090205460ff16620003a957600080fd5b33600081815260016020526040908190205490516001600160a01b03909116918291636fbc15e9918591620003e4919030906024016200079b565b60408051601f198184030181529181526020820180516001600160e01b031663485cc95560e01b1790525160e084901b6001600160e01b03191681526200043092919060040162000829565b600060405180830381600087803b1580156200044b57600080fd5b505af115801562000460573d6000803e3d6000fd5b505050505050565b3360009081526002602052604081205460ff166200048557600080fd5b336000908152600160205260409020546001600160a01b031615620004a957600080fd5b6000333330604051602401620004c19291906200079b565b60408051601f198184030181529181526020820180516001600160e01b031663485cc95560e01b17905251620004f7906200065b565b6200050492919062000829565b604051809103906000f08015801562000521573d6000803e3d6000fd5b5033600090815260016020819052604090912080546001600160a01b0319166001600160a01b03939093169290921790915592915050565b6000546001600160a01b03163314620005865760405162461bcd60e51b8152600401620002389062000760565b6001600160a01b038116620005af5760405162461bcd60e51b815260040162000238906200084d565b620005ba816200060b565b50565b6000546001600160a01b03163314620005ea5760405162461bcd60e51b8152600401620002389062000760565b6001600160a01b03166000908152600260205260409020805460ff19169055565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610dd6806200089983390190565b60006001600160a01b0382165b92915050565b620006878162000669565b8114620005ba57600080fd5b803562000676816200067c565b600060208284031215620006b757620006b7600080fd5b6000620006c5848462000693565b949350505050565b805b82525050565b60208101620006768284620006cd565b801515620006cf565b60208101620006768284620006e5565b620006cf8162000669565b60208101620006768284620006fe565b60006001600160a01b03821662000676565b6000620006768262000719565b600062000676826200072b565b620006cf8162000738565b6020810162000676828462000745565b60208082528181019081527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260408301526060820162000676565b60408101620007ab8285620006fe565b620007ba6020830184620006fe565b9392505050565b60005b83811015620007de578181015183820152602001620007c4565b83811115620007ee576000848401525b50505050565b6000620007ff825190565b80845260208401935062000818818560208601620007c1565b601f01601f19169290920192915050565b60408101620008398285620006fe565b8181036020830152620006c58184620007f4565b602080825281016200067681602681527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160208201526564647265737360d01b60408201526060019056fe60806040523480156200001157600080fd5b5060405162000dd638038062000dd68339810160408190526200003491620002ec565b6000604051620000449062000167565b604051809103906000f08015801562000061573d6000803e3d6000fd5b50600180546001600160a01b0319166001600160a01b03861617905590506200008a8162000103565b6000816001600160a01b031683604051620000a6919062000370565b6000604051808303816000865af19150503d8060008114620000e5576040519150601f19603f3d011682016040523d82523d6000602084013e620000ea565b606091505b5050905080620000f957600080fd5b5050505062000385565b6000546001600160a01b03828116911614156200011f57600080fd5b600080546001600160a01b0319166001600160a01b038316908117825560405190917fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b91a250565b61051080620008c683390190565b60006001600160a01b0382165b92915050565b620001938162000175565b81146200019f57600080fd5b50565b8051620001828162000188565b634e487b7160e01b600052604160045260246000fd5b601f19601f83011681018181106001600160401b0382111715620001ed57620001ed620001af565b6040525050565b60006200020060405190565b90506200020e8282620001c5565b919050565b60006001600160401b038211156200022f576200022f620001af565b601f19601f83011660200192915050565b60005b838110156200025d57818101518382015260200162000243565b838111156200026d576000848401525b50505050565b60006200028a620002848462000213565b620001f4565b905082815260208101848484011115620002a757620002a7600080fd5b620002b484828562000240565b509392505050565b600082601f830112620002d257620002d2600080fd5b8151620002e484826020860162000273565b949350505050565b60008060408385031215620003045762000304600080fd5b6000620003128585620001a2565b92505060208301516001600160401b03811115620003335762000333600080fd5b6200034185828601620002bc565b9150509250929050565b600062000356825190565b6200036681856020860162000240565b9290920192915050565b60006200037e82846200034b565b9392505050565b61053180620003956000396000f3fe6080604052600436106100435760003560e01c8063025313a21461005a5780636fbc15e91461008a578063dfb80831146100aa578063f1739cae146100c857610052565b36610052576100506100e8565b005b6100506100e8565b34801561006657600080fd5b506001546001600160a01b03165b60405161008191906102cf565b60405180910390f35b34801561009657600080fd5b506100506100a5366004610402565b610104565b3480156100b657600080fd5b506000546001600160a01b0316610074565b3480156100d457600080fd5b506100506100e336600461045a565b610193565b6101026100fd6000546001600160a01b031690565b610226565b565b6001546001600160a01b0316331461011b57600080fd5b6101248261024a565b6000826001600160a01b03168260405161013e91906104cd565b6000604051808303816000865af19150503d806000811461017b576040519150601f19603f3d011682016040523d82523d6000602084013e610180565b606091505b505090508061018e57600080fd5b505050565b6001546001600160a01b031633146101aa57600080fd5b6001600160a01b0381166101bd57600080fd5b6001546040517f5a3e66efaa1e445ebd894728a69d6959842ea1e97bd79b892797106e270efcd9916101fc916001600160a01b039091169084906104e0565b60405180910390a1600180546001600160a01b0319166001600160a01b0392909216919091179055565b3660008037600080366000845af43d6000803e808015610245573d6000f35b3d6000fd5b6000546001600160a01b038281169116141561026557600080fd5b600080546001600160a01b0319166001600160a01b038316908117825560405190917fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b91a250565b60006001600160a01b0382165b92915050565b6102c9816102ad565b82525050565b602081016102ba82846102c0565b6102e6816102ad565b81146102f157600080fd5b50565b80356102ba816102dd565b634e487b7160e01b600052604160045260246000fd5b601f19601f830116810181811067ffffffffffffffff8211171561033b5761033b6102ff565b6040525050565b600061034d60405190565b90506103598282610315565b919050565b600067ffffffffffffffff821115610378576103786102ff565b601f19601f83011660200192915050565b82818337506000910152565b60006103a86103a38461035e565b610342565b9050828152602081018484840111156103c3576103c3600080fd5b6103ce848285610389565b509392505050565b600082601f8301126103ea576103ea600080fd5b81356103fa848260208601610395565b949350505050565b6000806040838503121561041857610418600080fd5b600061042485856102f4565b925050602083013567ffffffffffffffff81111561044457610444600080fd5b610450858286016103d6565b9150509250929050565b60006020828403121561046f5761046f600080fd5b60006103fa84846102f4565b60005b8381101561049657818101518382015260200161047e565b838111156104a5576000848401525b50505050565b60006104b5825190565b6104c381856020860161047b565b9290920192915050565b60006104d982846104ab565b9392505050565b604081016104ee82856102c0565b6104d960208301846102c056fea26469706673582212204bf17b57c2441f1fcb3caf0d63ddc6c9f84af40cc2b013e65e9305281024dc8264736f6c634300080b0033608060405234801561001057600080fd5b506104f0806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063485cc955146100465780634c93505f1461005b5780638d1bc0101461006e575b600080fd5b6100596100543660046102ce565b610097565b005b61005961006936600461031e565b61014f565b61008161007c366004610350565b6101be565b60405161008e91906103be565b60405180910390f35b600054610100900460ff16806100b0575060005460ff16155b6100d55760405162461bcd60e51b81526004016100cc906103cc565b60405180910390fd5b600054610100900460ff161580156100f7576000805461ffff19166101011790555b6000805462010000600160b01b031916620100006001600160a01b038681169190910291909117909155600180546001600160a01b031916918416919091179055801561014a576000805461ff00191690555b505050565b6000546201000090046001600160a01b0316331461016c57600080fd5b6001805460ff60a01b1916600160a01b831515021790556040517f2165014523a6f4135deffed62d70149aad59b64de5aac51e3abbcbe2a83e2f7e906101b39083906103be565b60405180910390a150565b600154600090600160a01b900460ff16156101d857600080fd5b6000546201000090046001600160a01b031633146101f557600080fd5b846001600160a01b03168484846040516024016102149392919061042d565b60408051601f198184030181529181526020820180516001600160e01b0316632142170760e11b1790525161024991906104a7565b6000604051808303816000865af19150503d8060008114610286576040519150601f19603f3d011682016040523d82523d6000602084013e61028b565b606091505b50909150505b949350505050565b60006001600160a01b0382165b92915050565b6102b581610299565b81146102c057600080fd5b50565b80356102a6816102ac565b600080604083850312156102e4576102e4600080fd5b60006102f085856102c3565b9250506020610301858286016102c3565b9150509250929050565b8015156102b5565b80356102a68161030b565b60006020828403121561033357610333600080fd5b60006102918484610313565b806102b5565b80356102a68161033f565b6000806000806080858703121561036957610369600080fd5b600061037587876102c3565b9450506020610386878288016102c3565b9350506040610397878288016102c3565b92505060606103a887828801610345565b91505092959194509250565b8015155b82525050565b602081016102a682846103b4565b602080825281016102a681602e81527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160208201526d191e481a5b9a5d1a585b1a5e995960921b604082015260600190565b6103b881610299565b806103b8565b6060810161043b828661041e565b610448602083018561041e565b6102916040830184610427565b60005b83811015610470578181015183820152602001610458565b8381111561047f576000848401525b50505050565b600061048f825190565b61049d818560208601610455565b9290920192915050565b60006104b38284610485565b939250505056fea2646970667358221220d5687353c811bf12e73cf49ca25af797f7dd759100fe1330fc52ae07ed63719e64736f6c634300080b0033a26469706673582212200525052b93cc83fd94f0afac941be3b0b3c73018bb5f4eea6be26e5fb7fa6ffb64736f6c634300080b0033";

type ProxyRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProxyRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ProxyRegistry__factory extends ContractFactory {
  constructor(...args: ProxyRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ProxyRegistry> {
    return super.deploy(overrides || {}) as Promise<ProxyRegistry>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ProxyRegistry {
    return super.attach(address) as ProxyRegistry;
  }
  connect(signer: Signer): ProxyRegistry__factory {
    return super.connect(signer) as ProxyRegistry__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProxyRegistryInterface {
    return new utils.Interface(_abi) as ProxyRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProxyRegistry {
    return new Contract(address, _abi, signerOrProvider) as ProxyRegistry;
  }
}