// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockDIAOracle {
    mapping(address => uint256) private prices;

    constructor(address asset, uint256 _price) {
        prices[asset] = _price;
    }

    function getPrice(address asset) external view returns (uint256) {
        return prices[asset];
    }

    function setPrice(address asset, uint256 _price) external {
        prices[asset] = _price;
    }
}
