const Encrypt = require('../apis/Encrypt');
const Decrypt = require('../apis/Decrypt');
const IPFS_Upload = require('../apis/IPFS_Upload');
const IPFS_Download = require('../apis/IPFS_Download');
const { PUBLIC_KEY, PRIVATE_KEY } = require('../apis/Keys');
const axios = require('axios');

const handleRequest = async (changedState, accAddr) => {
    // const downloadedCrypt = await IPFS_Download(changedState.info);
    // console.log('STEP 1: download crypted :',downloadedCrypt);
    const updateObj = Decrypt(changedState.info,PRIVATE_KEY);
    console.log('STEP 2:  decrypted :',updateObj);
    
    const response = await axios.get('https://json-server-scab.herokuapp.com/sellers?smartContractAdd='+accAddr);
    console.log('STEP 3: ASK json server :',response.data[0]);
    const sellerPub = response.data[0].pubKey;
    
    const convertedObj = JSON.parse(updateObj);
    const newUpdate = {
        timestamp: convertedObj['timestamp'],
        from: convertedObj['from'],
        amount: convertedObj['amount'],
        action: convertedObj['action']
    }

    
    console.log('STEP 4: Construct New Update :',newUpdate);
    const encryptedUpdates = Encrypt(JSON.stringify(newUpdate),sellerPub);
    console.log('STEP 5: Encrypt New Update :',encryptedUpdates);
    // const uploadedUpdates = await IPFS_Upload(encryptedUpdates);
    // console.log('STEP 6: Get IPFS HASH :',uploadedUpdates);
    return encryptedUpdates;

}

module.exports = handleRequest;