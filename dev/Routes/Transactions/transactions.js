const router = require('express').Router();
// const hash = require('./hash');
const rp = require('request-promise');

router.route('/').post((req,res) => {
    let scabChain = req.app.get('scabChain');
    const txObj = scabChain
    .createNewTransaction(req.body.orderId
    ,req.body.senderPub, 
    req.body.changedState);
    const blkIndex = scabChain.addToPendingTx(txObj);
    res.json({ note : 'Transaction will be added in block :'+blkIndex});
});

router.route('/inventory/receive').post((req,res) => {
    let scabChain = req.app.get('scabChain');
    const newTransaction = req.body;
    const blkIndex = scabChain.addToPendingTx(newTransaction);
    res.json({ note: 'Transaction will be added in block'+blkIndex});
});

router.route('/store/receive').post((req, res) => {
    let scabChain = req.app.get('scabChain');
    const newTransaction = req.body;
    console.log("Recieved :",newTransaction);
    const blkIndex = scabChain.addToPendingTx(newTransaction);
    res.json({ note: 'Transaction will be added in block'+blkIndex});
});

router.route('/inventory/broadcast').post((req, res) => {
    let scabChain = req.app.get('scabChain');
    const txObj = scabChain
                  .createNewInventoryTx(req.body.prodId,
                    req.body.changedState);
    scabChain.addToPendingTx(txObj);

    const requestPromises = [];
    scabChain.networkNodes.forEach(existingNode => {
        //console.log(existingNode);
        const requestOptions = {
            uri: existingNode+'/transaction/inventory/receive',
            method: 'POST',
            body: txObj,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Transaction created and broadcasted successfully' });
    });
});

router.route('/store/broadcast').post((req,res) => {
    let scabChain = req.app.get('scabChain');
    const txObj = scabChain.createNewStoreTx(req.body.typeOfStore,req.body.changedState);
    scabChain.addToPendingTx(txObj);

    const requestPromises = [];
    scabChain.networkNodes.forEach(existingNode => {
        const requestOptions = {
            uri: existingNode+'/transaction/store/receive',
            method: 'POST',
            body: txObj,
            json: true
        };

    requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Transaction created and broadcasted successfully' });
    });
});

module.exports = router;