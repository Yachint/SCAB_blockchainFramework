const router = require('express').Router();

router.route('/').post((req,res) => {
    let scabChain = req.app.get('scabChain');

    const type = req.body.type;
    const subType = req.body.subType;
    const primaryKey = req.body.primaryKey;
    const change = req.body.change;
    
    scabChain.receive_DHT_updates(type,subType,primaryKey,change);

    res.json({
        note: 'DHT update received!'
    });

    console.log('DHT update received!');
});

module.exports = router;