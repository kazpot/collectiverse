/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface ExchangeProxyInterface extends utils.Interface {
  functions: {
    "getImpl()": FunctionFragment;
    "proxyOwner()": FunctionFragment;
    "transferProxyOwnership(address)": FunctionFragment;
    "upgradeTo(address,bytes)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "getImpl", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proxyOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferProxyOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeTo",
    values: [string, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "getImpl", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "proxyOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferProxyOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;

  events: {
    "ProxyOwnershipTransferred(address,address)": EventFragment;
    "Upgraded(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ProxyOwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}

export type ProxyOwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type ProxyOwnershipTransferredEventFilter =
  TypedEventFilter<ProxyOwnershipTransferredEvent>;

export type UpgradedEvent = TypedEvent<[string], { implementation: string }>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export interface ExchangeProxy extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ExchangeProxyInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getImpl(overrides?: CallOverrides): Promise<[string]>;

    proxyOwner(overrides?: CallOverrides): Promise<[string]>;

    transferProxyOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeTo(
      newImpl: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getImpl(overrides?: CallOverrides): Promise<string>;

  proxyOwner(overrides?: CallOverrides): Promise<string>;

  transferProxyOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeTo(
    newImpl: string,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getImpl(overrides?: CallOverrides): Promise<string>;

    proxyOwner(overrides?: CallOverrides): Promise<string>;

    transferProxyOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeTo(
      newImpl: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ProxyOwnershipTransferred(address,address)"(
      previousOwner?: null,
      newOwner?: null
    ): ProxyOwnershipTransferredEventFilter;
    ProxyOwnershipTransferred(
      previousOwner?: null,
      newOwner?: null
    ): ProxyOwnershipTransferredEventFilter;

    "Upgraded(address)"(implementation?: string | null): UpgradedEventFilter;
    Upgraded(implementation?: string | null): UpgradedEventFilter;
  };

  estimateGas: {
    getImpl(overrides?: CallOverrides): Promise<BigNumber>;

    proxyOwner(overrides?: CallOverrides): Promise<BigNumber>;

    transferProxyOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeTo(
      newImpl: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proxyOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferProxyOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeTo(
      newImpl: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
