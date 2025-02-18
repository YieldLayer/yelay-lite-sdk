import { BigNumber } from 'ethers';
import { EventsRange } from './backend';

export type ProjectsTVL = {
	totalAssets: BigNumber;
	totalSupply: BigNumber;
	projectsSupply: {
		id: number;
		supply: BigNumber;
	}[];
};
