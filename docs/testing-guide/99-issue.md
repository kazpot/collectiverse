- product page error because of the below error responded by json-rpc server.

```
Error: processing response error (body="{\"jsonrpc\":\"2.0\",\"id\":44,\"error\":{\"code\":-32603,\"message\":\"block range too high\"}}", error={"code":-32603}, requestBody="{\"method\":\"eth_getLogs\",\"params\":[{\"fromBlock\":\"0x0\",\"toBlock\":\"latest\",\"address\":\"0xb038da8fcf59d03a08fb31f4939c7d02e0ade114\",\"topics\":[\"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef\",\"0x0000000000000000000000000000000000000000000000000000000000000000\",null,\"0x0000000000000000000000000000000000000000000000000000000000000001\"]}],\"id\":44,\"jsonrpc\":\"2.0\"}", requestMethod="POST", url="https://rpc.topos-subnet.testnet-1.topos.technology", code=SERVER_ERROR, version=web/5.5.1)
    at Logger.makeError (/var/task/frontend/node_modules/@ethersproject/logger/lib/index.js:199:21)
    at Logger.throwError (/var/task/frontend/node_modules/@ethersproject/logger/lib/index.js:208:20)
    at /var/task/frontend/node_modules/@ethersproject/web/lib/index.js:301:32
    at step (/var/task/frontend/node_modules/@ethersproject/web/lib/index.js:33:23)
    at Object.next (/var/task/frontend/node_modules/@ethersproject/web/lib/index.js:14:53)
    at fulfilled (/var/task/frontend/node_modules/@ethersproject/web/lib/index.js:5:58)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  reason: 'processing response error',
  code: 'SERVER_ERROR',
  body: '{"jsonrpc":"2.0","id":44,"error":{"code":-32603,"message":"block range too high"}}',
  error: Error: block range too high
      at getResult (/var/task/frontend/node_modules/@ethersproject/providers/lib/json-rpc-provider.js:132:21)
      at processJsonFunc (/var/task/frontend/node_modules/@ethersproject/web/lib/index.js:344:22)
      at /var/task/frontend/node_modules/@ethersproject/web/lib/index.js:276:46
      at step (/var/task/frontend/node_modules/@ethersproject/web/lib/index.js:33:23)
      at Object.next (/var/task/frontend/node_modules/@ethersproject/web/lib/index.js:14:53)
      at fulfilled (/var/task/frontend/node_modules/@ethersproject/web/lib/index.js:5:58)
      at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
    code: -32603,
    data: undefined
  },
  requestBody: '{"method":"eth_getLogs","params":[{"fromBlock":"0x0","toBlock":"latest","address":"0xb038da8fcf59d03a08fb31f4939c7d02e0ade114","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x0000000000000000000000000000000000000000000000000000000000000000",null,"0x0000000000000000000000000000000000000000000000000000000000000001"]}],"id":44,"jsonrpc":"2.0"}',
  requestMethod: 'POST',
  url: 'https://rpc.topos-subnet.testnet-1.topos.technology',
  page: '/products/[id]'
}
Error: Runtime exited with error: exit status 1
Runtime.ExitError

```

- If there is one bid, Seller cannot cancel the auction. Sellers can cancel any auction that has not received a bid.
