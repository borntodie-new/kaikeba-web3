import { BigNumber, Contract, ContractFactory } from "ethers"
import { ethers } from "hardhat"
const main = async () => {
    // 1. 准备合约参数
    const totalSupply: BigNumber = ethers.utils.parseEther("10000.0")
    // 2. 获取合约工厂对象
    const tokenFactory: ContractFactory = await ethers.getContractFactory(
        "Token"
    )
    // 3. 利用工厂对象自动部署合约
    const token: Contract = await tokenFactory.deploy(totalSupply)
    // 4. 等待合约部署完成
    await token.wait()
    // 5. 输出合约的部署地址
    console.log(`Token deployed at ${token.address}`)
}

main().catch((error: Error) => {
    console.log(error)
    process.exit(0)
})
