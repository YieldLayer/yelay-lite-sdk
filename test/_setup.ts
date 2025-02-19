import { network } from "hardhat";

before(async function () {
  // impersonate needed account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7"],
  });

  // need to mine on Base fork for HH to work with it
  await network.provider.send("evm_mine", []);

  // mint the address more ETH
  await network.provider.send("hardhat_setBalance", [
    "0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7",
    "0x100000000000000000000",
  ]);
}); 
