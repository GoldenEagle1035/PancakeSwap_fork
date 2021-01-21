const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const PancakePair = require("../artifacts/contracts/PancakePair.sol/PancakePair.json");
describe("Deploy Pancakeswap", () => {
  // local network provider
  const provider = ethers.provider;
  // const secondPerBlock = 5; // 5 seconds per block
  // How to manipulate block time and minting: https://ethereum.stackexchange.com/questions/86633/time-dependent-tests-with-hardhat
  const waitXBlocks = async (numBlocks, secondPerBlock = 5) => {
    for (let i = 0; i < numBlocks; i++) {
      await provider.send("evm_increaseTime", [secondPerBlock]);
      await provider.send("evm_mine");
    }
  };
  // Cake emission per block in Wei
  const cakePerBlock = ethers.utils.parseEther("10").toString();
  let INIT_CODE_PAIR_HASH;
  // 3 accounts
  let deployer;
  let user1;
  let user2;

  // fBTC token
  let _fBtcContract;
  let fBtcContract;
  let fBtcAddress;

  // fUSDT token
  let _fUsdtContract;
  let fUsdtContract;
  let fUsdtAddress;

  // WETH Contract
  let _wethContract;
  let wethContract;
  let wethAddress;

  // Cake Token
  let _cakeTokenContract;
  let cakeTokenContract;
  let cakeTokenAddress;

  // Syrup Token
  let _syrupTokenContract;
  let syrupTokenContract;
  let syrupTokenAddress;

  // pancake factory contract
  let _pancakeFactoryContract;
  let pancakeFactoryContract;
  let pancakeFactoryAddress;

  // pancake router contract
  let _pancakeRouterContract;
  let pancakeRouterContract;
  let pancakeRouterAddress;

  // pancake masterchef contract
  let _pancakeMasterchefContract;
  let pancakeMasterchefContract;
  let pancakeMasterchefAddress;

  it("deploys the pancakeswap contract", async () => {
    [deployer, user1, user2] = await ethers.getSigners();

    // deploy Cake Token
    _cakeTokenContract = await ethers.getContractFactory("CakeToken");
    cakeTokenContract = await _cakeTokenContract.deploy();
    cakeTokenAddress = cakeTokenContract.address;
    console.log("Cake Token Address: ", cakeTokenAddress);

    // deploy Syrup Token
    _syrupTokenContract = await ethers.getContractFactory("SyrupBar");
    syrupTokenContract = await _syrupTokenContract.deploy(cakeTokenAddress);
    syrupTokenAddress = syrupTokenContract.address;
    console.log("SyrupBar Address: ", syrupTokenAddress);

    // deploy WETH contract
    _wethContract = await ethers.getContractFactory("WETH");
    wethContract = await _wethContract.deploy();
    wethAddress = wethContract.address;
    console.log("WETH Contract Address: " + wethAddress);

    // deploy pancake factory
    _pancakeFactoryContract = await ethers.getContractFactory("PancakeFactory");
    pancakeFactoryContract = await _pancakeFactoryContract.deploy(deployer.address); // feeTo Address -> deployer
    pancakeFactoryAddress = pancakeFactoryContract.address;
    console.log("PancakeFactory deployed to:", pancakeFactoryAddress);
    INIT_CODE_PAIR_HASH = await pancakeFactoryContract.INIT_CODE_PAIR_HASH();
    console.log("INIT_CODE_PAIR_HASH:", INIT_CODE_PAIR_HASH);
    //INIT_CODE_PAIR_HASH: bea2c879460881406b400d869e4aca4b8ca6751094b6210b294e297255dd5c45
    // Modify `./contracts/libraries/PanakeLibrary.sol` to include `INIT_CODE_PAIR_HASH`

    // deploy pancake router
    _pancakeRouterContract = await ethers.getContractFactory("PancakeRouter");
    pancakeRouterContract = await _pancakeRouterContract.deploy(pancakeFactoryAddress, wethAddress);
    pancakeRouterAddress = pancakeRouterContract.address;
    console.log("PancakeRouter deployed to:", pancakeRouterAddress);

    // deploy pancake masterchef
    _pancakeMasterchefContract = await ethers.getContractFactory("MasterChef");
    const currentBlock = await provider.getBlock("latest");
    pancakeMasterchefContract = await _pancakeMasterchefContract.deploy(cakeTokenAddress, syrupTokenAddress, deployer.address, cakePerBlock, (currentBlock.number + 10).toString());
    console.log("PancakeMasterchef deployed to:", pancakeMasterchefContract.address);

    // check cake's total supply
    // let cakeTotalSupply = await cakeTokenContract.totalSupply();
    // console.log("cakeTotalSupply Before:", cakeTotalSupply);

    // await waitXBlocks(50)

    // const blockNumAfter = await ethers.provider.getBlockNumber();
    // const blockAfter = await ethers.provider.getBlock(blockNumAfter);
    // const timestampAfter = blockAfter.timestamp;
    // console.log("blockNumAfter:", blockNumAfter)
    // console.log("timestampAfter: ", timestampAfter)

    // cake total Supply
    // let cakeTotalSupplyAfter = await cakeTokenContract.totalSupply();
    // console.log("cakeTotalSupplyAfter:", cakeTotalSupplyAfter); // Still Zero
  });

  it("deployed the fBTC and fUSDT Tokens", async () => {
    const fBtcSupplyWei = ethers.utils.parseEther("1000000000").toString();
    const fUsdtSupplyWei = ethers.utils.parseEther("1000000000").toString();

    // fBTC
    _fBtcContract = await ethers.getContractFactory("fBTC");
    fBtcContract = await _fBtcContract.deploy(fBtcSupplyWei);
    fBtcAddress = fBtcContract.address;
    console.log("fBTC Address:", fBtcAddress);

    // fUSDT
    _fUsdtContract = await ethers.getContractFactory("fUSDT");
    fUsdtContract = await _fUsdtContract.deploy(fUsdtSupplyWei);
    fUsdtAddress = fUsdtContract.address;
    console.log("fUSDT Address:", fUsdtAddress);

    // Approve Tokens
    await fBtcContract.connect(deployer).approve(pancakeRouterAddress, fBtcSupplyWei);
    await fUsdtContract.connect(deployer).approve(pancakeRouterAddress, fUsdtSupplyWei);

    // Add Liquidity
    const latestBlock = await provider.getBlock("latest");
    const latestBlockTimestamp = latestBlock.timestamp;

    // add liquidity to Uniswap 1
    let fBtcLiquidity = "100";
    let fUsdtLiquidity = "4000000";
    fBtcLiquidity = ethers.utils.parseEther(fBtcLiquidity).toString();
    fUsdtLiquidity = ethers.utils.parseEther(fUsdtLiquidity).toString();

    await pancakeRouterContract
      .connect(deployer)
      .addLiquidity(fBtcAddress, fUsdtAddress, fBtcLiquidity, fUsdtLiquidity, fBtcLiquidity, fUsdtLiquidity, deployer.address, latestBlockTimestamp + 1000);
  });

  it("set Cake Rewards for fBTC-fUSDT Pair", async () => {
    // get Pair Address of fBTC-fUSDT
    const pairAddress = await pancakeFactoryContract.getPair(fBtcAddress, fUsdtAddress);
    console.log("fBtc-fUSDT LPToken Address:", pairAddress);
    console.log("fBTC and fUSDT added liquidity to pancakeswap router.");


    const fBtcfUsdtLpContract = await ethers.getContractAt(PancakePair.abi, pairAddress)
    let ownersLpTokenBalance = await fBtcfUsdtLpContract.balanceOf(deployer.address);
    console.log("fBtc-fUSDT ownersLpTokenBalance:", ownersLpTokenBalance);

    // Reward Params
    const allocPoint = "1000";
    const lpTokenAddr = pairAddress;
    const withUpdate = true;

    await pancakeMasterchefContract.add(allocPoint, lpTokenAddr, withUpdate);
    poolLength = await pancakeMasterchefContract.poolLength();
    console.log("pool length after adding fBTC-fUSDT:", poolLength); // 2 -> Cake pool + fBTC-fUSDT pool")

    // Approve Lptoken for Masterchef
    await fBtcfUsdtLpContract.connect(deployer).approve(pancakeMasterchefContract.address, ownersLpTokenBalance);


    // check poolinfo1 - CORRECT!
    // const poolInfo1 = await pancakeMasterchefContract.poolInfo(1);
    // console.log("poolInfo1:", poolInfo1);

    // Deposit LP into masterChef contract
    await pancakeMasterchefContract.deposit(1, ownersLpTokenBalance.sub(100))
    ownersLpTokenBalance = await fBtcfUsdtLpContract.balanceOf(deployer.address);
    console.log("fBtc-fUSDT LPToken Balance After Deposit:", ownersLpTokenBalance);

    // check user's pending Cake Reward
    let pendingCake = await pancakeMasterchefContract.pendingCake(1, deployer.address);
    console.log("pendingCake:", pendingCake);

    // 100 blocks pass by
    await waitXBlocks(1000);
    pendingCake = await pancakeMasterchefContract.pendingCake(1, deployer.address);
    console.log("pendingCake After 100 blocks:", pendingCake);

    // check userInfo
    // let userInfo = await pancakeMasterchefContract.userInfo(1, deployer.address);
    // console.log("userInfo:", userInfo);

    // @BUGS: Transfer ownership ???
    await cakeTokenContract.transferOwnership(pancakeMasterchefContract.address);
    await syrupTokenContract.transferOwnership(pancakeMasterchefContract.address);
    // claim reward
    await pancakeMasterchefContract.deposit(1, "0")
    const cakeInMyWallet = await cakeTokenContract.balanceOf(deployer.address);
    console.log("Cake in my wallet:", cakeInMyWallet);

  });
});
