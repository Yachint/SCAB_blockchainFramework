const ipfsApi = require('ipfs-api');

// const obj = {
//     "chain": [
//         {
//         "index": 1,
//         "timestamp": 1585987965628,
//         "transactions": [],
//         "hash": "0",
//         "nonce": "0",
//         "previousBlockhash": 100,
//         "DHT_Hash": "0x1",
//         "DHT_PrevHash": "0x0"
//         }
//         ],
//         "chainSize": 1,
//         "pendingTransactions": [],
//         "currentNodeUrl": "http://localhost:3011",
//         "networkNodes": []
// }

const uploadFile = async (obj) =>{
    const ipfs = ipfsApi('ipfs.infura.io', '5001', {protocol: 'https'});

    return new Promise((resolve, reject) => {
        //const reader = new FileReader();
        // reader.onloadend = () => {
        var string = JSON.stringify(obj);
        // }
        const buffer = Buffer.from(string);
            ipfs.add(buffer).then(files => {
                resolve(files);
            }).catch(error => reject(error))
        //reader.readAsArrayBuffer(file)
    });

}

const getFiles = async (obj) => {
    const files = await uploadFile(obj);
    //console.log(files);
    return files[0].hash;
}

module.exports = getFiles;