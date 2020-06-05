import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import './assets/iconfont/iconfont.css';
import './assets/css/style.scss';
import './assets/css/variable.scss';
import 'view-design/dist/styles/iview.css';
// iview覆盖样式
import * as _ from 'lodash'
import ArcgisMap from '@/components/arcgis/ArcgisMap'
import MyFooter from "@/components/MyFooter";
import MySideBar from "@/components/mySideBar";
import { Tree } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/css/reset.scss'
import Mixin from './mixins';
import { authDirective } from './utils/directives'

Vue.use(authDirective)
Vue.mixin(Mixin);
Vue.config.productionTip = false

Vue.use(ViewUI);
Vue.use(Tree);
Vue.component('ArcgisMap',ArcgisMap)
Vue.component('MySideBar',MySideBar)
Vue.component('MyFooter',MyFooter)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
