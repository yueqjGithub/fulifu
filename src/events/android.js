import bus from '@/lib/bus'
import tools from '@/lib/tools'

const events = {
    AndroidGo:'android:go',
    AndroidImgClick:'android:img-click',
    AndroidNewsInfo:'android:news-info'
};

bus.$on(events.AndroidGo,function (url) {
    tools.AndroidGo(url);
});

bus.$on(events.AndroidImgClick,function (data) {
    tools.AndroidImgClick(data);
});

bus.$on(events.AndroidNewsInfo,function (data) {
    tools.AndroidNewsInfo(data);
});


export default events;