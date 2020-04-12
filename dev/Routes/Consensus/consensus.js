const rp = require('request-promise');
const router = require('express').Router();

router.route('/').get((req,res) => {
    let scabChain = req.app.get('scabChain');

    const reqProms = []
    scabChain.networkNodes.forEach(existingNodeUrl => {
        const requestOptions = {
            uri: existingNodeUrl+'/blockchain',
            method: 'GET',
            json: true
        };

        reqProms.push(rp(requestOptions));
    });

    Promise.all(reqProms).then(blockchains => {
        const currentChainLength = scabChain.chainSize;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;
        let newDHT = null;
        let maxLength = null;
        let nodeURL = null

        blockchains.forEach(blkChain => {
            if(blkChain.chain.length > maxChainLength){
                maxChainLength = blkChain.chain.length;
                newLongestChain = blkChain.chain;
                newPendingTransactions = blkChain.pendingTransactions;
                newDHT = blkChain.hashTable;
                maxLength = blkChain.chainSize;
                nodeURL = blkChain.currentNodeUrl;
            }
        });


        if(!newLongestChain 
            || (newLongestChain && !scabChain.chainIsValid(newLongestChain))){
                console.log('No longest chain that is also valid, CONTINUING... ');
                res.json({ 
                    note: 'Current chain hash not been replaced',
                    chain: scabChain.chain
                })
            }
        else if(newLongestChain && scabChain.chainIsValid(newLongestChain)){
            console.log('Found Valid Longest Chain at ',nodeURL,', REPLACING... ');
            scabChain.chain = newLongestChain;
            scabChain.pendingTransactions = newPendingTransactions;
            scabChain.hashTable.replaceHashTable(newDHT);
            scabChain.chainSize = maxLength;
            res.json({
                note: 'This chain has been replaced',
                chain: scabChain.chain
            })
        }

    }).catch((error)=>{
        console.log('ERROR :',error);
    });
});

module.exports = router;