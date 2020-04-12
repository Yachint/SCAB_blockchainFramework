const router = require('express').Router();
const rp = require('request-promise');

router.route('/').post((req,res) => {
    let scabChain = req.app.get('scabChain');

    const newNodeUrl = req.body.newNodeUrl;

    if(scabChain.networkNodes.indexOf(newNodeUrl) == -1 
    && scabChain.currentNodeUrl !== newNodeUrl){
        scabChain.networkNodes.push(newNodeUrl);
    }

    const reqNodesPromises = [];
    scabChain.networkNodes.forEach(existingNode => {
        //console.log(newNodeUrl);
        const requestOptions = {
            uri: existingNode+'/register-node',
            method: 'POST',
            body: {
                newNodeUrl: newNodeUrl
            },
            json: true
        };
        reqNodesPromises.push(rp(requestOptions));
    });
    
    Promise.all(reqNodesPromises)
    .then(data=>{
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {
                allNetworkNodes: [...scabChain.networkNodes, scabChain.currentNodeUrl]
            },
            json: true
        };

        return rp(bulkRegisterOptions);
    }).then(data => {
        res.json({ note: 'New node registered with network successfully'});
    }).catch((error)=>{
        console.log('ERROR :',error);
    });
});

module.exports = router;
