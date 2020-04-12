const router = require('express').Router();
const rp = require('request-promise');

router.route('/').post((req,res) => {
    let scabChain = req.app.get('scabChain');

    const newNodeUrl = req.body.newNodeUrl;
    if(scabChain.networkNodes.indexOf(newNodeUrl) === -1 
        && scabChain.currentNodeUrl !== newNodeUrl){
        scabChain.networkNodes.push(newNodeUrl);
    }
    res.json({ note: 'New node registered successfully.'});
})

module.exports = router;