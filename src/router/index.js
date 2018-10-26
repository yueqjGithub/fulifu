import Vue from 'vue'
import VueRouter from 'vue-router'
import bus from '@/lib/bus'

import NotFound from '@/pages/404.vue'
import NewsList from '@/pages/newsList.vue'
import NewsInfo from '@/pages/newsInfo.vue'

Vue.use(VueRouter);

const routes = [
    {
        path:'/news-list',
        component:NewsList,
        alias:['/'],
        meta:{keepAlive:true}
    },
    {
        name:'news-info',
        path:'/news-info/:id',
        component:NewsInfo,
        meta:{keepAlive:false}
    },
    {
        path:'/404',
        name:'404',
        component:NotFound
    },
    {
        path:'*',
        redirect:{name:'404'}
    }
];

const router = new VueRouter({
    routes,
    mode:'hash'
});


export default router;