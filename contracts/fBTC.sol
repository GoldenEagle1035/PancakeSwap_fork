// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract fBTC is ERC20 {
    constructor(uint256 initSupply) ERC20('fakeBTC', 'fBTC') {
        _mint(msg.sender, initSupply);
    }
}