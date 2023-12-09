### Moderation

If someone with ADMIN privileges in the database deletes a list, it becomes unavailable for selection in the frontend. Therefore, in practice, the list can be considered deleted. Additionally, if the contract owner executes the `cancelOrderByViolation` method in the `Exchange.sol`, it can be completely removed.
