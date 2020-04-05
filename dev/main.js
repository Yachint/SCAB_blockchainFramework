const crypto = require('crypto');
const DHT = require('./DHT');
const uuid = require('uuid');
const currentNodeUrl = process.argv[3];
const _ = require('lodash');
const IpfsClient = require('./IPFS_Test');

function blk(){
    this.hashTable = {};
    this.chain = [];
    this.chainSize = this.chain.length;
    this.pendingTransactions = [];
    this.chainSize = this.chain.length;
    this.hashTable = new DHT();
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    this.receiveUpdate(this.createNewBlock(100,'0','0','0x1','0x0'));
};

blk.prototype.addToPendingTx = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
};

blk.prototype.createNewBlock = function(previousBlockhash, givenHash, givenNonce, givenStateHash, prevStateHash){
    const newBlock = {
        index: this.chain.length+1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        hash: givenHash,
        nonce: givenNonce,
        previousBlockhash: previousBlockhash,
        DHT_Hash: givenStateHash,
        DHT_PrevHash: prevStateHash
    };

    return newBlock;
};

blk.prototype.invokeHashTableUpdate = function(){
    this.hashTable.updateHashTable(this.pendingTransactions,this.networkNodes);
}

blk.prototype.receiveCompressed = function(superBlock){
    this.chain = _.dropRight(this.chain,this.chain.length-1);
    this.chainSize = 1;
    this.chain.push(superBlock);
    this.chainSize++;
}

blk.prototype.receiveUpdate = function(newBlock){
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    this.chainSize++;
}

blk.prototype.receive_DHT_updates = function(type,subType,primaryKey,change){
    this.hashTable.updateWithDetails(type,subType,primaryKey,change);
}

blk.prototype.getLastBlock = function(){
    return this.chain[this.chainSize-1];
};

// blk.prototype.viewHashTable = function(){
//     return this.hashTable;
// }

blk.prototype.createNewTransaction = function(orderId, senderPub, changedState){

    var _newHash = createBlobHash(changedState);
    var _orderHash = crypto.createHash('sha256').update(orderId+senderPub).digest('hex');

    const newTransaction = {
        txHash: createTxHash(_orderHash, senderPub, changedState),
        orderHash: _orderHash,
        senderPublicKey: senderPub,
        oldStateHash: this.hashTable[_orderHash] === null? _newHash : this.hashTable[_orderHash],
        changedState : {...changedState},
        stateHash : _newHash
    }

    return newTransaction;
};

blk.prototype.createNewInventoryTx = function(prodId, changedState){
    const newTransaction = {
        type: 'Inventory',
        transactionid: uuid.v1().split('-').join(""),
        hash: crypto
             .createHash('sha256')
             .update(''+prodId+JSON.stringify(changedState))
             .digest('hex'),
        details: {
            prodId,
            changedState
        }
    }

    return newTransaction;
}

blk.prototype.createNewStoreTx = function(typeOfStore, changedState){
    const newTransaction = {
        type: 'Store',
        subType: typeOfStore,
        transactionid: uuid.v1().split('-').join(""),
        hash: crypto
             .createHash('sha256')
             .update(''+typeOfStore+JSON.stringify(changedState))
             .digest('hex'),
        details: {
            changedState
        }
    }

    return newTransaction;
}

// blk.prototype.compressChain = async function(superBlock){

//     const chainSig = crypto
//     .createHash('sha256')
//     .update(JSON.stringify(_.drop(this.chain)))
//     .digest('hex');
//     const chainToCompress = _.drop(this.chain);
//     const IPFS_hash = await IpfsClient(chainToCompress);
//     this.chain = _.dropRight(this.chain,this.chain.length-1);
//     this.chainSize = 1;
//     return {hash: IPFS_hash, sig: chainSig};

// }

blk.prototype.requestCompressionDetails = async function(){
    const chainSig = crypto
    .createHash('sha256')
    .update(JSON.stringify(_.drop(this.chain)))
    .digest('hex');
    const chainToCompress = _.drop(this.chain);
    const IPFS_hash = await IpfsClient(chainToCompress);
    return {hash: IPFS_hash, sig: chainSig};
}

blk.prototype.chainIsValid = function(blockchain){
    let validChain = true;

    for( var i = 1; i < blockchain.length; i++ ){
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i-1];
        const hashInput = JSON.stringify({
            transactions: currentBlock['transactions'],
            index: currentBlock['index']
        })+previousBlock['hash']+currentBlock['nonce'];
         
        const blockHash = crypto.createHash('sha256').update(hashInput).digest('hex');

        if(currentBlock['DHT_PrevHash'] !== previousBlock['DHT_Hash']){
            validChain = false;
            console.log('Node :',blockchain.currentNodeUrl,' - Block #',currentBlock['index'],' : FAILED -> DHT Hash Test');
        }

        if(blockHash.substring(0,4) !== '0000') {
            validChain = false;
            console.log('Node :',blockchain.currentNodeUrl,' - Block #',currentBlock['index'],' : FAILED -> Hash Test');
        }
        
        if(currentBlock['previousBlockhash'] !== previousBlock['hash']){
            validChain = false;
            console.log('Node :',blockchain.currentNodeUrl,' - Block #',currentBlock['index'],' : FAILED -> Concurrent Block Test');
        }
    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === '0';
    const correctPrevBlkHash = genesisBlock['previousBlockhash'] === 100;
    const correctHash = genesisBlock['hash'] === '0';
    const correctTxCount = genesisBlock['transactions'].length === 0;
    const correctDHTprev = genesisBlock['DHT_PrevHash'] === '0x0';
    const correctDHTcurr = genesisBlock['DHT_Hash'] ==='0x1';

    if(!correctNonce 
        || !correctPrevBlkHash 
        || !correctHash
        || !correctTxCount
        || !correctDHTprev
        || !correctDHTcurr){
            validChain = false;
            console.log('Node :',blockchain.currentNodeUrl,' : FAILED -> Genesis Block Test');
            console.log(correctNonce,' ',correctPrevBlkHash,' ',correctHash, ' ',correctTxCount, ' ', correctDHTprev, ' ', correctDHTcurr);
        }

    if(validChain) console.log('PASSED - All tests!');
    return validChain;
}

const createBlobHash = (state) => {
    var stateToString = JSON.stringify(state);
    return crypto.createHash('sha256').update(stateToString).digest('hex');
};

const createTxHash = (_orderHash, senderPub, changedState) =>{
    var infoBlock = ""+_orderHash+senderPub+JSON.stringify(changedState);
    return crypto.createHash('sha256').update(infoBlock).digest('hex');
};

// blk.prototype.updateHashTable = function(){
//     this.pendingTransactions.map((transaction) => {
//         if(transaction.changedState.isAlive === false){
//             delete this.hashTable[transaction.orderHash];
//         }
//         else{
//             this.hashTable[transaction.orderHash] = {...transaction.changedState};
//         }
//     });
// };

module.exports = blk;