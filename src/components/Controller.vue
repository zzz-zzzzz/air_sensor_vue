<template>
  <div style="width: 100%;height:100%;">
    <div v-if="!selectFinish">
      <a-row>
        <a-col :span="6" :offset="9" style="margin-top: 120px">
          <a-select style="width: 100%" placeholder="请选择基地" @select="selectLocation" v-model="selectedLocationId">
            <a-select-option v-for="location in locationList" :value="location.id" :key="location.id"
                             :data-name="location.name"
            >
              {{ location.name }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6" :offset="9" style="margin-top: 20px">
          <a-select style="width: 100%" :disabled="greenHouseSelectDisable" placeholder="请选择仓库"
                    v-model="selectedGreenHouseId"
                    @select="selectGreenHouse">
            <a-select-option v-for="greenHouse in greenHouseList" :value="greenHouse.id" :key="greenHouse.id"
                             :data-name="greenHouse.name"
            >
              {{ greenHouse.name }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6" :offset="9" style="margin-top: 20px">
          <a-button type="primary" :disabled="buttonDisable" @click="nextStep">确认</a-button>
        </a-col>
      </a-row>
    </div>
    <div v-if="selectFinish" style="width: 100%;height: 100%">
      <a-row style="height: 5% ;border-bottom: 1px solid #E8E8E8; margin-bottom: 20px">
        <a-col :span="6" style="margin-top: 12px;margin-left: 20px">
          <a-breadcrumb>
            <a-breadcrumb-item><span style="font-weight: bold;color: black"
                                     @click="previousStep">{{ selectedLocationName }}</span>
            </a-breadcrumb-item>
            <a-breadcrumb-item><span style="font-weight: bold;color: black">{{ selectedGreenHouseName }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </a-col>
      </a-row>
      <a-row style="height: 90%">
        <a-col :span="5"
               style="height: 100%;padding: 15px;border: 1px solid #EBEDF0;border-radius: 10px;margin-left: 20px">
          <div style="width: 100%;text-align: center;margin-bottom: 10px"><span style="font-weight: bold;">设备列表</span>
          </div>
          <vue-scroll :ops="ops" style="height: 550px">
            <div
              style="" class="deviceItem" v-for="(device,index) in deviceList"
              :class="selectedDevice.id===device.id?'active':''"
              @click="switchDevice(device)">
              <span style="font-weight: bold">{{ device.name }}</span></div>
          </vue-scroll>
        </a-col>
        <a-col :span="18" style="margin-left: 20px;height: 100%">
          <a-row style="height: 17%">
            <a-row style="border: 1px solid #EBEDF0;border-radius: 10px;padding: 20px">
              <div
                style="border-bottom: 1px solid #EBEDF0;padding-bottom: 5px;display: flex;justify-content: space-between"><span
                style="font-weight: bold;">实时数据</span><a style="margin-top: -3px">上传时间：{{ airData.createTime }}</a>
              </div>
              <a-row style="padding-top: 10px">
                <a-col :span="4">
                  <a-statistic title="温度" :value="airData.temperature" style="margin-right: 50px">
                    <template #suffix>
                      <span class="iconfont icon-yidongduan-"></span>
                    </template>
                  </a-statistic>
                </a-col>
                <a-col :span="4">
                  <a-statistic title="湿度" :value="airData.humidity" class="demo-class">
                    <template #suffix>
                      <span class="iconfont icon-baifenhao"></span>
                    </template>
                  </a-statistic>
                </a-col>
                <a-col :span="4">
                  <a-statistic title="光照度" :value="airData.illumination" class="demo-class">
                    <template #suffix>
                      Lux
                    </template>
                  </a-statistic>
                </a-col>
                <a-col :span="4">
                  <a-statistic title="CO2浓度" :value="airData.co2" class="demo-class">
                    <template #suffix>
                      <span class="iconfont icon-PPM " style="font-size: 20px"></span>
                    </template>
                  </a-statistic>
                </a-col>
                <a-col :span="4">
                  <a-statistic title="压强" :value="airData.pressure" class="demo-class">
                    <template #suffix>
                      <span class="iconfont icon-PA" style="font-size: 20px"></span>
                    </template>
                  </a-statistic>
                </a-col>
                <a-col :span="4">
                  <a-statistic title="TVOC浓度" :value="airData.tovc" class="demo-class">
                    <template #suffix>
                      <span class="iconfont icon-PPM " style="font-size: 20px"></span>
                    </template>
                  </a-statistic>
                </a-col>
              </a-row>
            </a-row>
          </a-row>
          <a-row style="margin-top: 10px;height: 81.5%">
            <a-col :span="8" style="padding: 20px;border: 1px solid #EBEDF0;border-radius: 10px;height: 100%">
              <div style="border-bottom: 1px solid #EBEDF0;padding-bottom: 5px;height:5%"><span
                style="font-weight: bold">继电器控制面板</span></div>
              <vue-scroll :ops="ops" style="height: 81.5%">
                <div
                  class="relayItem" v-for="relay in relayList">
                  <span style="font-weight: lighter">{{ relay.name }}</span>
                  <a-switch v-model="relay.isOpen" @change="openOrCloseRelay" :data-relay-id="relay.id"></a-switch>
                </div>
              </vue-scroll>
            </a-col>
            <a-col :span="15" style="margin-left: 10px;height: 100%">
              <a-row style="border:1px solid #EBEDF0;border-radius: 10px;padding: 20px;height: 50%">
                <chart01 style="width: 100%;height: 100%"></chart01>
              </a-row>
              <a-row style="border:1px solid #EBEDF0;border-radius: 10px;padding: 20px;margin-top: 10px;height: 40%">
                <div style="border-bottom: 1px solid #EBEDF0;padding-bottom: 5px;"><span
                  style="font-weight: bold">设备信息</span></div>
                <div style="margin-top: 10px">
                  <div><span
                    style="font-weight: lighter">设备编号</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{
                      selectedDevice.id
                    }}</span>
                  </div>
                  <div style="margin-top: 5px"><span style="font-weight: lighter">设备标识</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{
                      selectedDevice.deviceId
                    }}</span>
                  </div>
                  <div style="margin-top: 5px"><span style="font-weight: lighter">设备电压</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{
                      airData.batteryVoltage
                    }} V</span>
                  </div>
                  <div style="margin-top: 5px"><span style="font-weight: lighter">设备状态</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{
                      deviceStatus
                    }}</span>
                  </div>
                </div>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import chart01 from "./TemperatureHumidityLineChart";

const moment = require('moment');
export default {
  name: "Controller",
  components: {chart01},
  data() {
    return {
      timer: '',
      relayList: [],
      oneWeekdays: [],
      deviceStatus: '',
      selectedLocationId: undefined,
      airData: {
        temperature: '',
        pressure: '',
        humidity: '',
        tovc: '',
        illumination: '',
        batteryVoltage: '',
        createTime: ''
      },
      selectedDevice: {},
      deviceList: [],
      locationList: [],
      greenHouseList: [],
      greenHouseSelectDisable: true,
      buttonDisable: true,
      selectedGreenHouseId: undefined,
      selectFinish: false,
      selectedGreenHouseName: '',
      selectedLocationName: '',
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {
          background: 'transparent'
        }
      }
    }
  },
  methods: {
    previousStep() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.selectFinish = false
      this.buttonDisable = true
      this.selectedGreenHouseId = undefined
      this.selectedGreenHouseName = undefined
      this.selectedLocationName = undefined
      this.selectedLocationId = undefined
      this.greenHouseSelectDisable = true
      this.airData = {
        temperature: '',
        pressure: '',
        humidity: '',
        tovc: '',
        illumination: '',
        batteryVoltage: '',
        createTime: ''
      }
    },
    openOrCloseRelay(value, event) {
      let relayId = event.target.dataset.relayId
      this.$http.get(`/relay/sendInstruction/${relayId}/${value ? 1 : 0}`).then(response => {
        if (response.data.status === 2000) {
          this.getRelays()
        }
      }, error => {
      })
    },
    getRelays() {
      this.$http.get(`/relay/getByGreenHouseId/${this.selectedGreenHouseId}`).then(response => {
        this.relayList = response.data.data.relayList
      }, error => {
      })
    },
    initOneWeekdays() {
      for (let i = 7; i >= 1; i--) {
        this.oneWeekdays.push(moment().subtract(i, 'days').format('yyyy-MM-DD'))
      }
    },
    switchDevice(device) {
      if (this.selectedDevice !== device) {
        this.selectedDevice = device
        this.getCurrentData()
      }
    },
    getSevenDaysAverageData() {
      this.$http.post(`/airDataAverage/getByRecodeTimeAndDeviceId/${this.selectedDevice.deviceId}`, this.oneWeekdays).then(response => {
        PubSub.publish('topic04', {days: this.oneWeekdays, data: response.data.data.airDataAverageList})
      }, error => {
      })
    },
    getAirData() {
      this.$http.get(`/airData/getLatest/${this.selectedDevice.deviceId}`).then(response => {
        let airData = response.data.data.airData;
        if (airData.temperature !== undefined) {
          this.airData.temperature = Number(airData.temperature).toFixed(2);
        }
        if (airData.pressure) {
          this.airData.pressure = Number(airData.pressure).toFixed(2);
        }
        if (airData.humidity) {
          this.airData.humidity = Number(airData.humidity).toFixed(2);
        }
        if (airData.tovc) {
          this.airData.tovc = Number(airData.tovc).toFixed(2);
        }
        if (airData.illumination) {
          this.airData.illumination = Number(airData.tovc).toFixed(2);
        }
        if (airData.co2) {
          this.airData.co2 = Number(airData.co2).toFixed(2);
        }
        if (airData.batteryVoltage) {
          this.airData.batteryVoltage = Number(airData.batteryVoltage).toFixed(2);
        }
        this.airData.createTime = airData.createTime
      }, error => {
      })
    },
    getCurrentData() {
      this.getAirData()
      this.getDeviceStatus()
      this.getSevenDaysAverageData()
    },
    getDeviceStatus() {
      this.$http.get(`/device/getStatus/${this.selectedDevice.id}`).then(response => {
        if (response.data.data.status === 0) {
          this.deviceStatus = '正常'
        } else if (response.data.data.status === 1) {
          this.deviceStatus = '离线'
        } else if (response.data.data.status === 2) {
          this.deviceStatus = '报警'
        }
      }, error => {
      })
    },
    nextStep() {
      this.getDeviceList(this.selectedGreenHouseId)
    },
    getDeviceList: async function (greenHouseId) {
      await this.$http.get(`/device/getByGreenHouseId/${greenHouseId}`).then(response => {
        let deviceList = response.data.data.deviceList;
        if (deviceList === undefined || deviceList === null || deviceList.length <= 0) {
          this.$message.info("当前大棚设备数为0无法进行控制")
          return false
        } else {
          this.deviceList = deviceList
          this.selectedDevice = this.deviceList[0]
          this.getCurrentData()
          this.getRelays()
          this.selectFinish = true
          this.timer = setInterval(() => {
            this.getAirData()
          }, 10000)
        }
      }, error => {

      })
    },
    selectGreenHouse(value, option) {
      this.selectedGreenHouseName = option.data.attrs['data-name'];
      this.buttonDisable = false
    },
    selectLocation(value, option) {
      this.getGreenHouseList(value)
      this.selectedLocationName = option.data.attrs['data-name'];
      this.greenHouseSelectDisable = false
    },
    getGreenHouseList(locationId) {
      this.$http.get(`/greenHouse/getByLocationId/${locationId}`).then(response => {
        this.greenHouseList = response.data.data.greenHouseList
      }, error => {
      })
    },
    getLocationList() {
      this.$http.get('/location/getAll').then(response => {
        this.locationList = response.data.data.locationList
      }, error => {
      })
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  created() {
    this.$message.info('请选择大棚')
  },
  mounted() {
    this.initOneWeekdays()
    this.getLocationList()
  }
}
</script>

<style scoped>
@import "../assets/iconfont/iconfont.css";

.active {
  background-color: #bae7ff !important;
}

.deviceItem {
  width: 100%;
  background-color: #eeeeee;
  height: 30px;
  border-radius: 10px;
  text-align: center;
  line-height: 30px;
  margin-bottom: 5px
}

.relayItem {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  background-color: #e6fffb;
  padding: 5px;
  border-radius: 10px
}
</style>
