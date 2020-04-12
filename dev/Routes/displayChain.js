const router = require('express').Router();

router.route('/').get((req,res)=>{
    res.send(req.app.get('scabChain'));
});

module.exports = router;