const router = require('express').Router();
const hash = require('../hash');
const crypto = require('crypto');
const rp = require('request-promise');



router.route('/').get((req,res) => {
    let scabChain = req.app.get('scabChain');

    const lastBlock = scabChain.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const previousDHThash = lastBlock['DHT_Hash'];
    const currentBlockData = {
        transactions: scabChain.pendingTransactions,
        index: lastBlock['index']+1
    }

    const blockHash = hash(currentBlockData, previousBlockHash);
    const currentDHThash = crypto
    .createHash('sha256')
    .update(JSON.stringify(scabChain.hashTable)+blockHash['nonce']).digest("hex");

    const newBlock = scabChain.createNewBlock(
        previousBlockHash,
        blockHash['hash'],
        blockHash['nonce'],
        currentDHThash,
        previousDHThash
    );

    const requestPromises = []
    scabChain.networkNodes.forEach(existingNode => {
        const requestOptions = {
            uri: existingNode + '/receive-new-block',
            method: 'POST',
            body: {
                newBlock: newBlock
            },
            json: true
        }
        requestPromises.push(rp(requestOptions));
    });

    let nodeReplies = 0;

    
    Promise.all(requestPromises)
    .then(data => {
        
        data.forEach(elem => {
            //console.log(elem['reply']);
            if(elem['reply']=== 'PASS'){
                nodeReplies++;
            }
        });
        
        if(nodeReplies >= (Math.floor(scabChain.networkNodes.length+1/2))){
            //console.log('--->',scabChain.pendingTransactions,'<---');
            scabChain.invokeHashTableUpdate();
            scabChain.receiveUpdate(newBlock);
            
            console.log("Block was approved by Network, Adding to chain... ");
        }else{
            console.log("Block was rejected by Network.");
            console.log("IN :",nodeReplies," --Total/2 :",(Math.floor(scabChain.networkNodes.length+1/2)));
        }
        res.json({
            note: "New block mined & broadcasted successfully",
            block: newBlock
        });
    });

});

module.exports = router;