const { equal } = require("assert")
const { assert, expect } = require("chai")
const { ethers, getNamedAccounts, deployments } = require("hardhat")
// import { ethers, getNamedAccounts, deployments } from "hardhat"

describe("ClassToken", async () => {
    let classToken
    beforeEach(async () => {
        await deployments.fixture(["all"])
        const classTokenTemp = await deployments.get("ClassToken")
        classToken = await ethers.getContractAt(
            classTokenTemp.abi,
            classTokenTemp.address
        )
    })
    describe("constractor", async () => {
        it("判断总供应量是否正确", async () => {
            const expectSupply = ethers.utils.parseEther("10000.0").toString()
            const totalSupply = await classToken.totalSupply()
            assert.equal(totalSupply.toString(), expectSupply)
        })
        it("判断name，symbol，decimals是否正确", async () => {
            const name = await classToken.name()
            const symbol = await classToken.symbol()
            const decimals = await classToken.decimals()
            assert.equal(name, "ClassToken")
            assert.equal(symbol, "CLT")
            assert.equal(decimals, 18)
        })
    })
    describe("balanceOf", async () => {
        it("判断deployer的token数是否正确", async () => {
            const { deployer } = await getNamedAccounts()
            const expectBalance = ethers.utils.parseEther("10000.0").toString()
            const balance = await classToken.balanceOf(deployer)
            assert.equal(balance, expectBalance)
        })
    })
    describe("transfer", async () => {
        const transferAmount = ethers.utils.parseEther("100.0")
        beforeEach(async () => {
            const { tokenOwner } = await getNamedAccounts()
            const tx = await classToken.transfer(tokenOwner, transferAmount)
            await tx.wait()
        })
        it("判断deployer转账100CLT给tokenOwner是否成功", async () => {
            const { deployer, tokenOwner } = await getNamedAccounts()
            const exceptDeployerBalance = ethers.utils.parseEther("9900.0")
            const deployBalace = await classToken.balanceOf(deployer)
            const tokenOwnerBalance = await classToken.balanceOf(tokenOwner)
            assert.equal(
                deployBalace.toString(),
                exceptDeployerBalance.toString()
            )
            assert.equal(
                tokenOwnerBalance.toString(),
                transferAmount.toString()
            )
        })
    })
    describe("approve", async () => {
        const approveAmount = ethers.utils.parseEther("88.0")
        it("判断deployer向tokenOwner授权88个CLT是否成功", async () => {
            const { deployer, tokenOwner } = await getNamedAccounts()
            await classToken.approve(tokenOwner, approveAmount)
            const allowance = await classToken.allowance(deployer, tokenOwner)
            assert.equal(allowance.toString(), approveAmount.toString())
        })
    })
    describe("transferFrom", async () => {
        const approveAmount = ethers.utils.parseEther("88.0")
        const transfAmount = ethers.utils.parseEther("44.0")
        beforeEach(async () => {
            const { tokenOwner } = await getNamedAccounts()
            const tx = await classToken.approve(tokenOwner, approveAmount)
            await tx.wait()
        })
        it("判断只有被授权的地址才能从授权人的账户中转账", async () => {
            const { deployer, tokenOwner } = await getNamedAccounts()
            await expect(
                classToken.transferFrom(deployer, tokenOwner, transfAmount)
            ).be.to.reverted
        })
        it("判断tokenOwner转走deployer44个CLT是否成功", async () => {
            const { deployer } = await getNamedAccounts()
            const tokenOwner = await ethers.getSigner(1)
            const tokenOwnerContract = await classToken.connect(tokenOwner)
            assert.equal(tokenOwnerContract.signer.address, tokenOwner.address)
            const tx = await tokenOwnerContract.transferFrom(
                deployer,
                tokenOwner.address,
                transfAmount
            )
            await tx.wait

            const deployerBalance = await classToken.balanceOf(deployer)
            const tokenOwnerBalance = await classToken.balanceOf(
                tokenOwner.address
            )
            // 1. 判断deployer的账户还有9956个CLT
            assert.equal(
                deployerBalance.toString(),
                ethers.utils.parseEther("9956").toString()
            )
            // 2. 判断tokenOwner的账户还有44个CLT
            assert.equal(tokenOwnerBalance.toString(), transfAmount.toString())

            // 3. 判断deployer授权给tokenOwner的token还剩44个
            const allowance = await classToken.allowance(
                deployer,
                tokenOwner.address
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
            const { deployer, tokenOwner } = await getNamedAccounts()
            const transferAmount = ethers.utils.parseEther("78")
            const tx = await classToken.transfer(tokenOwner, transferAmount)
            const receipt = await tx.wait()
            // console.log(receipt)
            // console.log(receipt.events[0].args)
            const from = receipt.events[0].args.from
            const to = receipt.events[0].args.to
            const value = receipt.events[0].args.value
            assert.equal(from, deployer)
            assert.equal(to, tokenOwner)
            assert.equal(value.toString(), transferAmount.toString())
        })
    })
    describe("Approval", async () => {
        // 测试授权的日记是否记录成功
        it("判断deployer授权给tokenOwner67个token的日志记录是否记录成功", async () => {
            const { deployer, tokenOwner } = await getNamedAccounts()
            const approveAmount = ethers.utils.parseEther("67")
            const tx = await classToken.approve(tokenOwner, approveAmount)
            const receipt = await tx.wait()
            const owner = receipt.events[0].args.owner
            const spender = receipt.events[0].args.spender
            const value = receipt.events[0].args.value
            assert.equal(owner, deployer)
            assert.equal(spender, tokenOwner)
            assert.equal(value.toString(), approveAmount.toString())
        })
    })
})
