const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Counter contract...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  
  await counter.waitForDeployment();
  
  const address = await counter.getAddress();
  console.log("Counter contract deployed to:", address);
  
  console.log("Initial count:", await counter.getCount());
  
  console.log("\nTesting contract functions:");
  console.log("Incrementing...");
  await counter.increment();
  console.log("Count after increment:", await counter.getCount());
  
  console.log("Incrementing again...");
  await counter.increment();
  console.log("Count after second increment:", await counter.getCount());
  
  console.log("Decrementing...");
  await counter.decrement();
  console.log("Count after decrement:", await counter.getCount());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });