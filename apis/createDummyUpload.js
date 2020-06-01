const { PUBLIC_KEY } = require('./Keys');
const Encrypt = require('./Encrypt');
const IPFS_Upload = require('./IPFS_Upload');

const update = {
    timestamp: new Date().toUTCString(),
    prodId: 'AE670',
    name: 'Football Shoes 6',
    description: 'New Venom Brand',
    toBuyPrice: '$459',
    toBuyQuantity: '10',
    JSON_id: '67',
    status: 'DONE'
}

IPFS_Upload(JSON.stringify(update)).then((data) => {

    console.log(data);
    const encrypted = Encrypt(data,PUBLIC_KEY);
    console.log(encrypted);
})



// const getHash = async () => {
//     console.log(await IPFS_Upload(encrypted));
// }

// getHash();