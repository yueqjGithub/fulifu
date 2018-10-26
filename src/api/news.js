const api_url = require('../config/api');
const axios = require('axios');

const request = axios.create({
    // headers:{"access-token":""}
    timeout:5000,
    transformResponse: [function (data) {
        // 这里提前处理返回的数据
        if(typeof data == 'string')
        {
            return JSON.parse(data);
        }
        return data;
    }],
});

/**
 * 获取新闻详情
 * @param {Object} params
 */
exports.getArticleInfo = function (params) {
    let id = params.id;
    return request.post(api_url.getArticleInfo,{id:id});
};

/**
 * 获取新闻列表
 * @param {Number} page 页数
 * @param {Number} limit    每页条数
 * @param {Number} last_id  最后的文章ID
 * @param {Number} type 新闻类型 1政治新闻 2段子  3 娱乐
 * @returns {*|PromiseLike<vuejs.HttpResponse>|AxiosPromise<any>}
 */
exports.getArticleList = function (page=1,limit=20,last_id=0,type=0) {
    let params = {
        page:page,
        limit:limit,
        last_id:last_id,
        type:type
    };
    return request.post(api_url.getArticleList,params);
};