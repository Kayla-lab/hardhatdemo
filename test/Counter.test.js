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
      .withArgs(1);
  });

  it("Should emit Decremented event", async function () {
    await counter.increment();
    await expect(counter.decrement())
      .to.emit(counter, "Decremented")
      .withArgs(0);
  });

  it("Should handle multiple increments", async function () {
    await counter.increment();
    await counter.increment();
    await counter.increment();
    expect(await counter.getCount()).to.equal(3);
  });
});