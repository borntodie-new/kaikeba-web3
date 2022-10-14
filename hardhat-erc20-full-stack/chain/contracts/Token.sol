// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(uint256 totalSupply) ERC20("Ether", "ETH") {
        _mint(msg.sender, totalSupply);
    }
}
