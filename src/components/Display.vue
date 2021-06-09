<template>
  <div class="displayContainer">
    <a-row class="headerContainer">
      <div style="padding-top: 40px;padding-left: 40px"><span class="my-font"
                                                              style="  font-size: 20px;font-weight: bold;">{{
          locationName
        }}-{{ greenHouseName }}</span></div>
      <div class="my-font currentTimeContainer">{{ currentTime }}</div>
    </a-row>
    <a-row style="width: 100%;height: 87%;padding: 10px">
      <a-col :span="6" class="boxContainer leftContainer">
        <div class="panel" >
          <deviceStatus style="color: #ffffff!important;"></deviceStatus>
          <div class="panelFooter"></div>
        </div>
        <div class="panel" style="background-color:black;">
          <temperatureHumidityLineChart></temperatureHumidityLineChart>
          <div class="panelFooter"></div>
        </div>
        <div class="panel" style="background-color:black;">
          <co2AndTvoc></co2AndTvoc>
          <div class="panelFooter"></div>
        </div>
      </a-col>
      <a-col :span="12" class="boxContainer">
        <div style="width: 100%;height: 67%">
          <my-map style="padding: 10px" theme="amap://styles/462e9df1a381fd5c5da3af00ced97d5f"></my-map>
        </div>
        <div class="panel" style="height: 30%;width: 97%;margin: 10px;display: flex;background-color:black;">
          <div style="height: 100%;width: 33%">
            <thermometer></thermometer>
          </div>
          <div style="height: 100%;width: 33%">
            <barometer></barometer>
          </div>
          <div style="height: 100%;width: 33%">
            <hygrometer></hygrometer>
          </div>
          <div class="panelFooter"></div>
        </div>
      </a-col>
      <a-col :span="6" class="boxContainer leftContainer">
        <div class="panel" style="height: 44%">
          <device-list></device-list>
          <div class="panelFooter"></div>
        </div>
        <div class="panel" style="height:21%;" ref="weatherContainer">
          <div id="he-plugin-standard"></div>
          <div class="panelFooter"></div>
        </div>
        <div class="panel" style="background-color:black;">
          <illumination></illumination>
          <div class="panelFooter"></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
import thermometer from "./Thermometer"
import co2AndTvoc from "./Co2AndTvoc"
import myMap from "./MyMap"
import barometer from "./Barometer"
import hygrometer from "./Hygrometer"
import illumination from "./Illumination"
import temperatureHumidityLineChart from "./TemperatureHumidityLineChart"
import deviceStatus from "./DeviceStatus";

import deviceList from "./DeviceList"

const PubSub = require('pubsub-js')

export default {
  name: "Display",
  data() {
    return {
      deviceStatusTimer: '',
      currentTime: '',
      timeTimer: '',
      greenHouseName: '',
      greenHouseId: '',
      locationName: '',
      topic: '',
      fullscreen: false,
      oneWeekdays: []
    }
  },
  mounted() {
    this.greenHouseName = this.$route.query.selectedGreenHouseName
    this.greenHouseId = this.$route.query.selectedGreenHouseId
    this.locationName = this.$route.query.selectedLocationName
    this.getDeviceList()
  },
  methods: {
    nextDevice(topic, data) {
      this.getDeviceData(data.deviceId)
      this.getDeviceOnWeekData(data.deviceId)
    },
    getLocation() {
      this.$http.get(`/location/getByGreenHouseId/${this.greenHouseId}`).then(response => {
        if (response.data.status === 2000) {
          let locationList = []
          locationList.push(response.data.data.location)
          PubSub.publish('initMap', locationList)
        }
      }, reason => {

      })
    },
    initTimer() {
      this.currentTime = moment().format("yyyy-MM-DD hh:mm:ss")
      this.timeTimer = setInterval(() => {
        this.currentTime = moment().format("yyyy-MM-DD hh:mm:ss")
      }, 1000)
    },
    getDeviceList() {
      this.$http.get(`/device/getByGreenHouseId/${this.greenHouseId}`).then(response => {
        if (response.data.status === 2000) {
          let deviceList = response.data.data.deviceList
          if (deviceList) {
            if (deviceList.length > 0) {
              PubSub.publish('getDeviceList', deviceList)
              this.getDeviceData(deviceList[0].deviceId)
              this.initOneWeekdays()
              this.getDeviceOnWeekData(deviceList[0].deviceId)
              this.getDeviceStatus()
              this.setDeviceStatusTimer()
              this.getLocation()
              this.initWeather()
              this.initTimer()
              this.topic = PubSub.subscribe('nextDevice', this.nextDevice)
            } else {
              this.$message.info('大棚内没有设备，无法检测！')
              this.$router.push("/index/previousDisPlay")
            }
          }

        }
      }, error => {
      })
    },
    setDeviceStatusTimer() {
      this.deviceStatusTimer = setInterval(() => {
        this.getDeviceStatus()
      }, 180000)
    },
    initOneWeekdays() {
      for (let i = 7; i >= 1; i--) {
        this.oneWeekdays.push(moment().subtract(i, 'days').format('yyyy-MM-DD'))
      }
    },
    getDeviceStatus() {
      this.$http.get(`/device/getStatusByGreenHouseId/${this.greenHouseId}`, this.oneWeekdays).then(response => {
        let deviceInfo = {}
        deviceInfo.alarmCount = response.data.data.deviceStatusVo.alarmCount
        deviceInfo.offlineCount = response.data.data.deviceStatusVo.count - response.data.data.deviceStatusVo.onlineCount
        deviceInfo.normalCount = response.data.data.deviceStatusVo.onlineCount - response.data.data.deviceStatusVo.alarmCount
        PubSub.publish('topic01', deviceInfo)
      }, reason => {
      })
    },
    getDeviceOnWeekData(deviceId) {
      this.$http.post(`/airDataAverage/getByRecodeTimeAndDeviceId/${deviceId}`, this.oneWeekdays).then(response => {
        PubSub.publish('topic04', {days: this.oneWeekdays, data: response.data.data.airDataAverageList})
      }, reason => {
      })
    },
    initWeather() {
      (function (d) {
        var c = d.createElement('link')
        c.rel = 'stylesheet'
        c.href = 'https://widget.heweather.net/standard/static/css/he-standard.css?v=1.4.0'
        var s = d.createElement('script')
        s.src = 'https://widget.heweather.net/standard/static/js/he-standard.js?v=1.4.0'
        var sn = d.getElementsByTagName('script')[0]
        sn.parentNode.insertBefore(c, sn)
        sn.parentNode.insertBefore(s, sn)
      })(document)
      window.WIDGET = {
        "CONFIG": {
          "layout": "1",
          "width": this.$refs.weatherContainer.clientWidth,
          "height": 190,
          "background": "1",
          "dataColor": "FFFFFF",
          "key": "d6c198df3b524792bbcb74212fd21f49"
        }
      }
    },
    getDeviceData(deviceId) {
      this.$http.get(`airData/getLatest/${deviceId}`).then(response => {
        if (response.data.status === 2000) {
          PubSub.publish('getTemperature', response.data.data.airData.temperature)
          PubSub.publish('getHumidity', response.data.data.airData.humidity)
          PubSub.publish('getPressure', response.data.data.airData.pressure)
          PubSub.publish('getCo2AndTvoc', {co2: response.data.data.airData.co2, tvoc: response.data.data.airData.tovc})
          PubSub.publish('getIllumination', response.data.data.airData.illumination)
        }
      }, reason => {
      })
    }
  },
  destroyed() {
    if (this.timeTimer) {
      clearInterval(this.timeTimer)
    }
    if (this.topic) {
      PubSub.unsubscribe(this.topic)
    }
    if (this.deviceStatusTimer) {
      clearInterval(this.deviceStatusTimer)
    }
  },
  components: {
    co2AndTvoc,
    deviceList,
    thermometer,
    myMap,
    barometer,
    hygrometer,
    illumination,
    temperatureHumidityLineChart,
    deviceStatus
  },
  created() {

  },
}
</script>

<style scoped>
@import "../assets/font/font.css";

.currentTimeContainer {
  position: absolute;
  right: 10px;
  top: 33px;
  font-size: 25px;
}

.headerContainer {
  width: 100%;
  height: 9.5%;
  background-image: url("../assets/head_bg.png");
  position: relative;
}

.displayContainer {
  background-image: url('../assets/beijing.png');
  width: 100%;
  height: 1080px;
  min-width: 1510px;
  min-height: 1080px;
}

.displayContainer .boxContainer {
  height: 100%;
}

.panel {
  position: relative;
  /* background-image: url('../assets/line.png');*/
  width: 100%;
  height: 33%;
  margin-bottom: 5px;
}

.panel::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
  z-index: 3;
}

.panel::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
}

.leftContainer {
  height: 300px;
}

.panelFooter {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.panelFooter::before {
  position: absolute;
  bottom: 0;
  left: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
}

.panelFooter::after {
  position: absolute;
  bottom: 0;
  right: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
}


</style>
