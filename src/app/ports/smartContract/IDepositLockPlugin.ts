import { BigNumber, ContractTransaction, Signer } from 'ethers';

export interface IDepositLockPlugin {
  /**
   * Deposits locked assets into a vault for a project.
   */
  depositLocked(
    signer: Signer,
    vault: string,
    projectId: number,
    assets: bigint,
  ): Promise<ContractTransaction>;

  /**
   * Redeems locked shares from a vault.
   */
  redeemLocked(
    signer: Signer,
    vault: string,
    projectId: number,
    shares: bigint,
  ): Promise<ContractTransaction>;

  /**
   * Migrates locked shares between projects.
   */
  migrateLocked(
    signer: Signer,
    vault: string,
    fromProjectId: number,
    toProjectId: number,
    shares: bigint,
  ): Promise<ContractTransaction>;

  /**
   * Updates the lock period for a project (Vault-Project Owner only).
   */
  updateLockPeriod(
    signer: Signer,
    vault: string,
    projectId: number,
    newLockPeriod: bigint,
  ): Promise<ContractTransaction>;

  /**
   * Updates the global unlock time for a project (Vault-Project Owner only).
   */
  updateGlobalUnlockTime(
    signer: Signer,
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
