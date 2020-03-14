const axios  = require('axios');

exports.module =  axios.create({
    baseUrl: 'http://localhost:3001'
});