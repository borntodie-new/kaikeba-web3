import { ethers } from "hardhat"

const main = async () => {
    // 0. 准备总供应量：总供应量是一万个CLT
    const initialSupply = ethers.utils.parseEther("10000.0")
    // 1. 获取合约工厂类
    const classTokenFactory = await ethers.getContractFactory("ClassToken")
    // 2. 部署合约
    const calssToken = await classTokenFactory.deploy(initialSupply)
    // 3. 等待合约部署完成
    const tx = await calssToken.deployed()
    // 4. 输出合约部署的地址
    console.log(`ClassToken deploy address is ${tx.address}`)
}

main().catch((error) => {
    console.log(error)
    process.exit(0)
})
