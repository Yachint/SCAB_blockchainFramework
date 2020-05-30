const { PUBLIC_KEY } = require('./Keys');
const Encrypt = require('./Encrypt');
const IPFS_Upload = require('./IPFS_Upload');

const update = {
    timestamp: new Date().toGMTString(),
    from: "0x73190C25D4C247a388203162aA223a900772978b",
    amount: '160',
    action: 'get'
}

const encrypted = Encrypt(JSON.stringify(update),PUBLIC_KEY);

console.log(encrypted);

// const getHash = async () => {
//     console.log(await IPFS_Upload(encrypted));
// }

// getHash();