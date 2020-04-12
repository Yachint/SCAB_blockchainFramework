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
const IpfsExtract = require('./IPFS_ExtractTest');
//-----ROUTES----------------------------------------
const displayChain = require('./Routes/displayChain');
const transactions = require('./Routes/Transactions/transactions');
const mine = require('./Routes/mine');
const receiveNewBlock = require('./Routes/receiveNewBlock');
const regAndBdcast = require('./Routes/RegisterNodes/registerAndBroadcastNode');
const registerNode = require('./Routes/RegisterNodes/registerNode');
const registerNodesBulk = require('./Routes/RegisterNodes/registerNodesBulk');
const compress = require('./Routes/Compress/compress');
const consensus = require('./Routes/Consensus/consensus');
const updateDHT = require('./Routes/update-DHT');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies

app.set('scabChain',scabChain);

app.get('/', function(req,res){
    res.send('Welcome to Scab Chain v0.001');
});

app.use('/blockchain', displayChain);
app.use('/transaction', transactions);

app.use('/compress', compress);

// app.post('/compress/accept', function(req, res){

// })

// app.post('/compress/check',async function(req, res){
    
// });

// app.get('/compress/approval', async function(req,res){

// });

app.use('/mine',mine);

// app.get('/mine', function(req, res){
    
// });

app.use('/receive-new-block',receiveNewBlock);

// app.post('/receive-new-block', function(req,res){
// });

app.use('/update-DHT', updateDHT);

// app.post('/update-DHT', function(req,res){

// });

app.use('/consensus', consensus);

// app.get('/consensus', function(req, res){
   
// });

app.use('/register-and-broadcast-node',regAndBdcast);

// app.post('/register-and-broadcast-node', function(req,res){


// });

app.use('/register-node',registerNode);

// app.post('/register-node', function(req,res){

// });

// app.post('/register-nodes-bulk', function(req,res){

// });

app.use('/register-nodes-bulk',registerNodesBulk);

app.listen(port, function(){
    console.log('listening on port '+port+' ...');
});



