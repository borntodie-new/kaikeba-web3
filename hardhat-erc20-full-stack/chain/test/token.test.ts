import { Contract } from "ethers"

const { assert, expect } = require("chai")
const { ethers, getNamedAccounts, deployments } = require("hardhat")

describe("Token", async () => {
    let Token: Contract
    beforeEach(async () => {
        await deployments.fixture(["all"])
        const TokenTemp = await deployments.get("Token")
        Token = await ethers.getContractAt(
            TokenTemp.abi,
            TokenTemp.address
        )
    })
    describe("constractor", async () => {
        it("判断总供应量是否正确", async () => {
            const expectSupply = ethers.utils.parseEther("10000.0").toString()
            const totalSupply = await Token.totalSupply()
            assert.equal(totalSupply.toString(), expectSupply)
        })
        it("判断name，symbol，decimals是否正确", async () => {
            const name = await Token.name()
            const symbol = await Token.symbol()
            const decimals = await Token.decimals()
            assert.equal(name, "Ether")
            assert.equal(symbol, "ETH")
            assert.equal(decimals, 18)
        })
    })
    describe("balanceOf", async () => {
        it("判断deployer的token数是否正确", async () => {
            const { deployer } = await getNamedAccounts()
            const expectBalance = ethers.utils.parseEther("10000.0").toString()
            const balance = await Token.balanceOf(deployer)
            assert.equal(balance, expectBalance)
        })
    })
    describe("transfer", async () => {
        const transferAmount = ethers.utils.parseEther("100.0")
        beforeEach(async () => {
            const { firstUser } = await getNamedAccounts()
            const tx = await Token.transfer(firstUser, transferAmount)
            await tx.wait()
        })
        it("判断deployer转账100CLT给firstUser是否成功", async () => {
            const { deployer, firstUser } = await getNamedAccounts()
            const exceptDeployerBalance = ethers.utils.parseEther("9900.0")
            const deployBalace = await Token.balanceOf(deployer)
            const firstUserBalance = await Token.balanceOf(firstUser)
            assert.equal(
                deployBalace.toString(),
                exceptDeployerBalance.toString()
            )
            assert.equal(
                firstUserBalance.toString(),
                transferAmount.toString()
            )
        })
    })
    describe("approve", async () => {
        const approveAmount = ethers.utils.parseEther("88.0")
        it("判断deployer向firstUser授权88个CLT是否成功", async () => {
            const { deployer, firstUser } = await getNamedAccounts()
            await Token.approve(firstUser, approveAmount)
            const allowance = await Token.allowance(deployer, firstUser)
            assert.equal(allowance.toString(), approveAmount.toString())
        })
    })
    describe("transferFrom", async () => {
        const approveAmount = ethers.utils.parseEther("88.0")
        const transfAmount = ethers.utils.parseEther("44.0")
        beforeEach(async () => {
            const { firstUser } = await getNamedAccounts()
            const tx = await Token.approve(firstUser, approveAmount)
            await tx.wait()
        })
        it("判断只有被授权的地址才能从授权人的账户中转账", async () => {
            const { deployer, firstUser } = await getNamedAccounts()
            await expect(
                Token.transferFrom(deployer, firstUser, transfAmount)
            ).be.to.reverted
        })
        it("判断firstUser转走deployer44个CLT是否成功", async () => {
            const { deployer } = await getNamedAccounts()
            const firstUser = await ethers.getSigner(1)
            const firstUserContract = await Token.connect(firstUser)
            assert.equal(firstUserContract.signer.address, firstUser.address)
            const tx = await firstUserContract.transferFrom(
                deployer,
                firstUser.address,
                transfAmount
            )
            await tx.wait

            const deployerBalance = await Token.balanceOf(deployer)
            const firstUserBalance = await Token.balanceOf(
                firstUser.address
            )
            // 1. 判断deployer的账户还有9956个CLT
            assert.equal(
                deployerBalance.toString(),
                ethers.utils.parseEther("9956").toString()
            )
            // 2. 判断firstUser的账户还有44个CLT
            assert.equal(firstUserBalance.toString(), transfAmount.toString())

            // 3. 判断deployer授权给firstUser的token还剩44个
            const allowance = await Token.allowance(
                deployer,
                firstUser.address
            )
            assert.equal(
                allowance.toString(),
                (approveAmount - transfAmount).toString()
            )
        })
    })
    describe("Transfer", async () => {
        // 测试转账日志event
        it("判断转账日志是否记录成功", async () => {
            const { deployer, firstUser } = await getNamedAccounts()
            const transferAmount = ethers.utils.parseEther("78")
            const tx = await Token.transfer(firstUser, transferAmount)
            const receipt = await tx.wait()
            // console.log(receipt)
            // console.log(receipt.events[0].args)
            const from = receipt.events[0].args.from
            const to = receipt.events[0].args.to
            const value = receipt.events[0].args.value
            assert.equal(from, deployer)
            assert.equal(to, firstUser)
            assert.equal(value.toString(), transferAmount.toString())
        })
    })
    describe("Approval", async () => {
        // 测试授权的日记是否记录成功
        it("判断deployer授权给firstUser67个token的日志记录是否记录成功", async () => {
            const { deployer, firstUser } = await getNamedAccounts()
            const approveAmount = ethers.utils.parseEther("67")
            const tx = await Token.approve(firstUser, approveAmount)
            const receipt = await tx.wait()
            const owner = receipt.events[0].args.owner
            const spender = receipt.events[0].args.spender
            const value = receipt.events[0].args.value
            assert.equal(owner, deployer)
            assert.equal(spender, firstUser)
            assert.equal(value.toString(), approveAmount.toString())
        })
    })
})
