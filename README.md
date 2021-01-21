## Instruction

1. Copy all the contracts of `pancake-core` `pancake-perificiary` and `pancake-farm` to `./contract`


2. Modify the solidity version corresponding to each contract in `hardhat.config.js`

```javascript

  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
    ],
    overrides: {
      "contracts/BnbStaking.sol": {
        version: "0.6.12",
        settings: {},
      },
    }
}
```

3. install dependencies
```
yarn add @pancakeswap/pancake-swap-lib @uniswap/v2-core

```