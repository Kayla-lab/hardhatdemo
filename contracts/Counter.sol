// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint256 private count;
    
    event Incremented(uint256 newCount);
    event Decremented(uint256 newCount);
    
    constructor() {
        count = 0;
    }
    
    function increment() public {
        count += 1;
        emit Incremented(count);
    }
    
    function decrement() public {
        require(count > 0, "Count cannot be negative");
        count -= 1;
        emit Decremented(count);
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
    
    function reset() public {
        count = 0;
    }
}