// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IfElse {
    function factorialDecrement(uint num) public pure returns (uint) {
        
        // TASK: Using if–else conditions to handle base cases (0! and 1!)
        if (num == 0 || num == 1) {
            return 1; 
        } 
        else {
            // TASK: Implementing a function logic to compute factorial
            uint result = 1; 
            
            // I start at i at the input number, and count down to 2
            // Then stop at i > 1 because multiplying by 1 changes nothing
            for (uint i = num; i > 1; i--) {
                result *= i;
            }            
            return result;
        }
    }
}
