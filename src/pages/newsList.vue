<template>
    <div class="article-list">
        <div class="news-wrapper" ref="wrapper" :style="{height:wrapperHeight+'px'}">
            <mt-loadmore :autoFill="true" :top-method="loadInit" @top-status-change="handleTopChange" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" ref="loadmore">
                <div class="news-list">
                    <article v-for="(item,index) in list" :key="item.id" class="news-item">
                        <a @click="goPageInfo(index)"  v-if="item.ad_type==1" :class="item.title.includes('游')?'news-a2':''">
                            <div class="news-pic">
                                <img v-lazy="item.title_icon" class="lazyload-image">
                            </div>
                            <div class="news-info" :class="item.type==1||item.title.includes('游')?'order':''">
                                <h3 class="title" :class="item.title.includes('游戏')||item.title.includes('网游')||item.title.includes('手游')?'news-h3-title':''">{{item.title}}</h3>
                                <div class="detail" :style="item.type==1?'text-align:right':''" :class="item.title.includes('游戏')||item.title.includes('网游')||item.title.includes('手游')?'news-detail2':''" v-if="!item.title.includes('游')">
                                    <span class="source">{{item.author}}</span>
                                    <span class="time">{{item.create_time}}</span>
                                </div>
                            </div>
                            <div class="news-detail-other" v-if="item.title.includes('游')">
                                <span class="source">{{item.author}}</span>
                                <span class="time">{{item.create_time}}</span>
                            </div>

                        </a>
                        <a @click="goPageInfo(index)" v-if="item.ad_type==0" :key="item.id"  target="_blank">
                            <div class="news-ad">
                                <img v-lazy="item.banner" class="lazyload-image">
                            </div>
                        </a>
                    </article>
                </div>
                <div slot="top" class="mint-loadmore-top">
                    <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                    <span v-show="topStatus === 'loading'">
                        <mt-spinner type="snake"></mt-spinner>
                    </span>
                </div>
                <div slot="bottom" class="mint-loadmore-bottom">
                    <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                    <span v-show="bottomStatus === 'loading'">
                        <mt-spinner type="fading-circle"></mt-spinner>
                    </span>
                </div>
                <p v-show="loading&&!allLoaded" class="infinite-loading">
                    <mt-spinner type="fading-circle"></mt-spinner>
                    加载中...
                </p>
                <p v-show="allLoaded" class="infinite-loading">
                    没有更多内容了。。。
                </p>
            </mt-loadmore>

        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Toast, Indicator,Spinner,Lazyload,Loadmore,InfiniteScroll} from 'mint-ui'
    import Article from '@/model/article'
    import Advertising from '@/model/advertising'
    import api from '@/api/news'
    import bus from '@/lib/bus'
    import {browser} from '@/events'
    import {android} from '@/events'

    Vue.use(Lazyload);
    Vue.use(InfiniteScroll);
    Vue.component(Loadmore.name,Loadmore);
    Vue.component(Spinner.name, Spinner);
    export default {
        name:'NewsList',
        props:[],
        data:function () {
            return {
                list:[],
                isFirst:true,
                loading:false,
                allLoaded:false,
                wrapperHeight:0,
                topStatus: '',
                bottomStatus: '',
                page:1,
                limit:15,
                last_id:0,
                scrollTop:0,
            }
        },
        methods:{
            scrollEvent:function (e) {
                this.scrollTop = e.target.scrollTop|0;
            },
            loadInit:function () {
                let vm = this;
                this.page =1 ;
                this.last_id = 0;
                this.loadMore(true).then(function () {

                })
            },
            loadMore:function (isTop=false) {
                let vm = this;
                if(!isTop&&!this.isFirst){
                    this.loading=true;
                }
                return api.getArticleList(this.page,this.limit,this.last_id).then(function (res) {
                    let body = res.data;
                    let data = body.data;
                    Indicator.close();
                    if(vm.isFirst){
                        vm.isFirst = false;
                    }
                    if(isTop){
                        vm.list=[];
                    }
                    if(data.length){
                        vm.page++;
                        console.log(data)
                        data.forEach(function (v, i) {
                           if(v.ad_type==0){
                               vm.list.push(Advertising.New(v))
                           }else if(v.ad_type==1){
                               vm.list.push(Article.New(v));
                               vm.last_id = v.id;
                           }
                        });
                        console.log(vm.list)
                        vm.loading = false;
                        vm.allLoaded = false;
                    }else {
                        vm.loading = true;
                        vm.allLoaded = true;
                    }

                    if(isTop){
                        vm.$refs.loadmore.onTopLoaded();
                    }
                }).catch(function (err) {
                    Toast("网络出错，请重试");
                    console.log(err);
                    vm.loading = false;
                })
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            handleTopChange(status) {
                this.topStatus = status;
            },
            goPageInfo:function (index) {
                let item = this.list[index];
                bus.$emit(android.AndroidNewsInfo,item);
//                return this.$router.push({name:'news-info',params:{id:item.id}});
            }

        },
        created:function () {
            Indicator.open();
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
            this.$refs.wrapper.addEventListener('scroll',this.scrollEvent);
        },
        activated:function () {
            bus.$emit(browser.ChangeTitle,'新闻列表');
            this.$refs.wrapper.scrollTop = this.scrollTop;
        }
    }

</script>
<style>
    .article-list{
        width: 100%;
        overflow-x: hidden;
    }
    .article-list .news-wrapper{
        overflow: scroll;
        margin-top: -1px;
    }


    .article-list .news-item .lazyload-image[lazy=loading]{
        width: 100%;
        height: 8rem;
        height: 30vw;
        margin: auto;
        background-color: #c8c8c8;
        background-image: url("../assets/img/img_notloaded.png");
        background-size: auto 50%;
        background-position: center;
        background-repeat: no-repeat;
    }

    .article-list .news-item .lazyload-image[lazy=error]{
        width: 100%;
        height: 8rem;
        height: 30vw;
        margin: auto;
        background-color: #c8c8c8;
        background-image: url("../assets/img/img_break.png");
        background-size: auto 50%;
        background-position: center;
        background-repeat: no-repeat;
    }



    .news-list a{
        padding: .5rem;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items:center;
        -ms-flex-align: center;
        align-items:center;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        text-decoration: none;
    }

    .news-list a .news-info{
        -webkit-box-flex: 2;
        -webkit-flex: 2;
        -ms-flex: 2;
        flex: 2;
        padding-left: .4rem;
        max-height: 6rem;
    }
    .news-list a .news-pic{
        width: 33%;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
    }
    .news-pic img{
        display: block;
        width: 100%;
        margin: 0 auto;
        max-height: 6rem;
        min-height: 6rem;
    }
    .news-item .news-info h3{
        margin: 0;
        color: #333;
        font-weight: 400;
        max-height: 4.2rem;
        height: 4.2rem;
        overflow: hidden;
        line-height: 1.45rem;
        /* font-size: .34rem; */
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        word-break: break-word;
    }
    .news-item .news-info .detail{
        color: #b4b4b4;
        line-height: 1.5rem;
        height: 1.5rem;
        margin-top: .7rem;
        font-size: 0;
        letter-spacing: 0;
        overflow: hidden;
        text-align: left;
    }

    .news-item .news-info .detail span{
        font-size: .8rem;
        margin-right: .4rem;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        padding: 0 .2rem;
    }

    .news-item .news-info .detail .source{
        /*min-width: 3rem;*/
        max-width: 10rem;
        margin-right: .4rem;
        /*text-align: center;*/
        /*padding: 0 .2rem;*/
    }

    .news-item .news-ad{
        width: 100%;
    }
    .news-item .news-ad img{
        max-height: 10rem;
        width: 100%;
    }

    .news-item {
        border-bottom: solid 1px #eee;
        /*height: 5.5rem;*/
    }
    .news-item:first-child {
        border-top: solid 1px #eee;
    }

    .mint-loadmore-bottom span {
        display: inline-block;
        -webkit-transition: .2s linear;
        transition: .2s linear;
        vertical-align: middle
    }
    .mint-loadmore-bottom span.is-rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .mint-loadmore-top span {
        display: inline-block;
        -webkit-transition: .2s linear;
        transition: .2s linear;
        vertical-align: middle
    }
    .mint-loadmore-top span.is-rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .infinite-loading{
        text-align: center;
        height: 40px;
        line-height: 40px;
    }

    .infinite-loading div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
    }

    * {
        padding: 0;
        margin: 0;
        text-decoration: none;
        list-style: none;
        -webkit-tap-highlight-color: transparent;
        font-style: normal;
    }

/*----------------------新增----------------*/
.order{
    order: -1;
    align-self: baseline;
}
.news-detail{
    text-align: left;
}
.news-a2{
    flex-flow: column;
}
.news-detail2{
    color: red;
}
.news-detail-other{
    width: 100%;
    font-size: .8rem;
    color: #b4b4b4;
    padding-right: .8rem;
    text-align:right;
    display: flex;
    margin-top: .4rem;
}
.news-detail-other .source {
    /*margin-right: .6rem;*/
    margin-left: .8rem
}
.news-a2 .news-pic {
    width: 96% !important;
    margin: .2rem auto;
    min-height: 12rem;
    max-height: 8.2rem;
}
.news-a2 img {
    max-height: 12rem;
    min-height: 7.5rem;
}
.news-h3-title {
    height: auto !important;
}
.detail{
    display: flex;
}
.source{
    flex:1;
    text-align: left;
}
.time{
    flex:2;
    text-align: right;
}
/*----------------------新增----------------*/

</style>