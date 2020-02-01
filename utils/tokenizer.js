const uuidv1 = require('uuid/v1');
const CryptoJS = require("crypto-js");
const {appconfig} = require('../appconfig');
const tokenizer = {
    generateToken: () => {
        let randomVal = uuidv1().toString();
        let API_KEY = CryptoJS.HmacSHA1(randomVal, appconfig.SECRET_KEY);
        return API_KEY.toString().toUpperCase();
    },
    verifyToken: (token) => {

    }
};
module.exports = tokenizer;