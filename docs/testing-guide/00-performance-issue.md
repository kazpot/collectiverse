### Performance Issue

Due to the limitation of retrieving event logs 1000 blocks at a time using the json-rpc of the topos testnet's public chain, the performance is currently suboptimal. Currently, it takes > 3 minutes for functionalities where event logs are retrieved from the blockchain. For example, when you click the `UPDATE` button (update owned NFts) or `ACCEPT` button (accept bid price), the process begins asynchronously; however, if you perform another action without waiting for Metamask to respond, there is a potential risk of encountering errors in Metamask operations.

Affected areas:

- 07-accept-bid.md
- 10-update.md
