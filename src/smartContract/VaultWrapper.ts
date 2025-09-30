import { ContractFactory } from './ContractFactory';
import { Address, HexString, WriteOptions } from '@delvtech/drift';

export type SwapArgsStruct = {
	tokenIn: HexString;
	swapTarget: HexString;
	swapCallData: HexString;
};

export class VaultWrapper {
	constructor(private contractFactory: ContractFactory) {}

	public async depositEth(vault: string, pool: number, amount: bigint, options?: WriteOptions): Promise<HexString> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		if (vaultWrapper.isReadWrite()) {
			const txHash = await vaultWrapper.write(
				'wrapEthAndDeposit',
				{
					yelayLiteVault: vault as Address,
					projectId: BigInt(pool),
				},
				{
					...(options || {}),
					value: amount,
				},
			);
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}

	public async vaultWrapperAllowance(tokenAddress: string): Promise<bigint> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();
		const erc20 = this.contractFactory.getErc20(tokenAddress);

		if (erc20.isReadWrite()) {
			const signerAddress = await erc20.getSignerAddress();
			return await erc20.read('allowance', {
				owner: signerAddress,
				spender: vaultWrapper.address as Address,
			});
		} else {
			throw new Error('Missing signer');
		}
	}

	public async approveVaultWrapper(tokenAddress: string, amount: bigint, options?: WriteOptions): Promise<HexString> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();
		const erc20 = this.contractFactory.getErc20(tokenAddress);

		if (erc20.isReadWrite()) {
			const txHash = await erc20.write(
				'approve',
				{
					spender: vaultWrapper.address as Address,
					amount,
				},
				options,
			);
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}

	public async swapAndDeposit(
		vault: string,
		pool: number,
		swapData: SwapArgsStruct,
		amount: bigint,
		options?: WriteOptions,
	): Promise<HexString> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		if (vaultWrapper.isReadWrite()) {
			const txHash = await vaultWrapper.write(
				'swapAndDeposit',
				{
					yelayLiteVault: vault as Address,
					projectId: BigInt(pool),
					swapArgs: swapData,
					amount,
				},
				options,
			);
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}
}
