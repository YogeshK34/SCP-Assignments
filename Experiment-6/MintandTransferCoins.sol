// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MintandTransferCoins {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // I created this mapping to store each address and their coin balance
    mapping(address => uint) public balances;

    // I created these events to log transfers and minting on the blockchain
    event Transfer(address from, address to, uint amount);
    event Mint(address receiver, uint amount);

    // I created this modifier to ensure only the owner can mint new coins
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint coins");
        _;
    }

    // This function mints new coins to a receiver's account, only accessible by owner
    function mintCoins(address receiver, uint amount) public onlyOwner {
        balances[receiver] += amount;
        emit Mint(receiver, amount);
    }

    // This function transfers coins from sender to recipient after checking sufficient balance
    function transferCoins(address _to, uint amount) public {
        require(balances[msg.sender] >= amount, "Sender's balance is less than the amount entered!");
        balances[msg.sender] -= amount;
        balances[_to] += amount;
        emit Transfer(msg.sender, _to, amount);
    }
}