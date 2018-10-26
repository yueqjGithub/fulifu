<template>
    <div class="container">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" ></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" ></router-view>
    </div>
</template>

<style>
    html, body {
        background-color: #fafafa;
        -webkit-overflow-scrolling: touch;
        user-select: none;
        margin: 0;
        color: #333;
    }

    @media only screen {
        html { font-size: 30px; }
    }
    @media only screen and (max-width: 479px) and (min-width: 321px) {
        html { font-size: 15px; } }
    @media only screen and (max-width: 320px) {
        html { font-size: 13px; }
    }

</style>
<script>
    import '@/assets/font/iconfont.css'

    export default {
        name:"App",
        data:function () {
            return {
                "title":"福利福",
            }
        },
        methods:{
            changeTitle:function (val) {
                document.title = val;
            }
        }
    }
</script>