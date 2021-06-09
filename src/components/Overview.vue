<template>
  <div class="overviewContainer" style="background-color:#EDF0F1;height: 100%;">
    <div style="width: 100%;height:50%">
      <my-map style="height: 100%;width: 98%" theme="amap://styles/6c4e5777b93033c0d470cbe197681830"></my-map>
    </div>
    <a-row style="margin-top: 20px;width: 100%;height: 45%">
      <a-col :span="8" style="padding: 10px;background-color:#fff;height: 100%">
        <div style="text-align: center;font-weight: bold">一周内报警次数</div>
        <alarm-bar-chart style="width: 100%;height: 90%"></alarm-bar-chart>
      </a-col>
      <a-col :span="8" style="padding: 10px;background-color:#fff;margin-left: 20px;height: 100%">
        <div style="text-align: center;font-weight: bold;">当前设备运行情况</div>
        <device-status style="width: 100%;height: 90%"></device-status>
      </a-col>
      <a-col :span="7" style="background-color:#fff;margin-left: 20px;height: 100%">
        <a-row style="margin-top: 40px">
          <a-col :span="9" :offset="3">
            <a-statistic title="基地总数" :value="overviewData.locationCount"/>
            <a-statistic title="设备总数" :value="overviewData.deviceCount"/>
            <a-statistic title="报警总次数" :value="overviewData.alarmFrequencyCount"/>
          </a-col>
          <a-col :offset="1" :span="11">
            <a-statistic title="大棚总数" :value="overviewData.locationCount"/>
            <a-statistic title="累计数据总量" :value="overviewData.airDataCount"/>
            <a-statistic title="继电器总数" :value="overviewData.relayCount"/>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import MyMap from "./MyMap";
import DeviceStatus from "./DeviceStatus";
import AlarmBarChart from "./AlarmBarChart";

const moment = require('moment');

const PubSub = require('pubsub-js')

export default {
  name: "Overview",
  data() {
    return {
      oneWeekdays: [],
      overviewData: {
        airDataCount: '',
        alarmCount: '',
        alarmFrequencyCount: '',
        deviceCount: '',
        greenHouseCount: '',
        locationCount: '',
        onlineDeviceCount: '',
        relayCount: ''
      }
    }
  },
  methods: {
    initOneWeekdays() {
      for (let i = 7; i >= 1; i--) {
        this.oneWeekdays.push(moment().subtract(i, 'days').format('yyyy-MM-DD'))
      }
    },
    getDeviceOverview() {
      this.$http.post('/device/getOverviewData', this.oneWeekdays).then(response => {
        this.overviewData.airDataCount = response.data.data.airDataCount
        this.overviewData.alarmCount = response.data.data.alarmCount
        this.overviewData.alarmFrequencyCount = response.data.data.alarmFrequencyCount
        this.overviewData.deviceCount = response.data.data.deviceCount
        this.overviewData.greenHouseCount = response.data.data.greenHouseCount
        this.overviewData.locationCount = response.data.data.locationCount
        this.overviewData.onlineDeviceCount = response.data.data.onlineDeviceCount
        this.overviewData.relayCount = response.data.data.relayCount
        let deviceInfo = {}
        deviceInfo.alarmCount = response.data.data.alarmCount
        deviceInfo.offlineCount = response.data.data.deviceCount - response.data.data.onlineDeviceCount
        deviceInfo.normalCount = response.data.data.onlineDeviceCount - response.data.data.alarmCount
        PubSub.publish('topic01', deviceInfo)
        PubSub.publish('topic02', {days: this.oneWeekdays, data: response.data.data.dateAlarmCountList})
        PubSub.publish('initMap', response.data.data.locationList)
      }, error => {
      })
    }
  },
  mounted() {
    this.initOneWeekdays();
    this.getDeviceOverview()
  },
  components: {AlarmBarChart, DeviceStatus, MyMap}
}
</script>

<style scoped>

</style>
