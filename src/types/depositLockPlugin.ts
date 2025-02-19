import { BigNumber } from 'ethers';

/**
 * A type alias for representing locked share amounts.
 */
export type Shares = BigNumber;

/**
 * Lock configuration interface.
 */
export interface LockConfig {
	duration: bigint;
} 