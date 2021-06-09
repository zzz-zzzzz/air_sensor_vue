import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Index from "../components/Index"
import NotFound from "../components/NotFound";
import UserManagement from "../components/UserManagement";
import Overview from "../components/Overview";
import DeviceManagement from "../components/DeviceManagement";
import GreenHouseManagement from "../components/GreenHouseManagement";
import LocationManagement from "../components/LocationManagement"
import RelayManagement from "../components/RelayManagement";
import Controller from "../components/Controller";
import AlarmSetting from "../components/AlarmSetting";
import Display from "../components/Display";
import PreviousDisplay from "../components/PreviousDisplay";


Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/index/overview'},
    {path: '/display', name: 'Display', component: Display},
    {
      path: '/index',
      name: 'Index',
      component: Index,
      meta: {
        loginRequire: true
      },
      children: [
        {
          path: 'overview',
          name: 'Overview',
          component: Overview,
          meta: {
            loginRequire: true
          }
        },
        {
          path: 'userManagement',
          name: 'UserManagement',
          component: UserManagement,
          meta: {
            loginRequire: true
          }
        },
        {
          path: 'alertSetting',
          name: 'AlertSetting',
          component: AlarmSetting,
          meta: {
            loginRequire: true
          }
        },
        {
          path: 'deviceManagement',
          name: 'DeviceManagement',
          component: DeviceManagement,
          meta: {
            loginRequire: true
          }
        },
        {
          path: 'greenHouseManagement',
          name: 'GreenHouseManagement',
          component: GreenHouseManagement,
          meta: {
            loginRequire: true
          }
        },
        {
          path: 'locationManagement',
          name: 'LocationManagement',
          component: LocationManagement,
          meta: {
            loginRequire: true
          }
        },
        {
          path: 'relayManagement',
          name: 'RelayManagement',
          component: RelayManagement,
          meta: {
            loginRequire: true
          }
        },
        {
          path: 'controller',
          name: 'Controller',
          component: Controller,
          meta: {
            loginRequire: true
          }
        },
        {
          path: 'previousDisPlay',
          name: 'PreviousDisPlay',
          component: PreviousDisplay,
          meta: {
            loginRequire: true
          }
        },
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {path: "/404", name: "notFound", component: NotFound, meta: {loginRequire: false}},
    {path: "*", redirect: "/404"}
  ]
})
