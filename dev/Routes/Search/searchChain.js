const router = require('express').Router();

router.route('/block/:blockHash').get((req,res) => {
    let scabChain = req.app.get('scabChain');

    const blockHash = req.params.blockHash;
    const correctBlock = scabChain.getBlock(blockHash);
    res.json({
        block: correctBlock
    })
});

router.route('/transaction/:id').get((req,res) => {
    let scabChain = req.app.get('scabChain');

    const transactionId = req.params.id;
    const transactionData = scabChain.getTransaction(transactionId);
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    });
    
});

router.route('/address/:address').get((req,res) => {

});

module.exports = router;