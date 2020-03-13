const template = require('./storeObjectTemplate');
const buildTemplate = new template();

function DHT(){
    this.HashTable = {
        inventory: {},
        store: buildTemplate.getStoreTemplate()
    }
    this.sizeOfTable = 0;
};

DHT.prototype.updateHashTable = function(pendingTx){
    pendingTx.map((transaction) => {
        switch(transaction.type){
            case 'Inventory': {
                const {prodId, changedState} = transaction.details;
                const contractAddress = changedState.contractAddress;
                this.addToInventory(contractAddress, prodId, changedState);
            }
            case 'Store':{
                this.addToStore(transaction.subType, transaction.details.changedState);
            }
        }
        this.sizeOfTable++;
    });
}

DHT.prototype.addToInventory = function(contractAddress, prodId, newState){
    const target = this.HashTable['inventory'];
    if(target[contractAddress] == null){
        target[contractAddress] = {[prodId] : { productId: prodId, state: newState }};
    }else{
        const currentState = target[contractAddress][prodId];
        currentState = {...currentState, state: newState};
    }
};

DHT.prototype.deleteFromInventory = function(contractAddress, prodId){
    delete this.HashTable['inventory'][contractAddress][prodId];
}

DHT.prototype.addToStore = function(type, details){
    switch(type){
        case 'item' :{
            const temp = buildTemplate.getItemTemplate();
            this.HashTable['store']['items'][details.prodId] = {...temp,...details};
            break;
        }
        case 'seller':{
            const temp = buildTemplate.getSellerTemplate();
            this.HashTable['store']['sellers'][details.smartContractAdd] = {...temp,...details};
            break;
        }
        case 'user':{
            const temp = buildTemplate.getUserTemplate();
            this.HashTable['store']['items'][details.userId] = {...temp,...details};
            break;
        }
        case 'order':{
            const temp = buildTemplate.getOrderTemplate();
            this.HashTable['store']['items'][details.orderHash] = {...temp,...details};
            break;
        }
    }
};

module.exports = DHT;