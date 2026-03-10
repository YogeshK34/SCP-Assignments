// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MintandTransferCoins {

    address public owner;

    // initializing owner as the caller's address
    constructor() {
        owner = msg.sender;
    }

    // I'll create a mapping that'll store address and their balances 
    mapping(address => uint) public balances;


    // I've created this event so that every time coins are transferred between accounts,
    // a log entry is emitted on the blockchain which can later be viewed in Remix logs
    // or by external applications tracking transactions
    event Transfer(address from, address to, uint amount);

    // I've created this event to log whenever new coins are minted by the owner
    // this helps in tracking coin creation activity on the blockchain
    event Mint(address receiver, uint amount);

    // i've created a modifier to verify that only owner can mint new coins 
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint coins");
        _;
    }

    // furthermore I wrote a function to mint new coins and send to a reciever account 
    // this function is only accessible to owner, because we've added the onlyOwner modifier here  
    function mintCoins(address receiver, uint amount) public onlyOwner {
        balances[receiver] += amount;

        // here I emit the Mint event so that the minting transaction is recorded in the logs
        emit Mint(receiver, amount);
    }


    // I wrote a simple tranfer function to transfer ether to recipient's account, it follows the recommended pattern 
    // first it checks if the caller has correct amount, if yes, it proceeds, and if not throws a custom message 
    // decrements the amount from receiver and then increments to the receiver  
    function transferCoins(address _to, uint amount) public {

        require(balances[msg.sender] >= amount, "Sender's balance is less than the amount entered!");

        balances[msg.sender] -= amount;

        balances[_to] += amount;

        // after updating balances, I emit the Transfer event to record that a transfer
        // of coins occurred from the sender to the receiver
        emit Transfer(msg.sender, _to, amount);
    }
}
