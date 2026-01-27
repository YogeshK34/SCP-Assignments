const crypto = require('crypto');

function generateSHA256(data) {
	return crypto.createHash('sha256').update(data).digest('hex');
};

// I'll define the input, for which I'll be creating the hash
const input1 = 'blockchain';
const input2 = 'Blockchain';

//👆 notice the subtle difference, Blockchain with 'B' capital & blockchain with 'b' small 

// I'll call the generateHash function with with my defined inputs
const hash1 = generateSHA256(input1);
const hash2 = generateSHA256(input2);

// log both the input and the hash
console.log('Input1 : ', input1);
console.log('Hash1 :', hash1, '\n');

console.log('Input 2 :', input2);
console.log('Hash2 :', hash2, '\n');


// I'll add an explicit condition to check whether the inputs match and give customized responses 
if (input1 == input2) {
	console.log("Inputs are same, so the hash should also be the same.")
	if (hash1 == hash2) {
		console.log("Same inputs always produce same hash. Data Integrity Verified.\n")
	}
} else {
	if (hash1 != hash2) {
		console.log("Different inputs produce different hash!");
		console.log("Avalance Effect confirmed! \n");
	};
};

// the function methods uses are: 

// crypto: nodejs built-in library which provides cryptographic functions, used by me in this experiment

// 1. .createHash(): the main function to create the hash, it takes a hash function as input (cannot be empty)

// 2 .update(): Converts input data into UTF-8 encoded byte sequence, as hash can be only calculated in bytes. 

// 3. .digest(): finalizes the hash computation and returns a fixed-length hash value. another distinction is that, 
// after calling .digest(), the Hash object cannot be resued

// 4. hex: is just short of hexadecimal