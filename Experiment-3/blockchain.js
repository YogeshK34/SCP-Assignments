const crypto = require("crypto");

// ─────────────────────────────────────────────
// 1.  BLOCK CLASS
// ─────────────────────────────────────────────
class Block {
  constructor(index, timestamp, transactions, previousHash = "") {
    this.index = index;                     // Position in the chain
    this.timestamp = timestamp;             // When the block was created
    this.transactions = transactions;       // Array of transaction objects
    this.previousHash = previousHash;       // Hash of the block before this one
    this.nonce = 0;                         // Proof-of-work counter
    this.hash = this.calculateHash();       // This block's own hash
  }

  // Concatenate all block fields and produce a SHA-256 hash
  calculateHash() {
    const data =
      this.index +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.previousHash +
      this.nonce;

    return crypto.createHash("sha256").update(data).digest("hex");
  }

  // ── Proof-of-Work Mining ──
  // Keep hashing (incrementing nonce) until the hash
  // starts with `difficulty` number of leading zeroes.
  mineBlock(difficulty) {
    const target = "0".repeat(difficulty);                     // e.g. "0000"

    console.log(`\n⛏️  Mining block #${this.index}...`);

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;                                            // Try next nonce
      this.hash = this.calculateHash();                        // Re-hash
    }

    console.log(`✅ Block #${this.index} mined!`);
    console.log(`   Nonce      : ${this.nonce}`);
    console.log(`   Hash       : ${this.hash}`);
  }
}

// ─────────────────────────────────────────────
// 2.  TRANSACTION CLASS
// ─────────────────────────────────────────────
class Transaction {
  constructor(sender, receiver, amount) {
    this.id = crypto.randomBytes(8).toString('hex');   // Unique transaction ID
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.timestamp = new Date().toISOString();
  }

  // Pretty-print for logging
  toString() {
    return `[TX ${this.id}] ${this.sender} → ${this.receiver} : ${this.amount} coins`;
  }
}

// ─────────────────────────────────────────────
// 3.  BLOCKCHAIN CLASS
// ─────────────────────────────────────────────
class Blockchain {
  constructor(difficulty = 3) {
    this.chain = [this.createGenesisBlock()];  // Chain always starts with genesis
    this.difficulty = difficulty;              // Number of leading zeroes required
    this.pendingTransactions = [];             // Transactions waiting to be mined
    this.miningReward = 50;                   // Reward (coins) given to the miner
  }

  // ── Genesis Block ──
  // The very first block; has no previous hash.
  createGenesisBlock() {
    console.log("🟢 Genesis block created.");
    return new Block(0, new Date().toISOString(), ["Genesis Block"], "0");
  }

  // ── Get the latest (most recent) block ──
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // ── Add a transaction to the pending pool ──
  addTransaction(transaction) {
    if (!transaction.sender || !transaction.receiver) {
      throw new Error("Transaction must have a sender and receiver.");
    }
    if (transaction.amount <= 0) {
      throw new Error("Transaction amount must be greater than 0.");
    }
    this.pendingTransactions.push(transaction);
    console.log(`📝 Transaction added to pending pool: ${transaction.toString()}`);
  }

  // ── Mine pending transactions into a new block ──
  // The miner is rewarded with `miningReward` coins.
  minePendingTransactions(minerAddress) {
    if (this.pendingTransactions.length === 0) {
      console.log("⚠️  No pending transactions to mine.");
      return;
    }

    // Add the mining reward as a special transaction (coinbase)
    const rewardTx = new Transaction("NETWORK", minerAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    // Create a new block with all pending transactions
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      this.pendingTransactions,
      this.getLatestBlock().hash       // Link to the current chain tip
    );

    // Run proof-of-work on the new block
    newBlock.mineBlock(this.difficulty);

    // Append the mined block to the chain
    this.chain.push(newBlock);

    // Clear the pending pool
    this.pendingTransactions = [];

    console.log(`🔗 Block #${newBlock.index} added to the chain.\n`);
  }

  // ── Calculate the balance of an address ──
  // Walk through every transaction in every block.
  getBalance(address) {
    let balance = 0;

    for (const block of this.chain) {
      if (Array.isArray(block.transactions)) {
        for (const tx of block.transactions) {
          if (typeof tx === "object") {
            if (tx.receiver === address) balance += tx.amount;  // Received
            if (tx.sender === address)   balance -= tx.amount;  // Sent
          }
        }
      }
    }
    return balance;
  }

  // ── Validate the entire blockchain ──
  // Two checks per block:
  //   (a) Its stored hash matches a freshly computed hash.
  //   (b) Its previousHash matches the hash of the block before it.
  isValidChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const current  = this.chain[i];
      const previous = this.chain[i - 1];

      // (a) Integrity check — has any data in this block been tampered with?
      if (current.hash !== current.calculateHash()) {
        console.log(`❌ Block #${i} hash is invalid (tampered data).`);
        return false;
      }

      // (b) Linkage check — does this block correctly point to the previous one?
      if (current.previousHash !== previous.hash) {
        console.log(`❌ Block #${i} previousHash does not match Block #${i - 1}.`);
        return false;
      }
    }

    console.log("✅ Blockchain is valid.");
    return true;
  }

  // ── Print the full chain ──
  printChain() {
    console.log("\n═══════════════════════════════════════════");
    console.log("            📚  FULL BLOCKCHAIN             ");
    console.log("═══════════════════════════════════════════\n");

    this.chain.forEach((block, i) => {
      console.log(`--- Block #${block.index} ---`);
      console.log(`  Timestamp    : ${block.timestamp}`);
      console.log(`  Previous Hash: ${block.previousHash}`);
      console.log(`  Hash         : ${block.hash}`);
      console.log(`  Nonce        : ${block.nonce}`);
      console.log(`  Transactions :`);

      if (Array.isArray(block.transactions)) {
        block.transactions.forEach((tx) => {
          if (typeof tx === "object") {
            console.log(`    ${tx.toString()}`);
          } else {
            console.log(`    ${tx}`);                          // Genesis label
          }
        });
      }
      console.log("");
    });
  }
}

// ─────────────────────────────────────────────
// 4.  DEMO — Run the Blockchain
// ─────────────────────────────────────────────
console.log("===========================================");
console.log("       🪙  NODE.JS BLOCKCHAIN DEMO         ");
console.log("===========================================\n");

// Create a blockchain with difficulty 3 (hash must start with "000")
const myChain = new Blockchain(3);

// ── Create and add transactions ──
const tx1 = new Transaction("Alice", "Bob", 30);
const tx2 = new Transaction("Bob", "Charlie", 10);
myChain.addTransaction(tx1);
myChain.addTransaction(tx2);

// ── Mine the pending transactions (Alice is the miner) ──
myChain.minePendingTransactions("Alice");

// ── Add more transactions ──
const tx3 = new Transaction("Charlie", "Alice", 5);
const tx4 = new Transaction("Bob", "Alice", 15);
myChain.addTransaction(tx3);
myChain.addTransaction(tx4);

// ── Mine again ──
myChain.minePendingTransactions("Bob");

// ── Print the full chain ──
myChain.printChain();

// ── Show balances ──
console.log("═══════════════════════════════════════════");
console.log("            💰  ACCOUNT BALANCES            ");
console.log("═══════════════════════════════════════════\n");
["Alice", "Bob", "Charlie"].forEach((name) => {
  console.log(`  ${name.padEnd(10)}: ${myChain.getBalance(name)} coins`);
});
console.log("");

// ── Validate the chain (should be valid) ──
console.log("═══════════════════════════════════════════");
console.log("       🔍  BLOCKCHAIN VALIDATION            ");
console.log("═══════════════════════════════════════════\n");
myChain.isValidChain();

// ── Simulate tampering ──
console.log("\n🚨 Tampering with Block #1 data...");
myChain.chain[1].transactions[0].amount = 9999;   // Corrupt a transaction

// ── Validate again (should now fail) ──
console.log("🔍 Re-validating after tampering:\n");
myChain.isValidChain();
