require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
// Secret
const INFURA_KEY = "61d668eca81642b89bedc402376a951a";
const MUMBAI_PRIVATE_KEY = "b760771e9355ca2440a9a890f2921f999f22e1abee8e5233e3f51e88c7d81ce7"; // testnetAccount1

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
  etherscan: {
    apiKey: "QHGP91TY6CHDEBRBVTCVW7M6Z7FGV9CY98", // rinkeby - etherscan
  },
  networks: {
    fantom: {
      url: `https://rpc.ftm.tools/​`,
      accounts: [`${MUMBAI_PRIVATE_KEY}`],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
      accounts: [`${MUMBAI_PRIVATE_KEY}`],
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [`${MUMBAI_PRIVATE_KEY}`],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      accounts: [`${MUMBAI_PRIVATE_KEY}`],
    },
    cronos: {
      url: "https://cronos-rpc.elk.finance/",
      accounts: [`${MUMBAI_PRIVATE_KEY}`],
      network_id: "*",
      skipDryRun: true,
    },
    cronosTestnet: {
      url: "https://cronos-testnet-3.crypto.org:8545",
      accounts: [`${MUMBAI_PRIVATE_KEY}`],
      network_id: "*",
      skipDryRun: true,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
    ],
    overrides: {
      "contracts/UniswapV2Factory.sol": {
        version: "0.5.16",
        settings: {},
      },
      "contracts/UniswapV2Router02.sol": {
        version: "0.6.6",
        settings: {
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      "contracts/WETH.sol": {
        version: "0.6.6",
        settings: {},
      },
      "contracts/fBTC.sol": {
        version: "0.8.9",
        settings: {},
      },
      "contracts/fUSDT.sol": {
        version: "0.8.9",
        settings: {},
      },
      "contracts/Flashloan.sol": {
        version: "0.6.6",
        settings: {},
      },
    },
  },
};
