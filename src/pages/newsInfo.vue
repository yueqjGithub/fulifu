<template>
    <div class="article"  v-if="article" ref="article">
        <div class="head">
            <h3 class="title" v-text="article.title"></h3>
            <div class="info">
                <span class="time" v-text="article.create_time"></span>
                <span class="source" v-text="article.author"></span>
            </div>
        </div>

        <div :class="$style.content" v-html="article.content">

        </div>
    </div>
</template>

<script>
    import { Toast, Indicator} from 'mint-ui'
    import Article from '@/model/article'
    import api from '@/api/news'
    import bus from '@/lib/bus'
    import {browser,android} from '@/events'

    export default {
        name:'NewsInfo',
        props:[],
        data:function () {
            return {
                article:{},
            }
        },
        computed:{

        },
        filters:{

        },
        methods:{
            getArticle:async function () {
                let id = this.$route.params.id;
                try {
                    let res = await api.getArticleInfo({id: id});
                    let body = res.data;
                    if(body.data===''){
                        return this.$router.replace({name:'404'});
                    }
                    let article = Article.New(body.data);
                    this.article = article;
                    bus.$emit(browser.ChangeTitle,article.title);
                    return article;
                } catch (e) {
                    Toast(e.message);
                }

            }
        },
        created:function () {
            Indicator.open();
            this.getArticle().then(function () {
                Indicator.close();
            });
        },
        updated:function () {
            this.$nextTick(function () {
                let imgs = this.$refs.article.getElementsByTagName('img');
                const data = {
                    index:0,
                    urls:[]
                };
                for (let i =0;i<imgs.length;i++){
                    let url = imgs[i].src;
                    data.urls.push(url);
                    imgs[i].onclick = function (event) {
                        data.index = i;
                        bus.$emit(android.AndroidImgClick,data);
                    }
                }
            })

        }
    }

</script>

<style scoped>
    .article{
        padding: 2%;
    }
    .head .title{
        padding: 0 0 .2rem;
        margin: 0;
        color: #404040;
        font-size: 1.5rem;
    }
    .article .head .info{
        font-size: .8rem;
        margin: 0 0 .6rem;
        color: #888;
        font-weight: 400;
    }
    .article .head .info .source{
        padding-left: .2rem;
    }

</style>
<style module>
    .content img{
        max-width:100%;
        display: block;
        margin: auto;
    }
</style>