

import './utils/rem.js'
import 'vant/lib/index.css';
import './assets/base.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import idbPlugin from './utils/billsDB.js';
const app = createApp(App)

app.use(createPinia()).use(router).use(idbPlugin)


app.mount('#app')


// document.body.addEventListener('touchmove', function (e) {
//   e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
// }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
