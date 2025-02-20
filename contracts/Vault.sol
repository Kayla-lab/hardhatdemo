// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Vault {
    mapping(address => uint256) private balances;
    address[] private depositors;
    mapping(address => bool) private hasDeposited;
    
    event Deposit(address indexed depositor, uint256 amount);
    event Withdrawal(address indexed withdrawer, address indexed from, uint256 amount);
    event AllowanceSet(address indexed owner, address indexed spender, uint256 amount);
    
    mapping(address => mapping(address => uint256)) private allowances;
    
    function deposit() public payable {
        require(msg.value > 0, "Must deposit some ETH");
        
        if (!hasDeposited[msg.sender]) {
            depositors.push(msg.sender);
            hasDeposited[msg.sender] = true;
        }
        
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, msg.sender, amount);
    }
    
    function approve(address spender, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance to approve");
        allowances[msg.sender][spender] = amount;
        emit AllowanceSet(msg.sender, spender, amount);
    }
    
    function withdrawFrom(address from, uint256 amount) public {
        require(allowances[from][msg.sender] >= amount, "Insufficient allowance");
        require(balances[from] >= amount, "Owner has insufficient balance");
        
        allowances[from][msg.sender] -= amount;
        balances[from] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, from, amount);
    }
    
    function getBalance(address account) public view returns (uint256) {
        return balances[account];
    }
    
    function getAllowance(address owner, address spender) public view returns (uint256) {
        return allowances[owner][spender];
    }
    
    function getMyBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    
    function getAllDepositors() public view returns (address[] memory) {
        return depositors;
    }
    
    function getTotalDepositors() public view returns (uint256) {
        return depositors.length;
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}