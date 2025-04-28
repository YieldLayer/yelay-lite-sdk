# Yelay Lite SDK

## Overview

The **Yelay Lite SDK** is a lightweight software development kit for interacting with Yelay's blockchain ecosystem. It provides streamlined access to **vaults**, **yield farming**, and **projects** via smart contract interactions as well as Backend queries.

## Chains

Only Base(chainId: 8453) is supported currently.

## Installation

To install the SDK, use **npm** or **pnpm**:

```sh
npm install @yelay-lite/sdk
```

or

```sh
pnpm add @yelay-lite/sdk
```

## Initialization

To start using the SDK, initialize it with an **Ethereum signer or provider** and a **network chainId**:

```ts
import { YelayLiteSdk } from '@yelay-lite/sdk';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';

const signerOrProvider: Signer | Provider = /* Your signer or provider */;
const chainId = 8453;
const sdk = new YelayLiteSdk(signerOrProvider, chainId);

```

## Get vaults

Get all vaults managed on network.

```ts
const vaults = await sdk.vaults.getVaults();
```

## Pool management (for integrators only)

```ts
const integratorAddress = '0x555';
const vault = '0x1234';
const { minPool, maxPool, clientName } = await sdk.vaults.clientData(integratorAddress, vault);
const poolToActivate = minPool + 5; // should be in range: minPool < poolToActivate < maxPool
const isPoolActive = await sdk.vaults.poolActive(vault, poolToActivate);
if (!isPoolActive) {
	await sdk.vaults.activatePool(vault, poolToActivate);
}
```

## Deposit ERC20 into the vault

```ts
const vault = '0x1234';
const pool = 1234;
const amount = '1000000';

const allowance = await sdk.vaults.allowance(vault);

if (allowance.isZero()) {
	const approveTx = await sdk.vaults.approve(vault, amount);
	await approveTx.wait();
}

const depositTx = await sdk.vaults.deposit(vault, pool, amount);
await depositTx.wait();
```

## Deposit ETH into the vault

```ts
const tx = await sdk.vaults.depositEth(vault, pool, amount);
await tx.wait();
```

## Swap token and deposit into vault in one transaction

```ts
const vault = '0x123';
const pool = 1234;
const amount = '1000000';
const tokenToSwap = '0x456';
// only 1inch Aggregation Router v6 is supported
const swapTarget = '1inch Aggregation Router v6 address';
const swapCallData = '0x9...1';

const allowance = await sdk.vaults.vaultWrapperAllowance(tokenToSwap);

if (allowance.isZero()) {
	const approveTx = await sdk.vaults.approveVaultWrapper(tokenToSwap, amount);
	await approveTx.wait();
}

const swapAndDepositTX = await sdk.vaults.swapAndDeposit(vault, pool, amount, {
	swapCallData,
	swapTarget,
	tokenIn: tokenToSwap,
});
await swapAndDepositTX.wait();
```

## Redeem from the vault

```ts
const redeemTx = await sdk.vaults.redeem(vault, pool, amount);
await redeemTx.wait();
```

## Migrate to another pool

```ts
const fromPool = 123;
const toPool = 456;
const migrateTx = await sdk.vaults.migrate(vault, fromPool, toPool, amount);
await migrateTx.wait();
```

## Get user share balance in particular pool

```ts
const userPoolBalance = await sdk.vaults.balanceOf(vault, pool, await signer.getAddress());
```

## Get pools TVL

```ts
const poolsTvl = await sdk.pools.getPoolsTvl(vault, [pool]);
```

## Get historical TVL data for a vault and pool

```ts
// Fetch historical TVL data with various filter options
const historicalTVL = await sdk.pools.historicalTVL({
  vaultAddress: "0x1234...5678", // Required: The vault address to get TVL for
  poolId: 1,                     // Required: The specific pool ID to query
  fromTimestamp: 1641034800,     // Optional: Start time in seconds (Jan 1, 2022)
  toTimestamp: 1672570800,       // Optional: End time in seconds (Jan 1, 2023)
  page: 1,                       // Optional: Page number for pagination (starts at 1)
  pageSize: 30                   // Optional: Number of records per page (max 100)
});

// Example with just the required parameters
const currentTVL = await sdk.pools.historicalTVL({
  vaultAddress: "0x1234...5678", 
  poolId: 1
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
const vaultsYield = await sdk.yields.getVaultsYield();
```

## Get aggregated yield data (filtering on vaults/pools/users/timeframe)

```ts
const aggregatedYieldData = await sdk.yields.getYields();
```

## License

This SDK is licensed under the **ISC License**.
