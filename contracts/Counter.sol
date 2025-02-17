// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint256 private count;
    mapping(address => uint256) private userCounts;
    address[] private users;
    
    event Incremented(uint256 newCount, address user);
    event Decremented(uint256 newCount, address user);
    event UserRecorded(address user, uint256 userCount);
    
    constructor() {
        count = 0;
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