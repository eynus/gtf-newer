import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import './assets/iconfont/iconfont.css';
import './style.scss';
import 'view-design/dist/styles/iview.css';
// iview覆盖样式
import './assets/css/reset.css'
import { Tree,Input } from 'ant-design-vue';
import Mixin from './mixins';
Vue.mixin(Mixin);
Vue.config.productionTip = false

Vue.use(ViewUI);
Vue.use(Tree,Input);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
