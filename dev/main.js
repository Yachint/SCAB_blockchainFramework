const crypto = require('crypto');
const blockHasher = require('./hash');

function blk(){
    this.hashTable = {};
    this.chain = [];
    this.chainSize = this.chain.length;
    this.pendingTransactions = [];
    this.chainSize = this.chain.length;
    // this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    this.createNewBlock(100,'0');
};

blk.prototype.addToPendingTx = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
};

blk.prototype.createNewBlock = function(previousBlockhash, givenHash){
    const newBlock = {
        index: this.chain.length+1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        hash: givenHash,
        previousBlockhash : previousBlockhash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);
    this.chainSize++;

    return newBlock;
};

blk.prototype.getLastBlock = function(){
    return this.chain[this.chainSize-1];
};

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

    if(changedState.isAlive === false){
        delete this.hashTable[_orderHash];
    }
    this.hashTable[_orderHash] = {...changedState};

    return newTransaction;
};

const createBlobHash = (state) => {
    var stateToString = JSON.stringify(state);
    return crypto.createHash('sha256').update(stateToString).digest('hex');
};

const createTxHash = (_orderHash, senderPub, changedState) =>{
    var infoBlock = ""+_orderHash+senderPub+JSON.stringify(changedState);
    return crypto.createHash('sha256').update(infoBlock).digest('hex');
};

module.exports = blk;

