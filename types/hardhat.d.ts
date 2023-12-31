/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Proxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Proxy__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "ERC721URIStorage",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721URIStorage__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "CommissionFeeRecipent",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CommissionFeeRecipent__factory>;
    getContractFactory(
      name: "Exchange",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Exchange__factory>;
    getContractFactory(
      name: "ExchangeProxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExchangeProxy__factory>;
    getContractFactory(
      name: "ExchangeProxyImpl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExchangeProxyImpl__factory>;
    getContractFactory(
      name: "MockNFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockNFT__factory>;
    getContractFactory(
      name: "MockWETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockWETH__factory>;
    getContractFactory(
      name: "NFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NFT__factory>;
    getContractFactory(
      name: "ProxyRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ProxyRegistry__factory>;
    getContractFactory(
      name: "TestUtil",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestUtil__factory>;
    getContractFactory(
      name: "UpgradableProxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UpgradableProxy__factory>;
    getContractFactory(
      name: "Util",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Util__factory>;

    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Proxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Proxy>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "ERC721URIStorage",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721URIStorage>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "CommissionFeeRecipent",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CommissionFeeRecipent>;
    getContractAt(
      name: "Exchange",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Exchange>;
    getContractAt(
      name: "ExchangeProxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ExchangeProxy>;
    getContractAt(
      name: "ExchangeProxyImpl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ExchangeProxyImpl>;
    getContractAt(
      name: "MockNFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockNFT>;
    getContractAt(
      name: "MockWETH",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockWETH>;
    getContractAt(
      name: "NFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.NFT>;
    getContractAt(
      name: "ProxyRegistry",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ProxyRegistry>;
    getContractAt(
      name: "TestUtil",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestUtil>;
    getContractAt(
      name: "UpgradableProxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UpgradableProxy>;
    getContractAt(
      name: "Util",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Util>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
