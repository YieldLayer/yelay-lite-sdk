import { BigNumber } from 'ethers';

export type ProjectsTVL = {
	totalAssets: BigNumber;
	totalSupply: BigNumber;
	projectsSupply: {
		id: number;
		supply: BigNumber;
	}[];
	projectsTVL: {
		id: number;
		tvl: BigNumber;
	}[];
};
