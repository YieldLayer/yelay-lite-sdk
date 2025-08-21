import { createDrift } from '@delvtech/drift';
import { YelayLiteSdk } from './main.js';
import { ethers } from 'ethers';
import { ethersAdapter } from '@delvtech/drift-ethers-v5';

async function main() {
	const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');
	const adapter = ethersAdapter({ provider });
	const drift = createDrift({ adapter });
	const sdk = new YelayLiteSdk();
	await sdk.init(drift);
	const vaults = await sdk.vaults.getVaults();
	await sdk.vaults.poolActive(vaults[0].address, 1).then(console.log);
}

main();
