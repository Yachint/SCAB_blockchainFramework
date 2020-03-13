
function TemplateProvider(){

};

TemplateProvider.prototype.getStoreTemplate= function(){
    return {
        items: {},
        sellers: {},
        users: {},
        orders:{}
    };
};

TemplateProvider.prototype.getSellerTemplate = function(){
    return {
        smartContractAdd: null,
        name: null,
        description: {},
        sellerSince: null,
        rating: 0
    };
};

TemplateProvider.prototype.getItemTemplate= function(){
    return { 
        prodId: null,
        name: null,
        img: "",
        rating: 0,
        description:{},
        price: 0,
        quantity: 0
    };
};

TemplateProvider.prototype.getUserTemplate= function(){
    return {
        userOrders: {},
        name: null,
        email: null,
        number: 0,
    };
};

TemplateProvider.prototype.getOrderTemplate= function(){
    return {
        orderHash: null,
        orderId: null,
        deliveryAddress: null,
        sellerConAddress: null,
        invoice: null,
        status: null,
    }
}

module.exports = TemplateProvider;