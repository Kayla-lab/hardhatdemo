const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  let counter;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
  });

  it("Should start with count 0", async function () {
    expect(await counter.getCount()).to.equal(0);
  });

  it("Should increment the count", async function () {
    await counter.increment();
    expect(await counter.getCount()).to.equal(1);
  });

  it("Should decrement the count", async function () {
    await counter.increment();
    await counter.decrement();
    expect(await counter.getCount()).to.equal(0);
  });

  it("Should not allow decrementing below zero", async function () {
    await expect(counter.decrement()).to.be.revertedWith("Count cannot be negative");
  });

  it("Should reset count to zero", async function () {
    await counter.increment();
    await counter.increment();
    await counter.reset();
    expect(await counter.getCount()).to.equal(0);
  });

  it("Should emit Incremented event", async function () {
    await expect(counter.increment())
      .to.emit(counter, "Incremented")
      .withArgs(1, owner.address);
  });

  it("Should emit Decremented event", async function () {
    await counter.increment();
    await expect(counter.decrement())
      .to.emit(counter, "Decremented")
      .withArgs(0, owner.address);
  });

  it("Should handle multiple increments", async function () {
    await counter.increment();
    await counter.increment();
    await counter.increment();
    expect(await counter.getCount()).to.equal(3);
  });

  it("Should record user interactions", async function () {
    await counter.increment();
    expect(await counter.getUserCount(owner.address)).to.equal(1);
    
    await counter.increment();
    expect(await counter.getUserCount(owner.address)).to.equal(2);
    
    await counter.decrement();
    expect(await counter.getUserCount(owner.address)).to.equal(3);
  });

  it("Should track multiple users", async function () {
    const [, user1, user2] = await ethers.getSigners();
    
    await counter.connect(user1).increment();
    await counter.connect(user2).increment();
    await counter.connect(user1).increment();
    
    expect(await counter.getUserCount(user1.address)).to.equal(2);
    expect(await counter.getUserCount(user2.address)).to.equal(1);
    expect(await counter.getTotalUsers()).to.equal(2);
    
    const allUsers = await counter.getAllUsers();
    expect(allUsers).to.include(user1.address);
    expect(allUsers).to.include(user2.address);
  });

  it("Should emit UserRecorded event", async function () {
    await expect(counter.increment())
      .to.emit(counter, "UserRecorded")
      .withArgs(owner.address, 1);
  });

  it("Should accept payment for paid increment", async function () {
    const incrementPrice = ethers.parseEther("0.001");
    
    await expect(counter.paidIncrement({ value: incrementPrice }))
      .to.emit(counter, "PaidIncrement")
      .withArgs(1, owner.address, incrementPrice);
      
    expect(await counter.getCount()).to.equal(1);
    expect(await counter.getBalance()).to.equal(incrementPrice);
  });

  it("Should reject insufficient payment", async function () {
    const insufficientPayment = ethers.parseEther("0.0005");
    
    await expect(counter.paidIncrement({ value: insufficientPayment }))
      .to.be.revertedWith("Insufficient payment");
  });

  it("Should allow owner to set price", async function () {
    const newPrice = ethers.parseEther("0.002");
    
    await counter.setIncrementPrice(newPrice);
    expect(await counter.incrementPrice()).to.equal(newPrice);
  });

  it("Should not allow non-owner to set price", async function () {
    const [, user1] = await ethers.getSigners();
    const newPrice = ethers.parseEther("0.002");
    
    await expect(counter.connect(user1).setIncrementPrice(newPrice))
      .to.be.revertedWith("Only owner can set price");
  });

  it("Should allow owner to withdraw funds", async function () {
    const incrementPrice = ethers.parseEther("0.001");
    
    await counter.paidIncrement({ value: incrementPrice });
    
    const initialBalance = await ethers.provider.getBalance(owner.address);
    const tx = await counter.withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;
    const finalBalance = await ethers.provider.getBalance(owner.address);
    
    expect(finalBalance).to.be.closeTo(initialBalance + incrementPrice - gasUsed, ethers.parseEther("0.0001"));
    expect(await counter.getBalance()).to.equal(0);
  });

  it("Should not allow non-owner to withdraw", async function () {
    const [, user1] = await ethers.getSigners();
    
    await expect(counter.connect(user1).withdraw())
      .to.be.revertedWith("Only owner can withdraw");
  });
});