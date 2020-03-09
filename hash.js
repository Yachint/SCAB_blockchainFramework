var crypto = require('crypto');

function giveHash(currBlkData, previousBlkHash){
    
    var hashThis = ""+JSON.stringify(currBlkData)+previousBlkHash;
    var check = 0;
    var nonce = 0;

    while(check==0){

        mHash = crypto.createHash('sha256')
                .update(hashThis+nonce)
                .digest("hex");
        
        if(mHash.charAt(0)==0 && mHash.charAt(1)==0){
            console.log('Hash Accepted! :',mHash);
            console.log('At Nonce:',nonce);
            check = 1;
        }

        else{
            nonce = nonce+1;
        }
    }

    return mHash;
}

module.exports = giveHash;