import { SmartContractAdapter } from '../../adapters/smartContract';
import { IContractFactory } from '../ports/IContractFactory';
import { Protocol, Strategy, StrategyVaultData } from '../../types/strategies';
import { IStrategiesBackend } from '../ports/backend/IStrategiesBackend';
import { StrategiesBackend } from '../../adapters/backend/StrategiesBackend';

export class Strategies {
	private smartContractAdapter: SmartContractAdapter;
	private strategiesBackend: IStrategiesBackend;
	private chainId: number;

	constructor(contractFactory: IContractFactory, backendUrl: string, chainId: number) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.strategiesBackend = new StrategiesBackend(backendUrl, chainId);
		this.chainId = chainId;
	}

	/**
	 * Fetches all protocols from the backend.
	 *
	 * @returns {Promise<ProtocolData[]>} A promise that resolves to an array of protocols.
	 */
	async getProtocols(): Promise<Protocol[]> {
		const protocols = await this.strategiesBackend.getProtocols();
		return protocols.map(({ prefixes, ...rest }) => rest);
	}

	/**
	 * Fetches all active strategies for a given vault.
	 *
	 * @param {string} yelayLiteVault - The address of the vault.
	 * @returns {Promise<Strategy[]>} A promise that resolves to an array of strategies.
	 */
	async getActiveStrategies(yelayLiteVault: string): Promise<Strategy[]> {
		const protocols = await this.strategiesBackend.getProtocols();
		const totalAssets = await this.smartContractAdapter.yelayLiteVault.totalAssets(yelayLiteVault);
		const activeStrategies = await this.smartContractAdapter.yelayLiteVault.activeStrategies(yelayLiteVault);
		const strategyNames = activeStrategies.map(strategy => strategy.name);
		const vaultData = await this.strategiesBackend.getStrategyVaultData(yelayLiteVault, strategyNames);
		const vaultDataMap = new Map<string, StrategyVaultData>();
		vaultData.forEach(data => {
			vaultDataMap.set(data.name.toLowerCase(), data);
		});

		const result = await Promise.all(
			activeStrategies.map(async (strategy, index) => {
				const prefix = strategy.name.split('-')[0];
				const protocol = protocols.find(p => p.prefixes.includes(prefix));
				if (!protocol) {
					throw new Error(`Protocol for ${prefix} not found`);
				}
				const strategyAssets = await this.smartContractAdapter.yelayLiteVault.strategyAssets(
					yelayLiteVault,
					index,
				);
				const allocation = strategyAssets.mul(10000).div(totalAssets).toNumber() / 100;

				const vaultData = vaultDataMap.get(strategy.name.toLowerCase());

				return {
					name: strategy.name,
					protocolId: protocol.id,
					allocation,
					chainId: this.chainId,
					yelayLiteVault,
					...vaultData,
				};
			}),
		);
		return result;
	}
}
