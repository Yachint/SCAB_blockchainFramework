const template = require('./storeObjectTemplate');
const axios = require('axios');
const rp = require('request-promise');
const _ = require('lodash');
const UserAddon = require('./UserAddon');

const buildTemplate = new template();

function DHT(){
    this.HashTable = {
        inventory: {},
        store: buildTemplate.getStoreTemplate()
    }
    this.sizeOfTable = 0;
};

DHT.prototype.replaceHashTable = function(newDHT){
    this.HashTable = {...newDHT['HashTable']};
}

DHT.prototype.updateWithDetails = function(type,subType,primaryKey,change){
        if(subType=='NONE'){
            this.HashTable[type][primaryKey] = change;
        }
        else{
            console.log('Type: ',type,' -- subType :',subType,' -- key :',primaryKey);
            if(change['delete'] === 'true'){
                _.omit(this.HashTable[type][subType],[primaryKey]);
            }
            else if(this.HashTable[type][subType][primaryKey] === undefined){
                this.HashTable[type][subType][primaryKey] = change;
            }
            else{
                this.HashTable[type][subType][primaryKey] = change;
            }
            
        }
        
}

DHT.prototype.updateHashTable = function(pendingTx,networkNodes){
    pendingTx.map((transaction) => {
        switch(transaction.type){
            case 'Inventory': {
                const {prodId, changedState} = transaction.details;
                this.addToInventory(prodId, changedState, networkNodes);
            }
            case 'Store':{
                console.log('Triggered!');
                this.addToStore(transaction.subType, transaction.details.changedState,networkNodes);
            }
        }
        this.sizeOfTable++;
    });
}

DHT.prototype.addToInventory = function(prodId, newState, networkNodes){
    const target = this.HashTable['inventory'];
    if(target[prodId] == null){
        axios.post('https://jsonscab.el.r.appspot.com/inventory',{prodId: prodId, ...newState}).then((response) => {
            console.log(response.data);
            target[prodId] = {...response.data};
            this.sendUpdatesToNetwork('inventory','NONE',prodId,{...response.data},networkNodes);
        }).catch(function(error){
            console.log(error);
        });
        
    }else{
        const id = target[prodId]['id'];
        axios.patch('https://jsonscab.el.r.appspot.com/inventory/'+id,{prodId: prodId,...newState}).then((response) => {
            console.log(response.data);
            const currentState = target[prodId];
            target[prodId] = {...currentState,...response.data};
            this.sendUpdatesToNetwork('inventory','NONE',prodId,{...response.data},networkNodes);
        }).catch(function(error){
            console.log(error);
        });
    }
};

DHT.prototype.deleteFromInventory = function(prodId){
    delete this.HashTable['inventory'][prodId];
}

DHT.prototype.sendUpdatesToNetwork = function(type, subType, primaryKey, change, networkNodes){
    
    const requestPromises = [];

    networkNodes.forEach(existingNode => {
        const requestOptions = {
            uri: existingNode + '/update-DHT',
            method: 'POST',
            body: {
                type: type,
                subType: subType,
                primaryKey: primaryKey,
                change: change 
            },
            json: true
        }

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises).then(data => {
        console.log("Dispatched DHT updates successfully to network Nodes");
    }).catch((error)=>{
        console.log('ERROR :',error);
    });
}

DHT.prototype.addToStore = function(type, details, networkNodes){
    switch(type){
        case 'item' :{
            const temp = buildTemplate.getItemTemplate();

            if(details['delete'] === 'true'){
                const id = this.HashTable['store']['items'][details.prodId]['id'];
                axios.delete('https://jsonscab.el.r.appspot.com/items/'+id).then((response) => {
                    //console.log(response.data);
                    // _.omit(this.HashTable['store']['items'], [details.prodId]);
                    delete this.HashTable['store']['items'][details.prodId];
                    this.sendUpdatesToNetwork('store','items',details.prodId,{...temp,...response.data},networkNodes);
                }).catch(function(error){
                    console.log(error);
                });
            }else{
                
                if(this.HashTable['store']['items'][details.prodId]=== undefined){
                    console.log('Trying PUT REQUEST..');
                    axios.post('https://jsonscab.el.r.appspot.com/items',{...details}).then((response) => {
                        console.log(response.data);
                        this.HashTable['store']['items'][details.prodId] = {...temp,...response.data};
                        this.sendUpdatesToNetwork('store','items',details.prodId,{...temp,...response.data},networkNodes);
                    }).catch(function(error){
                        console.log(error);
                    });
                }
                else{
                    const id = this.HashTable['store']['items'][details.prodId]['id'];
                    console.log('Trying PATCH REQUEST..');
                    axios.patch('https://jsonscab.el.r.appspot.com/items/'+id,{...details}).then((response) => {
                        console.log(response.data);
                        this.HashTable['store']['items'][details.prodId] = {...temp,...response.data};
                        this.sendUpdatesToNetwork('store','items',details.prodId,{...temp,...response.data},networkNodes);
                    }).catch(function(error){
                        console.log(error);
                    });
                }
            }
            break;
        }
        case 'seller':{
            const temp = buildTemplate.getSellerTemplate();
            
            if(this.HashTable['store']['sellers'][details.smartContractAdd]=== undefined){
                console.log('Trying PUT REQUEST..');
                axios.post('https://jsonscab.el.r.appspot.com/sellers',{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['sellers'][details.smartContractAdd] = {...temp,...response.data};
                    this.sendUpdatesToNetwork('store','sellers',details.smartContractAdd,{...temp,...response.data},networkNodes);
                }).catch(function(error){
                    console.log(error);
                });
            }
            else{
                const id = this.HashTable['store']['sellers'][details.smartContractAdd]['id'];
                console.log('Trying PATCH REQUEST..');
                axios.patch('https://jsonscab.el.r.appspot.com/sellers/'+id,{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['sellers'][details.smartContractAdd] = {...temp,...response.data};
                    this.sendUpdatesToNetwork('store','sellers',details.smartContractAdd,{...temp,...response.data},networkNodes);
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
                
                UserAddon(details, details.smartContractAdd).then((updHash) => {
                    const newDetails = {
                        smartContractAdd: details.smartContractAdd,
                        updateHash: [updHash]
                    }
                    
                    axios.post('https://jsonscab.el.r.appspot.com/users',{...newDetails}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['users'][details.smartContractAdd] = {...temp,...response.data};
                    this.sendUpdatesToNetwork('store','users',details.smartContractAdd,{...temp,...response.data},networkNodes);
                    }).catch(function(error){
                        console.log(error);
                    });
                    
                });
                
            }
            else{
                const id = this.HashTable['store']['users'][details.smartContractAdd]['id'];
                const hashArray = this.HashTable['store']['users'][details.smartContractAdd]['updateHash'];
                console.log('Trying PATCH REQUEST..');

                if(details['delete'] === 'true'){
                    const id = this.HashTable['store']['users'][details.smartContractAdd]['id'];
                    axios.delete('https://jsonscab.el.r.appspot.com/users/'+id).then((response) => {
                        delete this.HashTable['store']['users'][details.smartContractAdd];
                        this.sendUpdatesToNetwork('store','users',details.smartContractAdd,{...temp,...response.data},networkNodes);
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    UserAddon(details, details.smartContractAdd).then((updHash) => {
                        console.log(updHash);
                        const newDetails = {
                            smartContractAdd: details.smartContractAdd,
                            updateHash: _.concat(hashArray, updHash)
                        }
                        
                        axios.patch('https://jsonscab.el.r.appspot.com/users/'+id,{...newDetails}).then((response) => {
                        console.log(response.data);
                        this.HashTable['store']['users'][details.smartContractAdd] = {...temp,...response.data};
                        this.sendUpdatesToNetwork('store','users',details.smartContractAdd,{...temp,...response.data},networkNodes);
                        }).catch(function(error){
                            console.log(error);
                        });
                        
                    });
                }
                
            }
            break;
        }
        case 'order':{
            const temp = buildTemplate.getOrderTemplate();
            
            if(this.HashTable['store']['orders'][details.orderHash]=== undefined){
                console.log('Trying PUT REQUEST..');
                axios.post('https://jsonscab.el.r.appspot.com/orders',{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['orders'][details.orderHash] = {...temp,...response.data};
                    this.sendUpdatesToNetwork('store','orders',details.orderHash,{...temp,...response.data},networkNodes);
                }).catch(function(error){
                    console.log(error);
                });
            }
            else{
                const id = this.HashTable['store']['orders'][details.orderHash]['id'];
                console.log('Trying PATCH REQUEST..');
                axios.patch('https://jsonscab.el.r.appspot.com/orders/'+id,{...details}).then((response) => {
                    console.log(response.data);
                    this.HashTable['store']['orders'][details.orderHash] = {...temp,...response.data};
                    this.sendUpdatesToNetwork('store','orders',details.orderHash,{...temp,...response.data},networkNodes);
                }).catch(function(error){
                    console.log(error);
                }); 
            }
            break;
        }
    }
};

module.exports = DHT;