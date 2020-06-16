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
import CardTitle from "@/components/cardTitle/CardTitle";
import { Tree } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/css/reset.scss'
import Mixin from './mixins';
import 'element-ui/lib/theme-chalk/index.css';
import { authDirective } from './utils/directives'
// element
import { Tree as eleTree,Button as eleButton } from 'element-ui';
Vue.component('ElTree', eleTree);
Vue.component('ElButton', eleButton);
Vue.use(authDirective)
Vue.mixin(Mixin);
Vue.config.productionTip = false

Vue.use(ViewUI);
Vue.use(Tree);
Vue.component('ArcgisMap',ArcgisMap)
Vue.component('MySideBar',MySideBar)
Vue.component('MyFooter',MyFooter)
Vue.component('CardTitle',CardTitle)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
