// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract XXFI is ERC20 {
    constructor() ERC20("XFI Token", "XFI") {
        _mint(address(this), 10000 * 10 ** decimals()); // Mint 10,000 WETH tokens to the deployer
    }
    
    function transferToken(uint256 amount) public {
        require(balanceOf(address(this)) >= amount, "Not enough tokens in contract");
        _transfer(address(this), msg.sender, amount);
    }
}

