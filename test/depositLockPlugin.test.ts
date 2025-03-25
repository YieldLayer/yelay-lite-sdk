import { expect } from 'chai';
import { Signer, utils } from 'ethers';
import { ethers } from 'hardhat';
import { YelayLiteSdk } from '../src';

describe('DepositLockPlugin Tests', function () {
	let sdk: YelayLiteSdk;
	let sdkOwner: YelayLiteSdk;
	let impersonatedSigner: Signer;
	let impersonatedAddress = '0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7';
	let impersonatedDepositLockOwner: Signer;
	const depositLockOwner = '0xeDee7B1C9a240C4085A5fCAC8f4Fa750E3779695';
	const vaultAddress = '0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992';
	const pool = 100;
	const testAmount = BigInt(utils.parseEther('0.1').toString());
	const newLockPeriod = BigInt(86400); // 1 day in seconds
	const newUnlockTime = BigInt(Math.floor(Date.now() / 1000) + 86400); // Current time + 1 day

	before(async function () {
		// Get the impersonated signer (auto-impersonated via _setup.ts)
		impersonatedSigner = await ethers.getSigner(impersonatedAddress);
		impersonatedDepositLockOwner = await ethers.getSigner(depositLockOwner);
		sdk = new YelayLiteSdk(impersonatedSigner, 8453, true);
		sdkOwner = new YelayLiteSdk(impersonatedDepositLockOwner, 8453, true);
	});

	it('should approve depositLock successfully', async function () {
		const tx = await sdk.depositLock.approve(vaultAddress, testAmount);
		let receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});

	it('should deposit locked assets successfully', async function () {
		const tx = await sdk.depositLock.depositLocked(vaultAddress, pool, testAmount);
		const receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});

	it('should redeem locked shares successfully', async function () {
		const tx = await sdk.depositLock.redeemLocked(vaultAddress, pool, testAmount);
		const receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});

	it('should migrate locked shares between projects', async function () {
		const toPool = 1000;
		const tx = await sdk.depositLock.migrateLocked(vaultAddress, pool, toPool, testAmount);
		const receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});

	it('should update lock period successfully', async function () {
		const tx = await sdkOwner.depositLock.updateLockPeriod(vaultAddress, pool, newLockPeriod);
		const receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});

	it('should update global unlock time successfully', async function () {
		const tx = await sdkOwner.depositLock.updateGlobalUnlockTime(vaultAddress, pool, newUnlockTime);
		const receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});
});
