// import { BigNumber, ContractTransaction, ethers, Overrides, PayableOverrides, Signer } from 'ethers';
// import { ContractFactory } from './ContractFactory';
// import { populateGasLimit } from '../utils/smartContract';
// import { SwapArgsStruct } from '../generated/typechain/IYelayLiteVault';

// export class VaultWrapper {
// 	constructor(private contractFactory: ContractFactory) {}

// 	public async depositEth(
// 		vault: string,
// 		pool: number,
// 		amount: ethers.BigNumberish,
// 		overrides: PayableOverrides = {},
// 	): Promise<ContractTransaction> {
// 		const vaultWrapper = this.contractFactory.getVaultWrapper();

// 		overrides.value = amount;

// 		await populateGasLimit(vaultWrapper.estimateGas.wrapEthAndDeposit, [vault, pool], overrides);

// 		return await vaultWrapper.wrapEthAndDeposit(vault, pool, overrides);
// 	}

// 	public async vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<BigNumber> {
// 		const vaultWrapper = this.contractFactory.getVaultWrapper();
// 		const userAddress = await signer.getAddress();

// 		return await this.contractFactory.getErc20(tokenAddress).allowance(userAddress, vaultWrapper.address);
// 	}

// 	public async approveVaultWrapper(
// 		tokenAddress: string,
// 		amount: ethers.BigNumberish,
// 		overrides: Overrides = {},
// 	): Promise<ContractTransaction> {
// 		const vaultWrapper = this.contractFactory.getVaultWrapper();

// 		await populateGasLimit(
// 			this.contractFactory.getErc20(tokenAddress).estimateGas.approve,
// 			[vaultWrapper.address, amount],
// 			overrides,
// 		);

// 		return this.contractFactory.getErc20(tokenAddress).approve(vaultWrapper.address, amount, overrides);
// 	}

// 	public async swapAndDeposit(
// 		vault: string,
// 		pool: number,
// 		swapData: SwapArgsStruct,
// 		amount: ethers.BigNumberish,
// 		overrides: PayableOverrides = {},
// 	): Promise<ContractTransaction> {
// 		const vaultWrapper = this.contractFactory.getVaultWrapper();

// 		await populateGasLimit(vaultWrapper.estimateGas.swapAndDeposit, [vault, pool, swapData, amount], overrides);

// 		return await vaultWrapper.swapAndDeposit(vault, pool, swapData, amount, overrides);
// 	}
// }
