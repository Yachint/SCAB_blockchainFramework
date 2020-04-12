const router = require('express').Router();

router.route('/').post((req,res) => {
    let scabChain = req.app.get('scabChain');
    const newBlock = req.body.newBlock;
    console.log(newBlock);

    const lastBlock = scabChain.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockhash;
    const correctIndex = lastBlock.index+1 === newBlock['index'];
    

    if(correctHash && correctIndex) {
        console.log('Correct Block!');
        scabChain.receiveUpdate(newBlock);
        res.json({
            note : 'New block received and accepted.',
            reply: 'PASS',
            newBlock: newBlock
        });
    } else { 
        console.log('BAD Block! Hash :',lastBlock.hash,' -- NewHash :',newBlock.previousBlockHash);
        res.json({
            note: 'New block rejected.',
            reply: 'FAIL',
            newBlock: newBlock
        });
    }

});

module.exports = router;
