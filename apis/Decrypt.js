const crypto = require('crypto');

var decryptStringWithRsaPrivateKey = function(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
    var privateKey = relativeOrAbsolutePathtoPrivateKey
    var buffer = Buffer.from(toDecrypt, "base64");
    //var decrypted = crypto.privateDecrypt(privateKey, buffer);
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey.toString(),
            passphrase: '',
            padding:crypto.constants.RSA_PKCS1_PADDING
        },
        buffer
    )
    return decrypted.toString("utf8");
};

module.exports = decryptStringWithRsaPrivateKey;