import { BigNumber, ContractTransaction, Signer } from 'ethers';

export interface IDepositLockPlugin {
  /**
   * Approves the deposit lock.
   */
  approve(vault: string, amount: bigint): Promise<ContractTransaction>;

  /**
   * Deposits locked assets into a vault for a project.
   */
  depositLocked(
    vault: string,
    projectId: number,
    assets: bigint,
  ): Promise<ContractTransaction>;

  /**
   * Redeems locked shares from a vault.
   */
  redeemLocked(
    vault: string,
    projectId: number,
    shares: bigint,
  ): Promise<ContractTransaction>;

  /**
   * Migrates locked shares between projects.
   */
  migrateLocked(
    vault: string,
    fromProjectId: number,
    toProjectId: number,
    shares: bigint,
  ): Promise<ContractTransaction>;

  /**
   * Updates the lock period for a project (Vault-Project Owner only).
   */
  updateLockPeriod(
    vault: string,
    projectId: number,
    newLockPeriod: bigint,
  ): Promise<ContractTransaction>;

  /**
   * Updates the global unlock time for a project (Vault-Project Owner only).
   */
  updateGlobalUnlockTime(
    vault: string,
    projectId: number,
    newUnlockTime: bigint,
  ): Promise<ContractTransaction>;

  /**
   * Gets the matured share amount for a user.
   */
  getMaturedShares(
    vault: string,
    projectId: number,
    user: string
  ): Promise<BigNumber>;
} 
