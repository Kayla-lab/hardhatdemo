// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint256 private count;
    mapping(address => uint256) private userCounts;
    address[] private users;
    uint256 public incrementPrice = 0.001 ether;
    address public owner;
    
    event Incremented(uint256 newCount, address user);
    event Decremented(uint256 newCount, address user);
    event UserRecorded(address user, uint256 userCount);
    event PaidIncrement(uint256 newCount, address user, uint256 amount);
    
    constructor() {
        count = 0;
        owner = msg.sender;
    }
    
    function increment() public {
        count += 1;
        _recordUser();
        emit Incremented(count, msg.sender);
    }
    
    function decrement() public {
        require(count > 0, "Count cannot be negative");
        count -= 1;
        _recordUser();
        emit Decremented(count, msg.sender);
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
    
    function reset() public {
        count = 0;
    }
    
    function paidIncrement() public payable {
        require(msg.value >= incrementPrice, "Insufficient payment");
        count += 1;
        _recordUser();
        emit PaidIncrement(count, msg.sender, msg.value);
        emit Incremented(count, msg.sender);
    }
    
    function setIncrementPrice(uint256 _newPrice) public {
        require(msg.sender == owner, "Only owner can set price");
        incrementPrice = _newPrice;
    }
    
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function _recordUser() private {
        if (userCounts[msg.sender] == 0) {
            users.push(msg.sender);
        }
        userCounts[msg.sender] += 1;
        emit UserRecorded(msg.sender, userCounts[msg.sender]);
    }
    
    function getUserCount(address user) public view returns (uint256) {
        return userCounts[user];
    }
    
    function getAllUsers() public view returns (address[] memory) {
        return users;
    }
    
    function getTotalUsers() public view returns (uint256) {
        return users.length;
    }
}