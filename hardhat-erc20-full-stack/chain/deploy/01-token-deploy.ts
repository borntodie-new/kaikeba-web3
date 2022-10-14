import { HardhatRuntimeEnvironment } from "hardhat/types"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"

module.exports = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    // 1. 准备合约参数
    const totalSupply: BigNumber = ethers.utils.parseEther("10000.0")
    const { deployer } = await getNamedAccounts()
    // 2. 部署合约
    log("------------- Deploying Token Contract -------------")
    await deploy("Token", {
        contract: "Token",
        args: [totalSupply],
        log: true,
        from: deployer,
    })
    log("------------- Deployed Token Contract -------------")
}

module.exports.tags = ["all", "token"]
