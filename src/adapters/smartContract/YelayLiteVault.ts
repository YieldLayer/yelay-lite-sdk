import { BigNumber, ContractTransaction, ethers, Overrides, Signer } from 'ethers';
import { parseBytes32String } from 'ethers/lib/utils';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IYelayLiteVault, PoolsSupply } from '../../app/ports/smartContract/IYelayLiteVault';
import { ClientData, StrategyData } from '../../types/smartContract';
import { populateGasLimit } from '../../utils/smartContract';

export class YelayLiteVault implements IYelayLiteVault {
	constructor(private contractFactory: IContractFactory) {}

	public async getPoolsSupplies(vault: string, pools: number[]): Promise<PoolsSupply> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const [totalAssets, totalSupply, ...poolsSupply] = await Promise.all([
			yelayLiteVault.totalAssets(),
			yelayLiteVault['totalSupply()'](),
			...pools.map(p => yelayLiteVault['totalSupply(uint256)'](p)),
		]);
		return {
			totalAssets,
			totalSupply,
			poolsSupply,
		};
	}

	async getVaultUnderlyingAsset(vault: string): Promise<string> {
		const underlying = await this.contractFactory.getYelayLiteVault(vault).underlyingAsset();
		return underlying;
	}

	async allowance(signer: Signer, vault: string, tokenAddress?: string): Promise<BigNumber> {
		const underlying = await this.contractFactory.getYelayLiteVault(vault).underlyingAsset();
		const userAddress = await signer.getAddress();
		return this.contractFactory.getErc20(tokenAddress ? tokenAddress : underlying).allowance(userAddress, vault);
	}

	async approve(vault: string, amount: ethers.BigNumberish, overrides: Overrides = {}): Promise<ContractTransaction> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();

		await populateGasLimit(
			this.contractFactory.getErc20(underlyingAsset).estimateGas.approve,
			[vault, amount],
			overrides,
		);

		return this.contractFactory.getErc20(underlyingAsset).approve(vault, amount, overrides);
	}

	async deposit(
		signer: Signer,
		vault: string,
		pool: number,
		amount: ethers.BigNumberish,
		overrides: Overrides = {},
	): Promise<ContractTransaction> {
		const userAddress = await signer.getAddress();

		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas.deposit,
			[amount, pool, userAddress],
			overrides,
		);

		return this.contractFactory.getYelayLiteVault(vault).deposit(amount, pool, userAddress, overrides);
	}

	async depositOnBehalf(
		vault: string,
		pool: number,
		amount: ethers.BigNumberish,
		receiver: string,
		overrides: Overrides = {},
	): Promise<ContractTransaction> {
		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas.deposit,
			[amount, pool, receiver],
			overrides,
		);

		return this.contractFactory.getYelayLiteVault(vault).deposit(amount, pool, receiver, overrides);
	}

	async redeem(
		signer: Signer,
		vault: string,
		pool: number,
		amount: ethers.BigNumberish,
		overrides: Overrides = {},
	): Promise<ContractTransaction> {
		const userAddress = await signer.getAddress();

		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas.redeem,
			[amount, pool, userAddress],
			overrides,
		);

		return this.contractFactory.getYelayLiteVault(vault).redeem(amount, pool, userAddress, overrides);
	}

	async migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: ethers.BigNumberish,
		overrides: Overrides = {},
	): Promise<ContractTransaction> {
		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas.migratePosition,
			[fromPool, toPool, amount],
			overrides,
		);
		return this.contractFactory.getYelayLiteVault(vault).migratePosition(fromPool, toPool, amount, overrides);
	}

	async activatePool(vault: string, pool: number, overrides: Overrides = {}): Promise<ContractTransaction> {
		await populateGasLimit(
			this.contractFactory.getYelayLiteVault(vault).estimateGas.activateProject,
			[pool],
			overrides,
		);

		return this.contractFactory.getYelayLiteVault(vault).activateProject(pool, overrides);
	}

	async poolActive(vault: string, pool: number): Promise<boolean> {
		return this.contractFactory.getYelayLiteVault(vault).projectIdActive(pool);
	}

	async clientData(client: string, vault: string): Promise<ClientData> {
		const result = await this.contractFactory.getYelayLiteVault(vault).ownerToClientData(client);
		return {
			minPool: Number(result.minProjectId),
			maxPool: Number(result.maxProjectId),
			clientName: parseBytes32String(result.clientName),
		};
	}

	async balanceOf(vault: string, pool: number, user: string): Promise<BigNumber> {
		return this.contractFactory.getYelayLiteVault(vault).balanceOf(user, pool);
	}

	async activeStrategies(vault: string): Promise<StrategyData[]> {
		return (await this.contractFactory.getYelayLiteVault(vault).getActiveStrategies()).map(s => ({
			name: parseBytes32String(s.name),
		}));
	}

	async strategyAssets(vault: string, index: number): Promise<BigNumber> {
		return this.contractFactory.getYelayLiteVault(vault).strategyAssets(index);
	}

	async totalAssets(vault: string): Promise<BigNumber> {
		return this.contractFactory.getYelayLiteVault(vault).totalAssets();
	}
}
