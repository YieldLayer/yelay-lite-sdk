import { ethers } from 'hardhat';
import { expect } from 'chai';
import { YelayLiteSdk } from '../src';
import { Signer, BigNumber, utils } from 'ethers';

/**
 * This test file runs on a Hardhat forked network and uses the auto-impersonated account.
 * The account impersonated is: 0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7 (set in test/_setup.ts).
 */

describe('Vaults Extended Tests', function () {
	let sdk: YelayLiteSdk;
	let impersonatedSigner: Signer;
	const impersonatedAddress = '0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7';
	const vaultAddress = '0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992';

	before(async function () {
		// Get the impersonated signer (auto-impersonated via _setup.ts)
		impersonatedSigner = await ethers.getSigner(impersonatedAddress);
		sdk = new YelayLiteSdk(impersonatedSigner, 8453);
	});

	it('should get vault balance for the impersonated user', async function () {
		const projectId = 100; // example project id
		const balance = await sdk.vaults.balanceOf(vaultAddress, projectId, impersonatedAddress);
		expect(balance).to.be.instanceOf(BigNumber);
	});

	it('should approve ERC20 (WETH) for spending', async function () {
		// Example: approve 1000 tokens for spending.
		const amount = BigInt(utils.parseEther('1').toString());
		const tx = await sdk.vaults.approve(vaultAddress, amount);
		let receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});

	it('should deposit ERC20 (WETH) successfully', async function () {
		const projectId = 100;
		const depositAmount = BigInt(500);
		const tx = await sdk.vaults.deposit(vaultAddress, projectId, depositAmount);
		const receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});

	it('should deposit ETH successfully', async function () {
		const projectId = 100;
		const depositEthAmount = BigInt(ethers.utils.parseEther('0.0000001').toString());
		const tx = await sdk.vaults.depositEth(vaultAddress, projectId, depositEthAmount);
		const receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});

	it('should verify balance', async function () {
		const projectId = 100;
		const balance = await sdk.vaults.balanceOf(vaultAddress, projectId, impersonatedAddress);
		expect(balance.toString()).to.be.equal('300075019253');
	});

	it('should redeem tokens successfully', async function () {
		const projectId = 100;
		const balance = await sdk.vaults.balanceOf(vaultAddress, projectId, impersonatedAddress);
		const tx = await sdk.vaults.redeem(vaultAddress, projectId, balance.toBigInt());
		const receipt = await tx.wait();
		expect(receipt.status).to.equal(1);
	});
});
