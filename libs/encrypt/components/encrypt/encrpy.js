
/**
 * 加密数据
 * @param data 待加密的字符串
 * @returns 加密后的数据
 */
var aesEncrypt=function(data,key) {
    var AES_KEY = CryptoJS.enc.Utf8.parse(key);
    var sendData = CryptoJS.enc.Utf8.parse(data);
    var encrypted = CryptoJS.AES.encrypt(sendData, AES_KEY,{mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

///**
// * 解密数据
// * @param {type} data BASE64的数据
// * @returns {undefined}
// */
//var aesDecrypt = function(data) {
//    //var data = CryptoJS.enc.Utf8.parse(data);
//    ////解密的是基于BASE64的数据，此处data是BASE64数据
//    //var decrypted = CryptoJS.AES.decrypt(data, key, {iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Iso10126});
//    //return decrypted.toString(CryptoJS.enc.Utf8);
//};