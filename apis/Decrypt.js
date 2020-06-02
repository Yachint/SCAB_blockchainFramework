const crypto = require('crypto');

const decrypt = (toDecrypt, relativeOrAbsolutePathtoPrivateKey) => {

    return new Promise((resolve, reject) => {
        try{
            var privateKey = relativeOrAbsolutePathtoPrivateKey
            var buffer = Buffer.from(toDecrypt, "base64");
            //var decrypted = crypto.privateDecrypt(privateKey, buffer);
            const decrypted = crypto.privateDecrypt(
                {
                    key: privateKey.toString(),
                    passphrase: '',
                },
                buffer,
            );
            console.log(decrypted.toString("utf8"))
            resolve(JSON.parse(decrypted.toString("utf8")));

        } catch(err) {
            reject(err);
        }
    })   
}
module.exports = decrypt;