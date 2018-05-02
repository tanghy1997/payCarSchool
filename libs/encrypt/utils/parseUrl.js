/**
 * Created by small on 2017/6/30.
 */
function GetRequest() {
    var url = decodeURI(location.search);
    // var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);//字符串分割，存入对象
        }
    }
    return theRequest;
}