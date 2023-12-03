## Solidity Version

- Solidity 0.8

## Requirements

- Node v18.12.1
- Hardhat v2.8.2

## Install

1. install

```
$ npm install -g yarn
```

2. Create .env file

At root directory

```
$ cp .env.sample .env
```

Set the following environment variables

```
RPC_URL=<json-rpc endpoint>
WALLET_SECRET=<private key from metamask>
```

At frontend directory

```
$ cd frontend
$ yarn install
$ cp .env.sample .env
```

Set the following environment variables

```
NEXT_PUBLIC_RPC_URL=<json-rpc endpoint>

NEXT_PUBLIC_IPFS_API=<infura ipfs api endpont>
NEXT_PUBLIC_IPFS_FILE_URL=<file path on ipfs>
NEXT_PUBLIC_IPFS_PROJECT_ID=<infura ipfs project id>
NEXT_PUBLIC_IPFS_SECRET=<infura ipfs api key secret>

NEXT_PUBLIC_EXCHANGE_ADDRESS=<exchange contract address>
NEXT_PUBLIC_NFT_ADDRESS=<nft contract address>

NEXT_PUBLIC_MONGODB_URI=<mongodb uri>

NEXT_PUBLIC_API_SERVER_URI=<api server endpoint>
```
