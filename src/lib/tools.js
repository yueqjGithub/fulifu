const config = require('../config');

let getBaseUrl = function () {
    let url = window.location.origin+window.location.pathname;
    return url;
};
exports.getBaseUrl = getBaseUrl;

/**
 * Android 跳转url
 * @param url
 * @constructor
 */
exports.AndroidGo = function (url) {
    let ab_url = config.host+"#"+url;
    try {
        window.Android_Method.goNewsDetail(ab_url);
    } catch (e) {

    }
};

/**
 * Android 图片点击事件
 * @param {object} data
 * @constructor
 */
exports.AndroidImgClick = function (data) {
    try {
        let val = JSON.stringify(data);
        window.Android_Method.imgClick(val);
    } catch (e) {

    }
};

/**
 * Android 跳转文章详情页
 * @param {Article|Advertising} data
 * @constructor
 */
exports.AndroidNewsInfo = function (data) {
    let node = {
        id:data.id,
        ad_type:data.ad_type,
        url:data.url
    };
    if(data.ad_type!=0){
        node.url = getBaseUrl()+'#'+data.url;
    }
    let val = JSON.stringify(node);
    try {
        window.Android_Method.androidNewsInfo(val);
    } catch (e){

    }
};