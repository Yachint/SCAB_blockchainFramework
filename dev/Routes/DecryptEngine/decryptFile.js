const decrypt = require('../../../apis/Decrypt');
const IPFS_Download = require('../../../apis/IPFS_Download');
const generateKeys = require('../../../apis/GenerateKeys');
const router = require('express').Router();

router.route('/').post((req,res) => {
    const encrypted = req.body.enc;
    const keyHash = req.body.key;

    IPFS_Download(keyHash).then((key) => {
        const obj = JSON.parse(decrypt(encrypted,key));

        res.json({
            obj: obj
        });
    });

});

router.route('/reverseDecrypt').post((req, res) =>{
    const encrypted = req.body.enc;
    const keyHash = req.body.key;

    const decryptedLink = decrypt(encrypted, keyHash);

    IPFS_Download(decryptedLink).then((data) => {
        const obj = JSON.parse(data);

        res.json({
            obj: obj
        })
    })
})

router.route('/generate').get((req, res) => {

    generateKeys().then((obj) => {
        res.json({
            pubKey: obj.pubKey,
            privKey: obj.privKey
        });
    });
});

module.exports = router;