const crypto = require('crypto');

var encryptStringWithRsaPublicKey = function(toEncrypt, relativeOrAbsolutePathToPublicKey) {
    var publicKey = relativeOrAbsolutePathToPublicKey
    var buffer = Buffer.from(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

module.exports = encryptStringWithRsaPublicKey;