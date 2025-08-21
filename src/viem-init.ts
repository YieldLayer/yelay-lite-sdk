import { createDrift } from '@delvtech/drift';
import { viemAdapter } from '@delvtech/drift-viem';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { YelayLiteSdk } from './main.js';

async function main() {
	const publicClient = createPublicClient({ transport: http('https://base.llamarpc.com'), chain: base });
	const adapter = viemAdapter({ publicClient });
	const drift = createDrift({ adapter });
	const sdk = new YelayLiteSdk();
	await sdk.init(drift);
	const vaults = await sdk.vaults.getVaults();
	await sdk.vaults.poolActive(vaults[0].address, 1).then(console.log);
}

main();
