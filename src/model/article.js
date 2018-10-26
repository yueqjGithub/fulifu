import BaseObject from './baseObject'

/**
 * 文章类
 * @property {Number} id 文章ID
 * @property {String} title 标题
 * @property {String} title_icon 标题图片
 * @property {Number} type 文件类型 1政治新闻 2段子  3 娱乐
 * @property {String} author 著作人
 * @property {String} content 文章内容
 * @property {String} synopsis 简介
 * @property {Number} status 状态 1 正常 0 删除
 * @property {String} create_time 创建时间
 * @property {Number} ad_type 广告过滤类型，默认为1
 */
class Article extends BaseObject{
    id=0;
    title='';
    title_icon='';
    type=0;
    author='';
    content='';
    synopsis='';
    status=0;
    create_time='';

    ad_type=1;

    get url(){
        return `/news-info/${this.id}`;
    }
}

export default Article
