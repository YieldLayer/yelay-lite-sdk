import { ClientData, StrategyData } from '../types/index.js';
import { ContractFactory } from './ContractFactory.js';
import { Address, HexString } from '@delvtech/drift';

export type PoolsSupply = {
	totalAssets: bigint;
	totalSupply: bigint;
	poolsSupply: bigint[];
};

export class YelayLiteVault {
	constructor(private contractFactory: ContractFactory) {}

	public async getPoolsSupplies(vaultAddress: string, pools: number[]): Promise<PoolsSupply> {
		const vault = this.contractFactory.getYelayLiteVault(vaultAddress);
		const [totalAssets, totalSupply, ...poolsSupply] = await Promise.all([
			vault.read('totalAssets'),
			vault.read('totalSupply'),
			...pools.map(p => vault.read('totalSupply', { id: BigInt(p) })),
		]);
		return {
			totalAssets,
			totalSupply,
			poolsSupply,
		};
	}

	async getVaultUnderlyingAsset(vaultAddress: string): Promise<string> {
		const vault = this.contractFactory.getYelayLiteVault(vaultAddress);
		const underlying = await vault.read('underlyingAsset');
		return underlying;
	}

	async allowance(userAddress: string, vaultAddress: string, tokenAddress?: string): Promise<bigint> {
		const underlying = await this.getVaultUnderlyingAsset(vaultAddress);
		const erc2 = this.contractFactory.getErc20(tokenAddress ? tokenAddress : underlying);
		return erc2.read('allowance', { owner: userAddress as Address, spender: vaultAddress as Address });
	}

	async approve(vaultAddress: string, amount: bigint): Promise<HexString> {
		const underlyingAsset = await this.getVaultUnderlyingAsset(vaultAddress);

		const erc20 = this.contractFactory.getErc20(underlyingAsset);

		if (erc20.isReadWrite()) {
			const txHash = await erc20.write('approve', { spender: vaultAddress as Address, amount });
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}

	async deposit(vault: string, pool: number, amount: bigint): Promise<HexString> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);

		if (vaultContract.isReadWrite()) {
			const signerAddress = await vaultContract.getSignerAddress();
			const txHash = await vaultContract.write('deposit', {
				assets: amount,
				projectId: BigInt(pool),
				receiver: signerAddress,
			});
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}

	async redeem(vault: string, pool: number, amount: bigint): Promise<HexString> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);

		if (vaultContract.isReadWrite()) {
			const signerAddress = await vaultContract.getSignerAddress();
			const txHash = await vaultContract.write('redeem', {
				shares: amount,
				projectId: BigInt(pool),
				receiver: signerAddress as Address,
			});
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}

	async migrate(vault: string, fromPool: number, toPool: number, amount: bigint): Promise<HexString> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);

		if (vaultContract.isReadWrite()) {
			const txHash = await vaultContract.write('migratePosition', {
				fromProjectId: BigInt(fromPool),
				toProjectId: BigInt(toPool),
				amount,
			});
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}

	async activatePool(vault: string, pool: number): Promise<HexString> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);

		if (vaultContract.isReadWrite()) {
			const txHash = await vaultContract.write('activateProject', {
				projectId: BigInt(pool),
			});
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}

	async poolActive(vault: string, pool: number): Promise<boolean> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);
		return vaultContract.read('projectIdActive', { projectId: BigInt(pool) });
	}

	async clientData(client: string, vault: string): Promise<ClientData> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);
		const result = await vaultContract.read('ownerToClientData', { owner: client as Address });
		return {
			minPool: Number(result.minProjectId),
			maxPool: Number(result.maxProjectId),
			// TODO:
			// clientName: parseBytes32String(result.clientName),
			clientName: result.clientName,
		};
	}

	async balanceOf(vault: string, pool: number, user: string): Promise<bigint> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);
		return vaultContract.read('balanceOf', { account: user as Address, id: BigInt(pool) });
	}

	async activeStrategies(vault: string): Promise<StrategyData[]> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);
		const strategies = await vaultContract.read('getActiveStrategies');
		return strategies.map((s: any) => ({
			// TODO:
			// name: parseBytes32String(s.name),
			name: s.name,
		}));
	}

	async strategyAssets(vault: string, index: number): Promise<bigint> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);
		return vaultContract.read('strategyAssets', { index: BigInt(index) });
	}

	async totalAssets(vault: string): Promise<bigint> {
		const vaultContract = this.contractFactory.getYelayLiteVault(vault);
		return vaultContract.read('totalAssets');
	}
}
