import { ethers } from 'ethers';
import { ERC20__factory } from './../typechain/generated/factories/ERC20__factory';
import { IYelayLiteVault__factory } from './../typechain/generated/factories/IYelayLiteVault__factory';
import { LibErrors__factory } from './../typechain/generated/factories/LibErrors__factory';
import { CallResult, ProjectYield, TimeFrame, UserYield, Vault, VaultYield, YelayLiteSdkConfig } from './types';

export class YelayLiteSdk {
	private signer: ethers.Signer;
	private backendUrl: string;

	constructor(private readonly config: YelayLiteSdkConfig) {
		this.signer = config.signer;
		this.backendUrl = config.backendUrl;
	}

	async getVaults(): Promise<Vault[]> {
		const res = await fetch(`${this.backendUrl}/vaults`);
		const vaults = await res.json();
		return vaults;
	}

	async getVaultYield(vault: string, timeFrame?: TimeFrame): Promise<VaultYield> {
		const q = new URLSearchParams({ address: vault });
		this.#appendTimeFrameQuery(q, timeFrame);
		const res = await fetch(`${this.backendUrl}/interest/vaults?${q.toString()}`);
		return await res.json();
	}

	async getProjectsYield(vault: string, projectIds: number[], timeFrame?: TimeFrame): Promise<ProjectYield[]> {
		const q = new URLSearchParams();
		projectIds.forEach(p => q.append('id', p.toString()));
		this.#appendTimeFrameQuery(q, timeFrame);
		const res = await fetch(`${this.backendUrl}/interest/vault/${vault}/projects?${q.toString()}`);
		return await res.json();
	}

	async getUsersYield(
		vault: string,
		projectId: number,
		users: string[],
		timeFrame?: TimeFrame,
	): Promise<UserYield[]> {
		const q = new URLSearchParams();
		users.forEach(p => q.append('user', p.toString()));
		this.#appendTimeFrameQuery(q, timeFrame);
		const res = await fetch(
			`${this.backendUrl}/interest/vault/${vault}/project/${projectId}/users?${q.toString()}`,
		);
		return await res.json();
	}

	async deposit(vault: string, projectId: number, amount: bigint): Promise<CallResult> {
		const userAddress = await this.signer.getAddress();
		const yelayLiteVault = IYelayLiteVault__factory.connect(vault, this.signer);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();
		const token = ERC20__factory.connect(underlyingAsset, this.signer.provider);
		const allowance = await token.allowance(userAddress, vault);
		if (allowance === 0n) {
			const r = await this.#tryCall(token.approve(vault, ethers.MaxUint256));
			if (!r.success) {
				console.log('Approve failed');
				return r;
			}
		}
		return this.#tryCall(
			IYelayLiteVault__factory.connect(vault, this.signer).deposit(amount, projectId, userAddress),
		);
	}

	async redeem(vault: string, projectId: number, amount: bigint): Promise<CallResult> {
		const userAddress = await this.signer.getAddress();
		return this.#tryCall(
			IYelayLiteVault__factory.connect(vault, this.signer).redeem(amount, projectId, userAddress),
		);
	}

	async balanceOf(vault: string, projectId: number): Promise<bigint> {
		const userAddress = await this.signer.getAddress();
		return IYelayLiteVault__factory.connect(vault, this.signer.provider).balanceOf(userAddress, projectId);
	}

	#appendTimeFrameQuery(q: URLSearchParams, timeframe?: TimeFrame) {
		if (timeframe?.fromBlock) {
			q.append('fromBlock', timeframe.fromBlock.toString());
		}
		if (timeframe?.toBlock) {
			q.append('toBlock', timeframe.toBlock.toString());
		}
		if (timeframe?.fromTimestamp) {
			q.append('fromTimestamp', timeframe.fromTimestamp.toString());
		}
		if (timeframe?.toTimestamp) {
			q.append('toTimestamp', timeframe.toTimestamp.toString());
		}
	}

	async #tryCall(call: Promise<ethers.ContractTransactionResponse>): Promise<CallResult> {
		const result = { success: false, hash: '' };
		try {
			const tx = await call;
			const receipt = await tx.wait(1);
			if (receipt?.status === 1) {
				result.success = true;
			} else {
			}
			result.hash = tx.hash;
		} catch (error: any) {
			const parsedError = LibErrors__factory.createInterface().parseError(error.data);
			if (parsedError) {
				console.error(`Error: ${parsedError.name}`);
			} else {
				console.error(`Error: ${error}`);
			}
		}
		return result;
	}
}
