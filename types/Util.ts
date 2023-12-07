/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface UtilInterface extends utils.Interface {
  functions: {
    "addressToString(address)": FunctionFragment;
    "bytes32ToString(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addressToString",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "bytes32ToString",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "addressToString",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bytes32ToString",
    data: BytesLike
  ): Result;

  events: {};
}

export interface Util extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UtilInterface;

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
    addressToString(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    bytes32ToString(
      _bytes32: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  addressToString(_addr: string, overrides?: CallOverrides): Promise<string>;

  bytes32ToString(
    _bytes32: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    addressToString(_addr: string, overrides?: CallOverrides): Promise<string>;

    bytes32ToString(
      _bytes32: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    addressToString(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bytes32ToString(
      _bytes32: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addressToString(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bytes32ToString(
      _bytes32: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
