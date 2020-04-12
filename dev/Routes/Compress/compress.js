const router = require('express').Router();
const crypto = require('crypto');
const IpfsExtract = require('../../IPFS_ExtractTest');
const rp = require('request-promise');

router.route('/accept').post((req,res) => {
    let scabChain = req.app.get('scabChain');

    const superBlock = req.body.superBlock;
    scabChain.receiveCompressed(superBlock);
    console.log('Compression Accepted.');
});

router.route('/check').post(async (req,res) => {
    let scabChain = req.app.get('scabChain');

    const superBlock = req.body.superBlock;
    //Check if IPFS Data has the correct hash
    const uploadedChain = await IpfsExtract(superBlock['hash']);
    console.log('Chain :',uploadedChain);

    const chainSig = crypto
    .createHash('sha256')
    .update(JSON.stringify(uploadedChain))
    .digest('hex');

    if(chainSig === superBlock['nonce']){
        res.json({
            note: 'Hash has matched, compression approved',
            reply: 'PASS'
        });
    }
    else{
        res.json({
            note: 'Hash has NOT matched, compression NOT APPROVED',
            reply: 'FAIL'
        });
    }
});

router.route('/approval').get(async (req,res) => {
    let scabChain = req.app.get('scabChain');

    const { hash, sig } = await scabChain.requestCompressionDetails();
    console.log('IPFS hash: ', hash);
    console.log('Chain Signature: ', sig);
    const lastBlock = scabChain.chain[0];
    const previousBlockHash = lastBlock['hash'];
    const previousDHThash = lastBlock['DHT_Hash'];
    

    const currentDHThash = crypto
    .createHash('sha256')
    .update(JSON.stringify(scabChain.hashTable)+hash).digest("hex");


    const newBlock = scabChain.createNewBlock(
        previousBlockHash,
        hash,
        sig,
        currentDHThash,
        previousDHThash
    );

    const requestPromises = [];

    scabChain.networkNodes.forEach(existingNode => {
        const requestOptions = {
            uri: existingNode + '/compress/check',
            method: 'POST',
            body: {
                superBlock: newBlock
            },
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    let nodeReplies = 0;

    Promise.all(requestPromises)
    .then(data => {
        data.forEach(elem => {
            if(elem['reply'] === 'PASS'){
                nodeReplies++;
            }
        });
        
        if(nodeReplies >= (Math.floor(scabChain.networkNodes.length+1/2))){
            console.log('Majority agreed on block compression...');
            scabChain.receiveCompressed(newBlock);

            //SEND one more request to network for compression the chain

            const reqProms = [];

            scabChain.networkNodes.forEach(existingNode => {

                const reqOpts = {
                    uri: existingNode+'/compress/accept',
                    method: 'POST',
                    body: {
                        superBlock: newBlock
                    },
                    json: true
                };

                reqProms.push(rp(reqOpts));
            });

            Promise.all(reqProms)
            .then(data => {
                console.log("All nodes informed of compression");
            }).catch((error)=>{
                console.log('ERROR :',error);
            });

            res.json({
                note: 'Chain Compressed!',
                superBlock: newBlock
            });

        }
        else{
            console.log('Majority REJECTED block compression...');

            res.json({
                note: 'Chain Compressed DISAPPROVED By Network',
                superBlock: newBlock
            });
        }
    }).catch((error)=>{
        console.log('ERROR :',error);
    });

})

module.exports = router;