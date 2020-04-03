var express = require('express');
const crypto = require('crypto');
const process = require('process');
const hash = require('./hash');
var app = express();
const blockchain = require('./main');
const uuid = require('uuid');
const nodeAddress = uuid.v1().split('-').join("");
var bodyParser = require('body-parser');
const scabChain = new blockchain();
const rp = require('request-promise');
const port = process.argv[2];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies

app.get('/', function(req,res){
    res.send('Welcome to Scab Chain v0.001');
});

app.get('/hashTable',function(req,res){
    res.send(scabChain.hashTable);
})

app.get('/blockchain',function(req,res){
    res.send(scabChain);
});

app.post('/transaction', function(req, res){
    const txObj = scabChain
                .createNewTransaction(req.body.orderId
                ,req.body.senderPub, 
                req.body.changedState);
    const blkIndex = scabChain.addToPendingTx(txObj);
    res.json({ note : 'Transaction will be added in block :'+blkIndex});
});

app.post('/transaction/inventory/receive', function(req,res){
    const newTransaction = req.body;
    const blkIndex = scabChain.addToPendingTx(newTransaction);
    res.json({ note: 'Transaction will be added in block'+blkIndex});
});

app.post('/transaction/store/receive', function(req,res){
    const newTransaction = req.body;
    console.log("Recieved :",newTransaction);
    const blkIndex = scabChain.addToPendingTx(newTransaction);
    res.json({ note: 'Transaction will be added in block'+blkIndex});
});

app.post('/transaction/inventory/broadcast', function(req, res){
    const txObj = scabChain
                  .createNewInventoryTx(req.body.prodId,
                    req.body.changedState);
    scabChain.addToPendingTx(txObj);

    const requestPromises = [];
    scabChain.networkNodes.forEach(existingNode => {
        //console.log(existingNode);
        const requestOptions = {
            uri: existingNode+'/transaction/inventory/receive',
            method: 'POST',
            body: txObj,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Transaction created and broadcasted successfully' });
    });
    
});


app.post('/transaction/store/broadcast', function(req, res){
    const txObj = scabChain
                  .createNewStoreTx(req.body.typeOfStore,
                    req.body.changedState);
    scabChain.addToPendingTx(txObj);

    const requestPromises = [];
    scabChain.networkNodes.forEach(existingNode => {
        const requestOptions = {
            uri: existingNode+'/transaction/store/receive',
            method: 'POST',
            body: txObj,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Transaction created and broadcasted successfully' });
    });
    
})

app.get('/mine', function(req, res){
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
            console.log(elem['reply']);
            if(elem['reply']=== 'PASS'){
                nodeReplies++;
            }
        });

        if(nodeReplies >= (scabChain.networkNodes.length+1)/2){
            scabChain.receiveUpdate(newBlock);
            scabChain.invokeHashTableUpdate();
            console.log("Block was approved by Network, Adding to chain... ");
        }else{
            console.log("Block was rejected by Network.");
            console.log("IN :",nodeReplies," --Total/2 :",(scabChain.networkNodes.length+1)/2);
        }
        res.json({
            note: "New block mined & broadcasted successfully",
            block: newBlock
        });
    });

});

app.post('/receive-new-block', function(req,res){
    const newBlock = req.body.newBlock;
    console.log(newBlock);

    const lastBlock = scabChain.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockhash;
    const correctIndex = lastBlock.index+1 === newBlock['index'];
    

    if(correctHash && correctIndex) {
        console.log('Correct Block!');
        scabChain.receiveUpdate(newBlock);
        res.json({
            note : 'New block received and accepted.',
            reply: 'PASS',
            newBlock: newBlock
        });
    } else { 
        console.log('BAD Block! Hash :',lastBlock.hash,' -- NewHash :',newBlock.previousBlockHash);
        res.json({
            note: 'New block rejected.',
            reply: 'FAIL',
            newBlock: newBlock
        });
    }
});

app.post('/update-DHT', function(req,res){
    const type = req.body.type;
    const subType = req.body.subType;
    const primaryKey = req.body.primaryKey;
    const change = req.body.change;
    
    scabChain.receive_DHT_updates(type,subType,primaryKey,change);

    res.json({
        note: 'DHT update received!'
    });

    console.log('DHT update received!');

});

app.get('/consensus', function(req, res){
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


app.post('/register-and-broadcast-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl;

    if(scabChain.networkNodes.indexOf(newNodeUrl) == -1 
    && scabChain.currentNodeUrl !== newNodeUrl){
        scabChain.networkNodes.push(newNodeUrl);
    }

    const reqNodesPromises = [];
    scabChain.networkNodes.forEach(existingNode => {
        //console.log(newNodeUrl);
        const requestOptions = {
            uri: existingNode+'/register-node',
            method: 'POST',
            body: {
                newNodeUrl: newNodeUrl
            },
            json: true
        };
        reqNodesPromises.push(rp(requestOptions));
    });
    
    Promise.all(reqNodesPromises)
    .then(data=>{
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {
                allNetworkNodes: [...scabChain.networkNodes, scabChain.currentNodeUrl]
            },
            json: true
        };

        return rp(bulkRegisterOptions);
    }).then(data => {
        res.json({ note: 'New node registered with network successfully'});
    })


});

app.post('/register-node', function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    if(scabChain.networkNodes.indexOf(newNodeUrl) === -1 
        && scabChain.currentNodeUrl !== newNodeUrl){
        scabChain.networkNodes.push(newNodeUrl);
    }
    res.json({ note: 'New node registered successfully.'});
});

app.post('/register-nodes-bulk', function(req,res){
    const allNetworkNodes  = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        if(scabChain.networkNodes.indexOf(networkNodeUrl) === -1 
        && scabChain.currentNodeUrl !== networkNodeUrl){
            scabChain.networkNodes.push(networkNodeUrl);
        }
    });
    res.json({ note: 'Bulk registration successful.'}); 
});

app.listen(port, function(){
    console.log('listening on port '+port+' ...');
});



