import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"

import * as dotenv from "dotenv"
dotenv.config()

import "hardhat-deploy"

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    defaultNetwork: "localhost",
    namedAccounts: {
        deployer: 0,
        firstUser: 1,
        secondUser: 2,
        thirdUser: 3,
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            // accounts: []
        },
    },
}

export default config
