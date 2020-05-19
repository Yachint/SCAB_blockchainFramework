const rp = require('request-promise');

const getObject = (hash) => {
    const requestOptions = {
        uri: 'https://ipfs.infura.io/ipfs/'+hash,
        method: 'GET',
        json: true
    };

    return rp(requestOptions);
}

module.exports = getObject;