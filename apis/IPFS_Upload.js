const ipfsApi = require('ipfs-api');

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

const createHash =  async (obj) => {
    const files = await uploadFile(obj);
    return files[0].hash;
}

module.exports = createHash;