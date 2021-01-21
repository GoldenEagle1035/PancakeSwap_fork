// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract fUSDT is ERC20 {
    constructor(uint256 initSupply) ERC20('fakeUSDT', 'fUSDT') {
        _mint(msg.sender, initSupply);
    }
}