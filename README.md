# Yelay Lite SDK

## Overview

The **Yelay Lite SDK** is a lightweight software development kit for interacting with Yelay's blockchain ecosystem. It provides streamlined access to **vaults**, **yield farming**, and **projects** via smart contract interactions as well as Backend queries.

## Chains:

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
npm install @delvtech/drift
```

**For Viem:**

```sh
npm install @delvtech/drift-viem
```

**For Ethers v6:**

```sh
npm install @delvtech/drift-ethers
```

**For Ethers v5:**

```sh
npm install @delvtech/drift-ethers-v5
```

## Initialization

The SDK uses a **drift adapter pattern** that works with any web3 library. The `init()` method is **mandatory** and must be called before using any SDK features.

### With Viem

```ts
import { YelayLiteSdk } from '@yelay-lite/sdk';
import { viemAdapter } from '@delvtech/drift-viem';
import { createDrift } from '@delvtech/drift';
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
import { ethersAdapter } from '@delvtech/drift-ethers';
import { createDrift } from '@delvtech/drift';
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
import { ethersV5Adapter } from '@delvtech/drift-ethers-v5';
import { createDrift } from '@delvtech/drift';
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
const poolToActivate = minPool + 5; // should be in range: minPool < poolToActivate < maxPool
const isPoolActive = await sdk.data.isPoolActive(vault, poolToActivate);
if (!isPoolActive) {
	await sdk.actions.activatePool(vault, poolToActivate);
}
```

## Deposit ERC20 into the vault

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

The historicalTVL method returns a paginated response with the following structure:

```ts
// Example response from historicalTVL
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

```ts
const vaultsYield = await sdk.data.getVaultYield();
```

## Get yield data on pools (filtering on vaults/pools/timeframe)

```ts
const poolsYield = await sdk.data.getPoolYield();
```

## Get aggregated yield data (filtering on vaults/pools/users/timeframe)

```ts
const aggregatedYieldData = await sdk.data.getAggregatedYield();
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
