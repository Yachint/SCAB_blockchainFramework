var express = require('express');
const process = require('process');
var app = express();
const blockchain = require('./main');
const uuid = require('uuid');
const nodeAddress = uuid.v1().split('-').join("");
var bodyParser = require('body-parser');
const scabChain = new blockchain();
const port = 8080;
var cors = require('cors');
app.use(cors());
const axios = require('axios');


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
const DecryptEngine = require('./Routes/DecryptEngine/decryptFile');

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
app.use('/decrypt',DecryptEngine);

app.listen(port, function(){
    console.log('listening on port '+port+' ...');
    console.log('Node Address: ',nodeAddress);
    // timer();
    // routineMiner();
});

const callFramework = () => {
    console.log("GET Called !",new Date);
    axios.get('https://json-server-scab.herokuapp.com/items').then(() => {
        axios.get('https://scab-blockchain.herokuapp.com/').then(() => {
            axios.get('https://scab-clone.herokuapp.com/blockchain').then(() => {
                console.log('All called!');
            })
        })
    })
    
    
    setTimeout(timer, 100000);
}

const routineMiner = () => {
    const numOfTx = scabChain.pendingTransactions.length;
    if(scabChain.pendingTransactions.length > 0){
        const url = scabChain.currentNodeUrl+'/mine';
        axios.get(url).then(() => {
            console.log('Transactions processed: ', numOfTx)
        });
    } else {
        console.log('No updates: ', numOfTx);
    }

    setTimeout(mineTimer, 100);
}

const mineTimer = () => {
    setTimeout(routineMiner, 2500);
}

const timer = () => {
    setTimeout(callFramework, 1400000);
}
