import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

module.exports = async (hre: HardhatRuntimeEnvironment) => {
    // 准备参数
    const initialSupply = ethers.utils.parseEther("10000.0")
    // HardhatRuntimeEnvironment是hardhat运行时环境
    const { getNamedAccounts, deployments, network } = hre
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    log("------------- Deploying ClassToken Contract -------------")
    await deploy("ClassToken", {
        // 这个ClassToken是后期通过ethers.getContract(name)获取合约使用的。
        contract: "ClassToken", // 合约名字
        from: deployer, // 部署者
        args: [initialSupply], // 合约部署constractor函数的参数
        log: true, // 是否开启日志模式，主要是输出一些合约部署的信息等等
        waitConfirmations: 1, // 合约等待几个区块确认
        skipIfAlreadyDeployed: false, // 如果合约已经部署，就跳过
    })
    log("------------- Deployed ClassToken Contract -------------")
}

module.exports.tags = ["all", "classToken"]
