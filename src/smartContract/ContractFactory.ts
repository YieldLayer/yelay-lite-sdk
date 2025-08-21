import { Address, Drift } from '@delvtech/drift';
import { ERC20_ABI } from '../abis/ERC20.js';
import { IYELAY_LITE_VAULT_ABI } from '../abis/IYelayLiteVault.js';
import { VAULT_WRAPPER_ABI } from '../abis/VaultWrapper.js';
import { YIELD_EXTRACTOR_ABI } from '../abis/YieldExtractor.js';
import { ContractAddresses } from '../types/config.js';

export class ContractFactory {
	constructor(private drift: Drift, private contractAddresses: ContractAddresses) {}

	getYelayLiteVault(vault: string) {
		return this.drift.contract({ abi: IYELAY_LITE_VAULT_ABI, address: vault as Address });
	}

	getVaultWrapper() {
		return this.drift.contract({
			abi: VAULT_WRAPPER_ABI,
			address: this.contractAddresses.VaultWrapper as Address,
		});
	}

	getErc20(address: string) {
		return this.drift.contract({
			abi: ERC20_ABI,
			address: address as Address,
		});
	}

	getYieldExtractor() {
		return this.drift.contract({
			abi: YIELD_EXTRACTOR_ABI,
			address: this.contractAddresses.YieldExtractor as Address,
		});
	}
}
