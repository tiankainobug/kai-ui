import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vLoading } from './components/loading'
import './styles/theme.css'

const app = createApp(App)
// 注册全局 v-loading 指令:v-loading="true" / v-loading="'加载中'"
app.directive('loading', vLoading)
app.use(router).mount('#app')
