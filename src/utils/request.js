import Axios from "axios";
import router from '../router'
import {message} from 'ant-design-vue'

const service = Axios.create({
  /* baseURL: "http://localhost:8081"//请求地址*/
  baseURL: "http://39.104.188.192/api"//请求地址
})

service.interceptors.request.use(config => {
  config.headers.token = localStorage.getItem("air-sensor-token")
  return config;
}, error => {
  Promise.reject(error);
})

service.interceptors.response.use(response => {
  if (response.data.status === 4002) {
    message.info('登录过期请重新登录！');
    router.push({path: "/login"})
    //添加 4001 的之类的东西
  }
  if(response.data.status === 4001){
    message.info('权限问题请重新登录！');
    router.push({path: "/login"})
  }


  return response;
}, error => {
  return Promise.resolve(error.response);
})

router.beforeEach((to, from, next) => {
  if (to.meta.loginRequire) {
    let token = localStorage.getItem('air-sensor-token')
    if (token) {
      next()
    } else {
      message.info('请先登录！');
      router.push({path: '/login'})
    }
  } else {
    next()
  }
})

export default service
