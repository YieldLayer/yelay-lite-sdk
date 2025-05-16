import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { MulticallWrapper } from 'ethers-multicall-provider';
import { IContractFactory } from '../../app/ports/IContractFactory';
import {
	ERC20,
	ERC20__factory,
	IYelayLiteVault,
	IYelayLiteVault__factory,
	VaultWrapper,
	VaultWrapper__factory,
	YieldExtractor,
	YieldExtractor__factory,
} from '../../generated/typechain';
import { ContractAddresses } from '../../types/config';

export class ContractFactory implements IContractFactory {
	constructor(private signerOrProvider: Signer | Provider, private contractAddresses: ContractAddresses) {
		if (Signer.isSigner(signerOrProvider)) {
			if (signerOrProvider.provider) {
				this.signerOrProvider = signerOrProvider.connect(MulticallWrapper.wrap(signerOrProvider.provider));
			} else {
				throw new Error('Signer has no provider');
			}
		} else {
			this.signerOrProvider = MulticallWrapper.wrap(signerOrProvider);
		}
	}

	getYelayLiteVault(vault: string): IYelayLiteVault {
		return IYelayLiteVault__factory.connect(vault, this.signerOrProvider);
	}

	getVaultWrapper(): VaultWrapper {
		return VaultWrapper__factory.connect(this.contractAddresses.VaultWrapper, this.signerOrProvider);
	}

	getErc20(address: string): ERC20 {
		return ERC20__factory.connect(address, this.signerOrProvider);
	}

	getYieldExtractor(): YieldExtractor {
		return YieldExtractor__factory.connect(this.contractAddresses.YieldExtractor, this.signerOrProvider);
	}
}
