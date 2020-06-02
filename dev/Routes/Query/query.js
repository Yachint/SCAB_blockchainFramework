const router = require('express').Router();
const _ = require('lodash');

router.route('/orders').post((req,res)=> {
    let scabChain = req.app.get('scabChain');
    const type = req.body.type;
    const address = req.body.address;

    const hashTable = scabChain.getHashTable();
    const orders = hashTable['store']['orders'];

    const ordersArray = Object.values(orders);
    let filteredArray;
    if(type === 'buyer'){
        filteredArray = _.dropWhile(ordersArray, function(o) { return o.buyer !== address});
    } else {
        filteredArray = _.dropWhile(ordersArray, function(o) { return o.seller !== address});
    }    

    res.json({
        result: filteredArray
    });

});

module.exports = router;