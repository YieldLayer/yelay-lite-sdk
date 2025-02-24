import { ethers } from "hardhat";
import { expect } from "chai";
import { sdkConfig, YelayLiteSdk } from "../src";

describe("Projects", function () {
  let sdk: YelayLiteSdk;
  const vaultAddress = "0x16db68c86edfdb60ba733563326ed392b319eb2b";

  before(async function () {
    const [signer] = await ethers.getSigners();
    sdk = new YelayLiteSdk(signer, sdkConfig[8453]);
  });

  it("should retrieve project TVL", async function () {
    const projectIds = [1, 2];

    const projectTvl = await sdk.projects.getProjectsTvl(vaultAddress, projectIds);
    const supply = projectTvl.projectsSupply[0].supply.toString();
    expect(supply).to.be.equal('15000000');
  });
}); 
