// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakeToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("StakeToken", "STK") {
        _mint(address(this), initialSupply * 10**18);
    }

    uint public COOLDOWN_PERIOD = 5 hours;

    mapping (address => uint) public lastWithdraw;

    function transferToken() public {
        require(lastWithdraw[msg.sender] + COOLDOWN_PERIOD < block.timestamp, "Withdraw Cooldown");
        uint256 amount = 5 * 10**18;
        require(balanceOf(address(this)) >= amount, "Not enough tokens in contract");
        _transfer(address(this), msg.sender, amount);
        lastWithdraw[msg.sender] = block.timestamp;
    }
}