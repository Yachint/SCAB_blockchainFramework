const crypto = require('crypto');
const blockHasher = require('./hash');
const DHT = require('./DHT');

function blk(){
    this.hashTable = {};
    this.chain = [];
    this.chainSize = this.chain.length;
    this.pendingTransactions = [];
    this.chainSize = this.chain.length;
    this.hashTable = new DHT();
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

    this.hashTable.updateHashTable(this.pendingTransactions);
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    this.chainSize++;

    return newBlock;
};

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