const ipfsExtract = require('./IPFS_ExtractTest');
const rp = require('request-promise');

const getObj = function(){
    //with ASYNC-AWAIT
    // const something = await ipfsExtract('QmWmTXeSg325uJX7qVz9tHe6YTc4CCr6yXDdRzSfd7Y6t6');
    // console.log('TEST :',something);
    // console.log('TEST :',typeof(something));

    // Promise.resolve(ipfsExtract('QmWmTXeSg325uJX7qVz9tHe6YTc4CCr6yXDdRzSfd7Y6t6')).then(
    //     data => {
    //         console.log(data);
    //     }
    // )

    let promise = new Promise(function(resolve, reject){
        resolve(ipfsExtract('QmWmTXeSg325uJX7qVz9tHe6YTc4CCr6yXDdRzSfd7Y6t6'));
    }).then( data => {
        console.log(data);
        console.log(promise);
    })

    
}



getObj();