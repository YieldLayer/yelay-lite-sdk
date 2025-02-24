import { network } from "hardhat";

before(async function () {
  // impersonate user account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7"],
  });
  
  // impersonate owner account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0xeDee7B1C9a240C4085A5fCAC8f4Fa750E3779695"],
  });

  // need to mine on Base fork for HH to work with it
  await network.provider.send("evm_mine", []);

  // mint user address more ETH
  await network.provider.send("hardhat_setBalance", [
    "0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7",
    "0x100000000000000000000",
  ]);
  
  // mint owner address more ETH
  await network.provider.send("hardhat_setBalance", [
    "0xeDee7B1C9a240C4085A5fCAC8f4Fa750E3779695",
    "0x100000000000000000000",
  ]);

  // generate WETH from ETH
  await network.provider.send("eth_sendTransaction", [{
    from: "0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7",
    to: "0x4200000000000000000000000000000000000006",
    value: "0x56bc75e2d63100000", // 100 ETH in wei
    data: "0xd0e30db0"         // function selector for deposit()
  }]);
}); 
