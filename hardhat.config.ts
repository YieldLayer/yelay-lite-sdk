import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      // This forks the mainnet – all calls in tests will run against the mainnet state (forked locally)
      forking: {
        url: MAINNET_RPC_URL,
        blockNumber: 26577052,
      },
      chainId: 8453, // Base chain id
      chains: {
        8453: {
          hardforkHistory: {
            berlin: 1000000,
            london: 2000000,
          },
        }
      }
    },
  },
  mocha: {
    require: ["./test/_setup.ts"],
  },
};

export default config; 
