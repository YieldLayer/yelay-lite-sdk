import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { ContractAddresses } from '../../types/config';
import { IContractFactory } from '../../app/ports/IContractFactory';
import {
	ERC20,
	ERC20__factory,
	IYelayLiteVault,
	IYelayLiteVault__factory,
	VaultWrapper,
	VaultWrapper__factory,
	DepositLockPlugin,
	DepositLockPlugin__factory,
} from '../../generated/typechain';

export class ContractFactory implements IContractFactory {
	constructor(private signerOrProvider: Signer | Provider, private contractAddresses: ContractAddresses) {}

	getYelayLiteVault(vault: string): IYelayLiteVault {
		return IYelayLiteVault__factory.connect(vault, this.signerOrProvider);
	}

	getVaultWrapper(): VaultWrapper {
		return VaultWrapper__factory.connect(this.contractAddresses.VaultWrapper, this.signerOrProvider);
	}

	getErc20(address: string): ERC20 {
		return ERC20__factory.connect(address, this.signerOrProvider);
	}

	getDepositLockPlugin(): DepositLockPlugin {
		return DepositLockPlugin__factory.connect(this.contractAddresses.DepositLockPlugin, this.signerOrProvider);
	}
}
