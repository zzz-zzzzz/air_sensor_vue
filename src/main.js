import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import vuescroll from 'vuescroll'
import request from "./utils/request";

Vue.use(vuescroll);
Vue.prototype.$http = request;
Vue.config.productionTip = false
Vue.use(Antd);


new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
