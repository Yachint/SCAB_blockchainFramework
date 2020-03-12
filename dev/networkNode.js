var express = require('express');
const process = require('process');
const hash = require('./hash');
var app = express();
const blockchain = require('./main');
// const uuid = require('uuid');
// const nodeAddress = uuid().split('-').join("");
var bodyParser = require('body-parser');
const scabChain = new blockchain();
const rp = require('request-promise');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies

app.get('/', function(req,res){
    res.send('Welcome to Scab Chain v0.001');
});

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

app.get('/mine', function(req, res){
    const lastBlock = scabChain.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: scabChain.pendingTransactions,
        index: lastBlock['index']+1
    }

    const blockHash = hash(currentBlockData, previousBlockHash);
    const newBlock = scabChain.createNewBlock(previousBlockHash,blockHash);

    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
})

app.listen(3005, function(){
    console.log('listening on port '+3005+' ...');
});



