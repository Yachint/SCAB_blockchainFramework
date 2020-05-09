const axios  = require('axios');

exports.module =  axios.create({
    baseUrl: 'https://json-server-scab.herokuapp.com'
});