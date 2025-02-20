const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault", function () {
  let vault;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy();
  });

  it("Should allow deposits", async function () {
    const depositAmount = ethers.parseEther("1.0");
    
    await expect(vault.connect(user1).deposit({ value: depositAmount }))
      .to.emit(vault, "Deposit")
      .withArgs(user1.address, depositAmount);
      
    expect(await vault.getBalance(user1.address)).to.equal(depositAmount);
    expect(await vault.getContractBalance()).to.equal(depositAmount);
  });

  it("Should reject zero deposits", async function () {
    await expect(vault.connect(user1).deposit({ value: 0 }))
      .to.be.revertedWith("Must deposit some ETH");
  });

  it("Should allow withdrawals", async function () {
    const depositAmount = ethers.parseEther("1.0");
    const withdrawAmount = ethers.parseEther("0.5");
    
    await vault.connect(user1).deposit({ value: depositAmount });
    
    await expect(vault.connect(user1).withdraw(withdrawAmount))
      .to.emit(vault, "Withdrawal")
      .withArgs(user1.address, user1.address, withdrawAmount);
      
    expect(await vault.getBalance(user1.address)).to.equal(depositAmount - withdrawAmount);
  });

  it("Should reject withdrawal with insufficient balance", async function () {
    const withdrawAmount = ethers.parseEther("1.0");
    
    await expect(vault.connect(user1).withdraw(withdrawAmount))
      .to.be.revertedWith("Insufficient balance");
  });

  it("Should allow setting allowances", async function () {
    const depositAmount = ethers.parseEther("1.0");
    const allowanceAmount = ethers.parseEther("0.5");
    
    await vault.connect(user1).deposit({ value: depositAmount });
    
    await expect(vault.connect(user1).approve(user2.address, allowanceAmount))
      .to.emit(vault, "AllowanceSet")
      .withArgs(user1.address, user2.address, allowanceAmount);
      
    expect(await vault.getAllowance(user1.address, user2.address)).to.equal(allowanceAmount);
  });

  it("Should reject allowance greater than balance", async function () {
    const allowanceAmount = ethers.parseEther("1.0");
    
    await expect(vault.connect(user1).approve(user2.address, allowanceAmount))
      .to.be.revertedWith("Insufficient balance to approve");
  });

  it("Should allow withdrawFrom with allowance", async function () {
    const depositAmount = ethers.parseEther("1.0");
    const allowanceAmount = ethers.parseEther("0.5");
    const withdrawAmount = ethers.parseEther("0.3");
    
    await vault.connect(user1).deposit({ value: depositAmount });
    await vault.connect(user1).approve(user2.address, allowanceAmount);
    
    await expect(vault.connect(user2).withdrawFrom(user1.address, withdrawAmount))
      .to.emit(vault, "Withdrawal")
      .withArgs(user2.address, user1.address, withdrawAmount);
      
    expect(await vault.getBalance(user1.address)).to.equal(depositAmount - withdrawAmount);
    expect(await vault.getAllowance(user1.address, user2.address)).to.equal(allowanceAmount - withdrawAmount);
  });

  it("Should reject withdrawFrom without sufficient allowance", async function () {
    const depositAmount = ethers.parseEther("1.0");
    const withdrawAmount = ethers.parseEther("0.5");
    
    await vault.connect(user1).deposit({ value: depositAmount });
    
    await expect(vault.connect(user2).withdrawFrom(user1.address, withdrawAmount))
      .to.be.revertedWith("Insufficient allowance");
  });

  it("Should reject withdrawFrom when owner has insufficient balance", async function () {
    const depositAmount = ethers.parseEther("0.3");
    const allowanceAmount = ethers.parseEther("0.5");
    const withdrawAmount = ethers.parseEther("0.5");
    
    await vault.connect(user1).deposit({ value: depositAmount });
    await vault.connect(user1).approve(user2.address, allowanceAmount);
    
    await expect(vault.connect(user2).withdrawFrom(user1.address, withdrawAmount))
      .to.be.revertedWith("Owner has insufficient balance");
  });

  it("Should track depositors", async function () {
    const depositAmount = ethers.parseEther("1.0");
    
    await vault.connect(user1).deposit({ value: depositAmount });
    await vault.connect(user2).deposit({ value: depositAmount });
    
    expect(await vault.getTotalDepositors()).to.equal(2);
    
    const depositors = await vault.getAllDepositors();
    expect(depositors).to.include(user1.address);
    expect(depositors).to.include(user2.address);
  });

  it("Should not duplicate depositors", async function () {
    const depositAmount = ethers.parseEther("1.0");
    
    await vault.connect(user1).deposit({ value: depositAmount });
    await vault.connect(user1).deposit({ value: depositAmount });
    
    expect(await vault.getTotalDepositors()).to.equal(1);
  });

  it("Should handle multiple users and allowances", async function () {
    const depositAmount = ethers.parseEther("2.0");
    const allowance1 = ethers.parseEther("0.5");
    const allowance2 = ethers.parseEther("0.3");
    
    await vault.connect(user1).deposit({ value: depositAmount });
    await vault.connect(user1).approve(user2.address, allowance1);
    await vault.connect(user1).approve(owner.address, allowance2);
    
    expect(await vault.getAllowance(user1.address, user2.address)).to.equal(allowance1);
    expect(await vault.getAllowance(user1.address, owner.address)).to.equal(allowance2);
    
    await vault.connect(user2).withdrawFrom(user1.address, allowance1);
    await vault.connect(owner).withdrawFrom(user1.address, allowance2);
    
    expect(await vault.getBalance(user1.address)).to.equal(depositAmount - allowance1 - allowance2);
  });
});