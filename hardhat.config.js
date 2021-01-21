require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.2",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.6.0",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.4.0",
      },
      {
        version: "0.8.0",
      },
    ],
    overrides: {
      "contracts/fBTC.sol": {
        version: "0.8.9",
        settings: {},
      },
      "contracts/fUSDT.sol": {
        version: "0.8.9",
        settings: {},
      },
      "contracts/BnbStaking.sol": {
        version: "0.6.12",
        settings: {},
      },
      "contracts/CakeToken.sol": {
        version: "0.6.12",
        settings: {},
      },
      "contracts/LotteryRewardPool.sol": {
        version: "0.6.12",
        settings: {},
      },
      "contracts/MasterChef.sol": {
        version: "0.6.12",
        settings: {},
      },
      "contracts/PancakeERC20.sol": {
        version: "0.5.16",
        settings: {},
      },
      "contracts/PancakeFactory.sol": {
        version: "0.5.16",
        settings: {},
      },
      "contracts/PancakePair.sol": {
        version: "0.5.16",
        settings: {},
      },
      "contracts/PancakeRouter.sol": {
        version: "0.6.6",
        settings: {
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      "contracts/PancakeRouter01.sol": {
        version: "0.6.6",
        settings: {},
      },
      "contracts/PancakeMigrator.sol": {
        version: "0.6.6",
        settings: {},
      },
      "contracts/SousChef.sol": {
        version: "0.6.12",
        settings: {},
      },
      "contracts/SyrupBar.sol": {
        version: "0.6.12",
        settings: {},
      },
      "contracts/Timelock.sol": {
        version: "0.6.12",
        settings: {},
      },
      "contracts/libs/MockBEP20.sol": {
        version: "0.6.12",
        settings: {},
      },
      "contracts/utils/Address.sol": {
        version: "0.6.2",
        settings: {},
      },
      "contracts/test/ERC20.sol": {
        version: "0.5.16",
        settings: {},
      },
      "contracts/libraries/UQ112x112.sol": {
        version: "0.5.16",
        settings: {},
      },
      "contracts/libraries/Math.sol": {
        version: "0.5.16",
        settings: {},
      },
      "contracts/libs/Migrations.sol": {
        version: "0.5.16",
        settings: {},
      },
      "contracts/libs/PancakeVoteProxy.sol": {
        version: "0.6.12",
        settings: {},
      },
      "contracts/token/BEP20/BEP20.sol": {
        version: "0.6.12",
        settings: {},
      },
    },
  },
};
