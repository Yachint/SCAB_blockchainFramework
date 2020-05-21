const decrypt = require('../../../apis/Decrypt');
const IPFS_Download = require('../../../apis/IPFS_Download');
const router = require('express').Router();

router.route('/').get((req,res) => {
    const encrypted = req.body.enc;
    const keyHash = req.body.key;

    IPFS_Download(keyHash).then((key) => {
        const obj = JSON.parse(decrypt(encrypted,key));

        res.json({
            obj: obj
        })
    })

})

module.exports = router;