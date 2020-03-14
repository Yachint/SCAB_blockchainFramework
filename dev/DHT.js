const template = require('./storeObjectTemplate');
const axios = require('axios');

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
            
            if(this.HashTable['store']['items'][details.prodId]=== undefined){
                console.log('Trying PUT REQUEST..');
                axios.post('http://localhost:3001/items',{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['items'][details.prodId] = {...temp,...response.data};
                }).catch(function(error){
                    console.log(error);
                });
            }
            else{
                const id = this.HashTable['store']['items'][details.prodId]['id'];
                console.log('Trying PATCH REQUEST..');
                axios.patch('http://localhost:3001/items/'+id,{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['items'][details.prodId] = {...temp,...response.data};
                }).catch(function(error){
                    console.log(error);
                });
            }
            break;
        }
        case 'seller':{
            const temp = buildTemplate.getSellerTemplate();
            
            if(this.HashTable['store']['sellers'][details.smartContractAdd]=== undefined){
                console.log('Trying PUT REQUEST..');
                axios.post('http://localhost:3001/sellers',{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['sellers'][details.smartContractAdd] = {...temp,...response.data};
                }).catch(function(error){
                    console.log(error);
                });
            }
            else{
                const id = this.HashTable['store']['sellers'][details.smartContractAdd]['id'];
                console.log('Trying PATCH REQUEST..');
                axios.patch('http://localhost:3001/sellers/'+id,{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['sellers'][details.smartContractAdd] = {...temp,...response.data};
                }).catch(function(error){
                    console.log(error);
                });
            }
            break;
        }
        case 'user':{
            const temp = buildTemplate.getUserTemplate();
            
            if(this.HashTable['store']['users'][details.smartContractAdd]=== undefined){
                console.log('Trying PUT REQUEST..');
                axios.post('http://localhost:3001/users',{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['users'][details.smartContractAdd] = {...temp,...response.data};
                }).catch(function(error){
                    console.log(error);
                });
            }
            else{
                const id = this.HashTable['store']['users'][details.smartContractAdd]['id'];
                console.log('Trying PATCH REQUEST..');
                axios.patch('http://localhost:3001/users/'+id,{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['users'][details.smartContractAdd] = {...temp,...response.data};
                }).catch(function(error){
                    console.log(error);
                });
            }
            break;
        }
        case 'order':{
            const temp = buildTemplate.getOrderTemplate();
            
            if(this.HashTable['store']['orders'][details.orderHash]=== undefined){
                console.log('Trying PUT REQUEST..');
                axios.post('http://localhost:3001/orders',{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['orders'][details.orderHash] = {...temp,...response.data};
                }).catch(function(error){
                    console.log(error);
                });
            }
            else{
                const id = this.HashTable['store']['orders'][details.orderHash]['id'];
                console.log('Trying PATCH REQUEST..');
                axios.patch('http://localhost:3001/orders/'+id,{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['orders'][details.orderHash] = {...temp,...response.data};
                }).catch(function(error){
                    console.log(error);
                });
            }
            break;
        }
    }
};

module.exports = DHT;