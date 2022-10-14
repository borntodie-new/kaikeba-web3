import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
require("@nomiclabs/hardhat-ethers")
import * as dotenv from "dotenv"
dotenv.config() // 加载.env配置文件

import "hardhat-deploy"

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY as string
// const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    // defaultNetwork: "localhost",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            // accounts: [],
            // chainId: 1,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
    },
    namedAccounts: {
        deployer: 0,
        tokenOwner: 1,
        xxx: 2,
    },
}

export default config
