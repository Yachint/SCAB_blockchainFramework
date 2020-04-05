const rp = require('request-promise');

const getChainFromIPFS = (hash) => {
    
    const requestOptions = {
        uri: 'https://ipfs.infura.io/ipfs/'+hash,
        method: 'GET',
        json: true
    };

    return rp(requestOptions);
}

// getChainFromIPFS('QmWmTXeSg325uJX7qVz9tHe6YTc4CCr6yXDdRzSfd7Y6t6');

module.exports = getChainFromIPFS;
