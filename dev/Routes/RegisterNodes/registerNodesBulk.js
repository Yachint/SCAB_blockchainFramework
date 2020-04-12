const router = require('express').Router();
const rp = require('request-promise');

router.route('/').post((req,res) => {
    let scabChain = req.app.get('scabChain');

    const allNetworkNodes  = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        if(scabChain.networkNodes.indexOf(networkNodeUrl) === -1 
        && scabChain.currentNodeUrl !== networkNodeUrl){
            scabChain.networkNodes.push(networkNodeUrl);
        }
    });
    res.json({ note: 'Bulk registration successful.'}); 
})


module.exports = router;
