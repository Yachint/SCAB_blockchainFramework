const Encrypt = require('../apis/Encrypt');
const Decrypt = require('../apis/Decrypt');
const IPFS_Upload = require('../apis/IPFS_Upload');
const IPFS_Download = require('../apis/IPFS_Download');
const { PRIVATE_KEY } = require('../apis/Keys');
const axios = require('axios');

const handleOrders = async (changedState) => {

    const orderHash = await Decrypt(changedState.info,PRIVATE_KEY);
    console.log('STEP 1:  Decrypted Hash :',orderHash);

    const orderObj = JSON.parse(await IPFS_Download(orderHash));
    console.log('STEP 2: download Object :',orderObj);

    const responseSeller = await axios.get('https://json-server-scab.herokuapp.com/sellers?smartContractAdd='+changedState.seller);
    console.log('STEP 3: ASK json server for seller key :',responseSeller.data[0]);
    const sellerPub = responseSeller.data[0].pubKey;

    const responseBuyer = await axios.get('https://json-server-scab.herokuapp.com/sellers?smartContractAdd='+changedState.buyer);
    console.log('STEP 4: ASK json server for buyer key :',responseBuyer.data[0]);
    const buyerPub = responseBuyer.data[0].pubKey;

    const newUpdate = {
        timestamp: orderObj['timestamp'],
        orderId: orderObj['orderId'],
        prodId: orderObj['prodId'],
        name: orderObj['name'],
        description: orderObj['description'],
        toBuyPrice: orderObj['toBuyPrice'],
        toBuyQuantity: orderObj['toBuyQuantity'],
        JSON_id: orderObj['id'],
        buyer: orderObj['buyer'],
        seller: orderObj['seller'],
    }

    console.log('STEP 5: Construct New Update :', newUpdate);

    const uploadedHash = await IPFS_Upload(JSON.stringify(newUpdate));
    console.log('STEP 6: Upload to Ipfs :', uploadedHash);

    const encryptedUpdatesSeller = Encrypt(uploadedHash,sellerPub);
    console.log('STEP 7: Encrypt New Update with seller key :', encryptedUpdatesSeller);

    const encryptedUpdatesBuyer = Encrypt(uploadedHash,buyerPub);
    console.log('STEP 8: Encrypt New Update with buyer key :', encryptedUpdatesBuyer);
    
    return {
        buyerUpdate: encryptedUpdatesBuyer,
        sellerUpdate: encryptedUpdatesSeller
    }
}

module.exports = handleOrders;