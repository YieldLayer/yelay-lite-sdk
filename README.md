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

To start using the SDK, initialize it with an **Ethereum signer or provider** and a **network environment**:

```ts
import { YelayLiteSdk } from '@yelay-lite/sdk';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';

const signerOrProvider: Signer | Provider = /* Your signer or provider */;

const sdk = new YelayLiteSdk(signerOrProvider, 'base-testing');

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

```

```
