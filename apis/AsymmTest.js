const crypto = require('crypto');
const Encrypt = require('./Encrypt');
const Decrypt = require('./Decrypt');
const { PUBLIC_KEY } = require('./Keys');
const { PRIVATE_KEY } = require('./Keys');

// console.log(PUBLIC_KEY);

let a = Encrypt("QmTHwPytV4cs41fWcxz4JQu54Yi9Q7ducqKH9LL9HzFJSD", PUBLIC_KEY);
console.log(a);
let b = Decrypt(a, PRIVATE_KEY);
console.log(b)