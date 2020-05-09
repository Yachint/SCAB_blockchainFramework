var express = require('express');
const process = require('process');
var app = express();
const blockchain = require('./main');
const uuid = require('uuid');
const nodeAddress = uuid.v1().split('-').join("");
var bodyParser = require('body-parser');
const scabChain = new blockchain();
const port = process.argv[2];
var cors = require('cors')
app.use(cors());


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
const searchChain = require('./Routes/Search/searchChain');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies

app.set('scabChain',scabChain);

app.get('/', function(req,res){
    res.send('Welcome to Scab Chain v0.001');
});

app.use('/blockchain', displayChain);
app.use('/transaction', transactions);
app.use('/compress', compress);
app.use('/mine',mine);
app.use('/receive-new-block',receiveNewBlock);
app.use('/update-DHT', updateDHT);
app.use('/consensus', consensus);
app.use('/register-and-broadcast-node',regAndBdcast);
app.use('/register-node',registerNode);
app.use('/register-nodes-bulk',registerNodesBulk);
app.use('/search',searchChain);

app.listen(port, function(){
    console.log('listening on port '+port+' ...');
});



