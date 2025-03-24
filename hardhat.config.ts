import '@nomiclabs/hardhat-ethers';
import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config();

const config: HardhatUserConfig = {
	networks: {
		hardhat: {
			// This forks the base – all calls in tests will run against the base state (forked locally)
			forking: {
				url: process.env.BASE_URL!,
				blockNumber: 26577052,
			},
			chainId: 8453,
		},
	},
	mocha: {
		require: ['./test/_setup.ts'],
	},
};

export default config;
