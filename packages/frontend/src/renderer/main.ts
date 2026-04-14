import { createApp } from 'vue'
import naive from 'naive-ui'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

import './assets/style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(naive)
app.use(router)
app.mount('#app')
