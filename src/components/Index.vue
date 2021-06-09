<template>
  <div class="IndexContainer" ref="indexContainer">
    <div style="width:80px;" class="leftContainer">
      <a-menu
        :default-selected-keys="defaultSelectedKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
        style="height: 100%;padding-top: 50px;width: 100%"
        @openChange="getLocationList"
      >
        <a-menu-item key="/index/overview" @click="toPage">
          <a-icon type="desktop"/>
          <span>首页</span>
        </a-menu-item>
        <a-menu-item key="/index/controller" @click="toPage">
          <a-icon type="control"/>
          <span>大棚控制</span>
        </a-menu-item>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="appstore"/><span>管理</span></span>
          <a-menu-item key="/index/deviceManagement" @click="toPage">
            设备管理
          </a-menu-item>
          <a-menu-item key="/index/greenHouseManagement" @click="toPage">
            大棚管理
          </a-menu-item>
          <a-menu-item key="/index/locationManagement" @click="toPage" v-if="userInfo.isAdmin">
            基地管理
          </a-menu-item>
          <a-menu-item key="/index/relayManagement" @click="toPage">
            继电器管理
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="/index/alertSetting" @click="toPage">
          <a-icon type="alert"/>
          <span>报警设置</span>
        </a-menu-item>
        <a-menu-item key="/index/previousDisPlay" @click="toPage">
          <a-icon type="youtube" />
          <span>大屏显示</span>
        </a-menu-item>
        <a-menu-item key="/index/userManagement" @click="toPage" v-if="userInfo.isAdmin">
          <a-icon type="user"/>
          <span>用户管理</span>
        </a-menu-item>
      </a-menu>
    </div>
    <div :style="{width:rightWidth}" class="rightContainer">
      <div class="headerContainer">
        <div class="right" style="right: 50px;">
          <a-dropdown>
                <span>
                   <my-avatar style="margin-right: 20px;margin-top: 5px" :username="userInfo.username"></my-avatar>
                </span>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="logout">注销</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
      <div class="bodyContainer">
        <div style="background-color:#fff;margin:10px 0 0 10px;height: 100%;">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import myAvatar from "./MyAvatar";

export default {
  name: "Index",
  data() {
    return {
      collapsed: true,
      rightWidth: "",
      defaultSelectedKeys: [this.$route.path],
      userInfo: '',
      locationList: ''
    }
  },
  methods: {
    toPage(event) {
      let key = event.key
      if (this.defaultSelectedKeys[0] === key) {
        return
      }
      this.defaultSelectedKeys[0] = key
      this.$router.push({
        path: key
      })
    },
    logout() {
      localStorage.removeItem('air-sensor-token')
      this.$router.push({
        path: '/login'
      })
    },
    initUserInfo() {
      this.userInfo = JSON.parse(decodeURIComponent(escape(window.atob(localStorage.getItem('air-sensor-token').split('.')[1]))));
    },
    getLocationList(event) {
      this.$http.get('/location/getAll/1/8').then(response => {
        this.locationList = response.data.data.locationList
      }, error => {

      })
    }
  },
  mounted() {
    this.rightWidth = this.$refs.indexContainer.clientWidth - 80 + 'px'
    this.initUserInfo()

  },
  components: {
    myAvatar
  }
}
</script>

<style scoped>
.IndexContainer {
  display: flex;
  height: 100%;
  min-width: 1510px;
  min-height: 966px;
}

.IndexContainer .rightContainer {
  background-color: #EDF0F1;
  height: 100%;
}

.IndexContainer .rightContainer .headerContainer {
  background-color: #fff;
  height: 6%;
  position: relative;
}

.IndexContainer .leftContainer {
  height: 100%;
}

.fillContainer {
  width: 100%;
  height: 100%;
}

.left {
  position: absolute;
  left: 0;
}

.bodyContainer {
  height: 92%;
}

.right {
  position: absolute;
  right: 0;
}
</style>
