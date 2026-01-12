# Yelay Lite SDK

## Table of Contents

- [Overview](#overview)
- [Chains](#chains)
- [Installation](#installation)
- [Caching Configuration](#caching-configuration)
- [Initialization](#initialization)
- [Type Exports](#type-exports)
- [Vaults](#get-vaults)
- [Pool Management](#pool-management-for-integrators-only)
- [Deposits](#deposit-erc20-into-the-vault)
- [Claimable Yield](#get-claimable-yield)
- [Claim Yield](#claim-yield)
- [Get Last Claim Event](#get-last-claim-event)
- [Swap and Deposit](#swap-token-and-deposit-into-vault-in-one-transaction)
- [Redeem](#redeem-from-the-vault)
- [Migrate](#migrate-to-another-pool)
- [User Balance](#get-user-share-balance-in-particular-pool)
- [TVL Data](#get-pools-tvl)
- [Yield Data](#get-yield-data-on-vaults)
- [Protocols](#get-protocols)
- [Strategies](#get-active-strategies)
- [License](#license)

## Overview

The **Yelay Lite SDK** is a lightweight software development kit for interacting with Yelay's blockchain ecosystem. It provides streamlined access to **vaults**, **yield farming**, and **projects** via smart contract interactions as well as Backend queries.

## Chains

-   Ethereum Mainnet (chainId: 1)
-   Base (chainId: 8453)
-   Sonic (chainId: 146)
-   Arbitrum One (chainId: 42161)
-   Avalanche (chainId: 43114)

## Installation

```sh
npm install @yelay-lite/sdk
```

### Required Dependencies

The Yelay Lite SDK requires a drift web3 adapter and the drift core library. Install both the core drift library and choose one adapter based on your web3 library:

**Core dependency (required for all setups):**

```sh
npm install @gud/drift
```

**For Viem:**

```sh
npm install @gud/drift-viem
```

**For Ethers v6:**

```sh
npm install @gud/drift-ethers
```

**For Ethers v5:**

```sh
npm install @gud/drift-ethers-v5
```

## Caching Configuration

The Yelay Lite SDK automatically disables drift's internal caching to ensure fresh data on every request.

When you call `sdk.init(drift)`, the SDK automatically replaces drift's default LRU cache with a no-op implementation, ensuring all contract calls fetch fresh data from the blockchain. The SDK will throw an error if you try to use custom caching.

## Initialization

The SDK uses a **drift adapter pattern** that works with any web3 library. The `init()` method is **mandatory** and must be called before using any SDK features.

### With Viem

```ts
import { YelayLiteSdk } from '@yelay-lite/sdk';
import { viemAdapter } from '@gud/drift-viem';
import { createDrift } from '@gud/drift';
import { createPublicClient, createWalletClient, http } from 'viem';
import { base } from 'viem/chains';

// Set up your viem clients
const publicClient = createPublicClient({
	chain: base,
	transport: http(),
});

const walletClient = createWalletClient({
	chain: base,
	transport: http(),
});

// Create the adapter and drift instance
const adapter = viemAdapter({ publicClient, walletClient });
const drift = createDrift({ adapter });

// Initialize the SDK
const sdk = new YelayLiteSdk();
await sdk.init(drift);
```

### With Ethers v6

```ts
import { YelayLiteSdk } from '@yelay-lite/sdk';
import { ethersAdapter } from '@gud/drift-ethers';
import { createDrift } from '@gud/drift';
import { ethers } from 'ethers';

// Set up your ethers provider and signer
const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Create the adapter and drift instance
const adapter = ethersAdapter({ provider, signer });
const drift = createDrift({ adapter });

// Initialize the SDK
const sdk = new YelayLiteSdk();
await sdk.init(drift);
```

### With Ethers v5

```ts
import { YelayLiteSdk } from '@yelay-lite/sdk';
import { ethersV5Adapter } from '@gud/drift-ethers-v5';
import { createDrift } from '@gud/drift';
import { ethers } from 'ethers';

// Set up your ethers v5 provider and signer
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Create the adapter and drift instance
const adapter = ethersV5Adapter({ provider, signer });
const drift = createDrift({ adapter });

// Initialize the SDK
const sdk = new YelayLiteSdk();
await sdk.init(drift);
```

## Type Exports

The SDK exports various TypeScript types that you can use in your application:

```ts
import {
	// Vault types
	Vault,

	// Yield types
	VaultYield,
	PoolYield,
	YieldAggregated,
	ClaimRequest,
	ClaimableYield,
	ClaimRequestParams,

	// Pool types
	PoolsTvl,
	HistoricalTVL,
	HistoricalTVLParams,

	// Strategy types
	Protocol,
	Strategy,

	// Backend types
	TimeFrame,
	PaginatedResponse,

	// Config types
	ChainId,
} from '@yelay-lite/sdk';
```

## Get vaults

Get all vaults managed on network.

```ts
const vaults = await sdk.data.getVaults();
```

## Pool management (for integrators only)

```ts
const integratorAddress = '0x555';
const vault = '0x1234';
const { minPool, maxPool, clientName } = await sdk.data.getClientData(integratorAddress, vault);
const poolToActivate = minPool + 5; // should be in range: minPool <= poolToActivate <= maxPool
const isPoolActive = await sdk.data.isPoolActive(vault, poolToActivate);
if (!isPoolActive) {
	await sdk.actions.activatePool(vault, poolToActivate);
}
```

## Deposit ERC20 into the vault

All action methods support an optional `options` parameter of type `WriteOptions` from `@gud/drift` for customizing transaction parameters (gas, nonce, etc.).

```ts
const vault = '0x1234';
const pool = 1234;
const amount = 1000000n; // Using bigint for amount

const allowance = await sdk.portfolio.getAllowance(vault);

if (allowance === 0n) {
	const approveTx = await sdk.actions.approve(vault, amount);
	// Note: Drift returns transaction hash, wait method depends on your adapter
}

const depositTx = await sdk.actions.deposit(vault, pool, amount);

// With optional WriteOptions
const depositTxWithOptions = await sdk.actions.deposit(vault, pool, amount, {
	gas: 300000n,
});
```

## Deposit ERC20 into the vault on behalf of another address

This function allows you to deposit tokens into a vault pool, but the resulting shares will be credited to a different address (receiver). This is useful for scenarios like depositing on behalf of users.

```ts
const vault = '0x1234';
const pool = 1234;
const amount = 1000000n; // Using bigint for amount
const receiver = '0x5678'; // Address that will receive the deposit shares

const allowance = await sdk.portfolio.getAllowance(vault);

if (allowance === 0n) {
	const approveTx = await sdk.actions.approve(vault, amount);
	// Note: Drift returns transaction hash, wait method depends on your adapter
}

const depositTx = await sdk.actions.depositOnBehalf(vault, pool, amount, receiver);
```

## Deposit ETH into the vault

```ts
const vault = '0x1234';
const pool = 1234;
const amount = 1000000n; // Amount of ETH in wei
const tx = await sdk.actions.depositEth(vault, pool, amount);
```

## Get claimable yield

You can retrieve the claimable yield for a user, optionally filtering by specific pool IDs and vault addresses:

```ts
// Get all claimable yield for the user
const claimable = await sdk.portfolio.getClaimable({
	user: '0xUSER_ADDRESS',
});

// Filter by pools and vaults
const claimableFullyFiltered = await sdk.portfolio.getClaimable({
	user: '0xUSER_ADDRESS',
	poolIds: [1, 2, 3],
	vaultAddresses: ['0xVAULT_ADDRESS1'],
});
```

## Claim yield

Once you have retrieved claimable yield using `getClaimable`, you can claim it using the `claim` method:

```ts
// First, get the claimable yield to obtain claim requests
const claimableYield = await sdk.portfolio.getClaimable({
	user: '0xUSER_ADDRESS',
});

// Extract the claim requests from the claimable yield
const claimRequests = claimableYield.map(item => item.claimRequest);

// Submit the transaction to claim the yield
const claimTx = await sdk.actions.claim(claimRequests);
```

The `claim` method sends a transaction to the blockchain to claim yield based on the provided claim requests. It requires a valid signer with sufficient gas to execute the transaction.

## Get last claim event

Retrieve information about the last claim event for a user in a specific vault and pool:

```ts
const vault = await sdk.data.getVaults().then(vaults => vaults[0]); // Get a vault object

const lastClaim = await sdk.portfolio.getLastClaim({
	vault: vault,
	user: '0xUserAddress',
	poolId: 1,
});

if (lastClaim) {
	console.log('Last claim block:', lastClaim.blockNumber);
	console.log('Last claim tx:', lastClaim.transactionHash);
} else {
	console.log('No previous claims found');
}
```

## Swap token and deposit into vault in one transaction

```ts
const vault = '0x123';
const pool = 1234;
const amount = 1000000n; // Using bigint for amount
const tokenToSwap = '0x456';
// only 1inch Aggregation Router v6 is supported
const swapTarget = '1inch Aggregation Router v6 address';
const swapCallData = '0x9...1';

const allowance = await sdk.portfolio.getTokenAllowance(tokenToSwap);

if (allowance === 0n) {
	const approveTx = await sdk.actions.approveToken(tokenToSwap, amount);
}

const swapAndDepositTX = await sdk.actions.swapAndDeposit(vault, pool, amount, {
	swapCallData,
	swapTarget,
	tokenIn: tokenToSwap,
});
```

## Redeem from the vault

```ts
const vault = '0x1234';
const pool = 1234;
const amount = 1000000n; // Amount of shares to redeem
const redeemTx = await sdk.actions.redeem(vault, pool, amount);
```

## Migrate to another pool

```ts
const vault = '0x1234';
const fromPool = 123;
const toPool = 456;
const amount = 1000000n; // Amount of shares to migrate
const migrateTx = await sdk.actions.migrate(vault, fromPool, toPool, amount);
```

## Get user share balance in particular pool

```ts
const vault = '0x1234';
const pool = 1234;
const userAddress = '0xUSER_ADDRESS'; // Get from your wallet/signer
const userPoolBalance = await sdk.portfolio.getBalance(vault, pool, userAddress);
```

## Get pools TVL

```ts
const vault = '0x1234';
const pool = 1234;
const poolsTvl = await sdk.data.getPoolTvl(vault, [pool]);
```

## Get historical TVL data for a vault and pool

```ts
// Fetch historical TVL data with various filter options
const historicalTVL = await sdk.data.getHistoricalTvl({
	vaultAddress: '0x1234...5678', // Required: The vault address to get TVL for
	poolId: 1, // Required: The specific pool ID to query
	fromTimestamp: 1641034800, // Optional: Start time in seconds (Jan 1, 2022)
	toTimestamp: 1672570800, // Optional: End time in seconds (Jan 1, 2023)
	page: 1, // Optional: Page number for pagination (starts at 1)
	pageSize: 30, // Optional: Number of records per page (max 100)
});

// Example with just the required parameters
const currentTVL = await sdk.data.getHistoricalTvl({
	vaultAddress: '0x1234...5678',
	poolId: 1,
});
```

### Response Format

The `getHistoricalTvl` method returns a paginated response with the following structure:

```ts
// Example response from getHistoricalTvl
{
  data: [
    {
      vaultAddress: "0x1234...5678",
      poolId: 1,
      createTimestamp: 1745820000,
      assets: "31000000000000"
    },
    // ... more data items
  ],
  totalItems: 11,    // Total number of items matching the query
  totalPages: 1,     // Total number of pages
  currentPage: 1,    // Current page number
  pageSize: 30       // Number of items per page
}
```

## Get yield data on vaults (filtering on vaults/timeframe)

Retrieve yield data for vaults. If `TimeFrame` is not provided, it defaults to the last week.

```ts
// Get all vault yields (defaults to last week)
const vaultsYield = await sdk.data.getVaultYield();

// Get yields for specific vaults
const filteredVaultsYield = await sdk.data.getVaultYield(['0xVaultAddress1', '0xVaultAddress2']);

// Get yields with custom timeframe
const vaultsYieldWithTimeframe = await sdk.data.getVaultYield(
	['0xVaultAddress'],
	{ fromTimestamp: 1640000000, toTimestamp: 1650000000 }
);
```

## Get yield data on pools (filtering on vaults/pools/timeframe)

Retrieve yield data for pools within vaults.

```ts
// Get all pool yields
const poolsYield = await sdk.data.getPoolYield();

// Get yields for specific vaults and pools
const filteredPoolsYield = await sdk.data.getPoolYield(
	['0xVaultAddress'],  // Optional: filter by vault addresses
	[1, 2, 3],           // Optional: filter by pool IDs
);

// Get yields with custom timeframe
const poolsYieldWithTimeframe = await sdk.data.getPoolYield(
	['0xVaultAddress'],
	[1, 2],
	{ fromTimestamp: 1640000000, toTimestamp: 1650000000 }
);
```

## Get aggregated yield data (filtering on vaults/pools/users/timeframe)

Retrieve aggregated yield data filtered by vaults, pools, users, and timeframe.

```ts
// Get all aggregated yield data
const aggregatedYieldData = await sdk.data.getAggregatedYield();

// Get aggregated yields with all filters
const filteredAggregatedYield = await sdk.data.getAggregatedYield(
	['0xVaultAddress'],              // Optional: filter by vault addresses
	[1, 2, 3],                       // Optional: filter by pool IDs
	['0xUserAddress1', '0xUserAddress2'], // Optional: filter by user addresses
	{ fromTimestamp: 1640000000 }    // Optional: timeframe filter
);
```

## Get protocols

```ts
const protocols = await sdk.data.getProtocols();
```

## Get active strategies

```ts
const vault = '0x1234';
const activeStrategies = await sdk.data.getActiveStrategies(vault);
```

### Response Format

```ts
[
	{
		name: 'MV-something',
		protocolId: 'morpho',
		allocation: 100, // Percentage allocated to the strategy
	},
];
// Note: The sum of allocations for all active strategies doesn't have to be 100%; a portion of the funds can remain unallocated in the vault
```

## License

This SDK is licensed under the **ISC License**.
