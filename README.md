# Yelay Lite SDK

## Overview
The **Yelay Lite SDK** is a lightweight software development kit for interacting with Yelay's blockchain ecosystem. It provides streamlined access to **vaults**, **yield farming**, and **projects** via smart contract interactions.


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
To start using the SDK, initialize it with an **Ethereum signer or provider** and a **configuration object**:

The configuration object is already provided to you as a constant. 
```
export const sdkConfig: Record<number, SDKConfig> = {
  8453: {
    backendUrl: 'https://lite.dev.yelay.io/',
    contractAddresses: contracts[8453],
  },
};
```

```ts
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { YelayLiteSdk, sdkConfig } from '@yelay-lite/sdk';

const signerOrProvider: Signer | Provider = /* Your signer or provider */;
const chainId = 8453; // Supported chain ID

const sdk = new YelayLiteSdk(signerOrProvider, sdkConfig[chainId]);
```

## Features
The SDK provides access to the following services:

### **1. Vaults**
Interact with vaults on the Yelay platform.
```ts
const vaults = sdk.vaults;
// Example: Fetch vault data
await vaults.getVaults();
```

### **2. Yield**
Retrieve yield-related information.
```ts
const yields = sdk.yields;
// Example: Get yield details
await yields.getYieldInfo();
```

### **3. Projects**
Manage and retrieve project-related data.
```ts
const projects = sdk.projects;
// Example: Get project list
await projects.getProjects();
```

## License
This SDK is licensed under the **ISC License**.

