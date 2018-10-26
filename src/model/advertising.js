import BaseObject from './baseObject'

/**
 * 广告类
 * @property {Number} id
 * @property {String} title 标题
 * @property {String} banner 展示图片
 * @property {Number} position 1-新闻 2-游戏
 * @property {Number} type 1-html页面 2-app内应用
 * @property {String} url_scheme    链接规则
 * @property {Number} weight    随机排列权重
 * @property {Number} created_time  创建时间
 * @property {Number} ad_type 广告过滤类型，默认为0
 */
class Advertising extends BaseObject{
    id=0;
    title='';
    banner='';
    position=0;
    type=0;
    url_scheme='';
    weight=0;
    created_time=0;

    ad_type=0;

    get url(){
        return this.url_scheme;
    }

}

export default Advertising;