const crypto = require('crypto');

var decryptStringWithRsaPrivateKey = function(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
    var privateKey = relativeOrAbsolutePathtoPrivateKey
    var buffer = Buffer.from(toDecrypt, "base64");
    //var decrypted = crypto.privateDecrypt(privateKey, buffer);
    const decrypted = crypto.privateDecrypt(
        privateKey,
        buffer
    )
    return decrypted.toString("utf8");
};

module.exports = decryptStringWithRsaPrivateKey;