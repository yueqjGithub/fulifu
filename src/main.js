import Vue from 'vue'
import App from '@/components/app.vue'
import router from '@/router'
import '@/events'
import bus from '@/lib/bus'
import Promise from 'promise'

window.Promise = Promise;
const app = new Vue({
    el:'#app',
    components:{App},
    template:'<App/>',
    router,
    data:function () {
        return {
            message:'Hello world'
        }
    }
});

router.beforeEach(function (to, from, next) {
    let url  =to.fullPath;
    return next();

    if(to.meta.keepAlive==true){
        next();
    }else {
        bus.$emit('android:go',url);
        next(false);
    }
});





