import { BigNumber, ContractTransaction, Overrides, Signer } from 'ethers';
import { ClaimRequest } from '../../../types';

export interface IYieldExtractor {
	getClaimedShares(user: string, vault: string, pool: number): Promise<BigNumber>;
	claim(claimRequests: ClaimRequest[], overrides?: Overrides): Promise<ContractTransaction>;
}
