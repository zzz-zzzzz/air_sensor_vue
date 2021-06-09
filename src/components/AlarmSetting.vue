<template>
  <div style="height: 100%;width: 100%;">
    <div v-if="!selectFinish" style="padding-top: 100px">
      <a-row>
        <a-col :span="6" :offset="9" style="margin-top: 20px">
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
          <a-select style="width: 100%" :disabled="greenHouseSelectDisable" placeholder="请选择大棚"
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
          <a-select style="width: 100%" placeholder="请选择设备" @select="selectDevice" v-model="selectedDeviceId"
                    :disabled="deviceSelectDisable">
            <a-select-option v-for="device in deviceList" :value="device.id" :key="device.id"
                             :data-name="device.name"
            >
              {{ device.name }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6" :offset="9" style="margin-top: 20px">
          <a-button type="primary" @click="nextStep" :disabled="buttonDisable"
          >确定
          </a-button>
        </a-col>
      </a-row>
    </div>
    <div v-if="selectFinish" style="height: 100%;width: 100%;">
      <a-row style="height: 5% ;border-bottom: 1px solid #E8E8E8; margin-bottom: 20px">
        <a-col :span="6" style="margin:12px 0 0 20px">
          <a-breadcrumb>
            <a-breadcrumb-item><span style="font-weight: bold;color: black"
                                     @click="previousStep">{{ selectedLocationName }}</span>
            </a-breadcrumb-item>
            <a-breadcrumb-item><span style="font-weight: bold;color: black">{{ selectedGreenHouseName }}</span>
            </a-breadcrumb-item>
            <a-breadcrumb-item><span style="font-weight: bold;color: black">{{ selectedDeviceName }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </a-col>
      </a-row>
      <a-row style="height: 90%;margin-top: 10px">
        <div
          style="border:1px solid #E8E8E8;height: 100%;margin-left: 20px;margin-right: 20px;border-radius: 20px;position: relative">
          <a-row>
            <a-col :offset="1" :span="4" style="margin-top: 30px">
              <span style="font-weight: bold">报警开关：</span>
              <a-switch checked-children="开" un-checked-children="关" v-model="airDataScope.isOpen"
                        style="width: 60px"/>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5" :offset="1" style="display: flex;height: 32px;line-height: 32px;margin-top: 30px">
              <span style="flex: 1">温度阈值：</span>
              <a-input style="width: 70%;" v-model="airDataScope.temperatureMin" :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-sheshidu"/>
              </a-input>
            </a-col>
            <a-col :span="1" style="height: 32px;line-height: 32px;text-align: center;margin-top: 30px">至</a-col>
            <a-col :span="5" style="height: 32px;line-height: 32px;margin-top: 30px">
              <a-input style="width: 70%;" v-model="airDataScope.temperatureMax"
                       :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-sheshidu"/>
              </a-input>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5" :offset="1" style="display: flex;height: 32px;line-height: 32px;margin-top: 30px">
              <span style="flex: 1">湿度阈值：</span>
              <a-input style="width: 70%;" v-model="airDataScope.humidityMin"
                       :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-baifenhao"/>
              </a-input>
            </a-col>
            <a-col :span="1" style="height: 32px;line-height: 32px;text-align: center;margin-top: 30px">至</a-col>
            <a-col :span="5" style="height: 32px;line-height: 32px;margin-top: 30px">
              <a-input style="width: 70%;" v-model="airDataScope.humidityMax"
                       :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-baifenhao"/>
              </a-input>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5" :offset="1" style="display: flex;height: 32px;line-height: 32px;margin-top: 30px">
              <span style="flex: 1">大气压阈值：</span>
              <a-input style="width: 70%;" v-model="airDataScope.pressureMin"
                       :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-pa1"/>
              </a-input>
            </a-col>
            <a-col :span="1" style="height: 32px;line-height: 32px;text-align: center;margin-top: 30px">至</a-col>
            <a-col :span="5" style="height: 32px;line-height: 32px;margin-top: 30px">
              <a-input style="width: 70%;" v-model="airDataScope.pressureMax"
                       :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-pa1"/>
              </a-input>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5" :offset="1" style="display: flex;height: 32px;line-height: 32px;margin-top: 30px">
              <span style="flex: 1">CO2阈值：</span>
              <a-input style="width: 70%;" v-model="airDataScope.co2Min" :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-PPM"/>
              </a-input>
            </a-col>
            <a-col :span="1" style="height: 32px;line-height: 32px;text-align: center;margin-top: 30px">至</a-col>
            <a-col :span="5" style="height: 32px;line-height: 32px;margin-top: 30px">
              <a-input style="width: 70%;" v-model="airDataScope.co2Max" :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-PPM"/>
              </a-input>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5" :offset="1" style="display: flex;height: 32px;line-height: 32px;margin-top: 30px">
              <span style="flex: 1">TVOC阈值：</span>
              <a-input style="width: 70%;" v-model="airDataScope.tovcMin" :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-PPM"/>
              </a-input>
            </a-col>
            <a-col :span="1" style="height: 32px;line-height: 32px;text-align: center;margin-top: 30px">至</a-col>
            <a-col :span="5" style="height: 32px;line-height: 32px;margin-top: 30px">
              <a-input style="width: 70%;" v-model="airDataScope.tovcMin" :disabled="!airDataScope.isOpen">
                <icon-font slot="suffix" type="icon-PPM"/>
              </a-input>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5" :offset="1" style="display: flex;height: 32px;line-height: 32px;margin-top: 30px">
              <span style="flex: 1">光照阈值：</span>
              <a-input style="width: 70%;" v-model="airDataScope.illuminationMin"
                       :disabled="!airDataScope.isOpen">
                <span slot="suffix" style="font-weight: lighter">
                  LX
                </span>
              </a-input>
            </a-col>
            <a-col :span="1" style="height: 32px;line-height: 32px;text-align: center;margin-top: 30px">至</a-col>
            <a-col :span="5" style="height: 32px;line-height: 32px;margin-top: 30px">
              <a-input style="width: 70%;" v-model="airDataScope.illuminationMax"
                       :disabled="!airDataScope.isOpen">
                     <span slot="suffix" style="font-weight: lighter">
                  LX
                </span>
              </a-input>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6" :offset="1" style="display: flex;height: 32px;line-height: 32px;margin-top: 30px">
              <span style="flex: 1">触发继电器：</span>
              <a-select
                mode="multiple"
                v-model="airDataScope.relayIds"
                style="width: 75%"
                placeholder="请选择继电器"
                :disabled="!airDataScope.isOpen"
              >
                <a-select-option v-for="relay in relayList" :key="relay.id">
                  {{ relay.name }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <div>
            <a-button type="primary" style="position: absolute;bottom: 50px;left: 70px;"
                      @click="saveOrUpdate">保存
            </a-button>
          </div>
        </div>
      </a-row>
    </div>
  </div>
</template>

<script>
import {Icon} from 'ant-design-vue';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2535863_z3ec6ijhjuk.js',
});
export default {
  name: "AlarmSetting",
  data() {
    return {
      buttonDisable: true,
      deviceSelectDisable: true,
      selectedLocationName: '',
      selectFinish: false,
      locationList: [],
      greenHouseSelectDisable: true,
      selectedLocationId: undefined,
      greenHouseList: [],
      selectedGreenHouseId: undefined,
      selectedDeviceId: undefined,
      deviceList: [],
      selectedGreenHouseName: '',
      selectedDeviceName: '',
      airDataScope: {
        isOpen: false,
        temperatureMin: '',
        temperatureMax: '',
        humidityMin: '',
        humidityMax: '',
        pressureMin: '',
        pressureMax: '',
        tovcMin: '',
        tovcMax: '',
        co2Min: '',
        co2Max: '',
        illuminationMin: '',
        illuminationMax: '',
        advicePhone: '',
        relayIds: []
      },
      relayList: []
    }
  },
  mounted() {
    this.getLocationList()
    this.$message.info('请选择设备')
  },
  methods: {
    previousStep() {
      this.buttonDisable = true
      this.selectFinish = false
      this.selectedDeviceId = undefined
      this.selectedDeviceName = undefined
      this.selectedGreenHouseId = undefined
      this.selectedGreenHouseName = undefined
      this.selectedLocationName = undefined
      this.selectedLocationId = undefined
      this.greenHouseSelectDisable = true
      this.deviceSelectDisable = true
    },
    nextStep() {
      this.selectFinish = true
      this.getAirDataScope(this.selectedDeviceId)
      this.getRelayList(this.selectedGreenHouseId)
    },
    getLocationList() {
      this.$http.get('/location/getAll').then(response => {
        this.locationList = response.data.data.locationList
      }, error => {
      })
    },
    getGreenHouseList(locationId) {
      this.$http.get(`/greenHouse/getByLocationId/${locationId}`).then(response => {
        this.greenHouseList = response.data.data.greenHouseList
      }, error => {
      })
    },
    getDeviceList(greenHouseId) {
      this.$http.get(`/device/getByGreenHouseId/${greenHouseId}`).then(response => {
        this.deviceList = response.data.data.deviceList
      }, error => {
      })
    },
    selectLocation(value, option) {
      this.getGreenHouseList(value)
      this.selectedLocationName = option.data.attrs['data-name'];
      this.greenHouseSelectDisable = false
    },
    selectGreenHouse(value, option) {
      this.getDeviceList(value)
      this.deviceSelectDisable = false
      this.selectedGreenHouseName = option.data.attrs['data-name'];
    },
    selectDevice(value, option) {
      this.buttonDisable = false
      this.selectedDeviceId = value
      this.selectedDeviceName = option.data.attrs['data-name'];
    },
    getRelayList(greenHouseId) {
      this.$http.get(`/relay/getByGreenHouseId/${greenHouseId}`).then(response => {
        this.relayList = response.data.data.relayList
      }, error => {
      })
    },
    getAirDataScope(deviceId) {
      this.$http.get(`/airDataScope/getByDeviceId/${deviceId}`).then(response => {
        if (response.data.data.airDataScope !== undefined) {
          this.airDataScope.id = response.data.data.airDataScope.id
          this.airDataScope.isOpen = response.data.data.airDataScope.isOpen
          this.airDataScope.temperatureMin = response.data.data.airDataScope.temperatureMin
          this.airDataScope.temperatureMax = response.data.data.airDataScope.temperatureMax
          this.airDataScope.humidityMin = response.data.data.airDataScope.humidityMin
          this.airDataScope.humidityMax = response.data.data.airDataScope.humidityMax
          this.airDataScope.pressureMin = response.data.data.airDataScope.pressureMin
          this.airDataScope.pressureMax = response.data.data.airDataScope.pressureMax
          this.airDataScope.tovcMin = response.data.data.airDataScope.tovcMin
          this.airDataScope.tovcMax = response.data.data.airDataScope.tovcMax
          this.airDataScope.co2Min = response.data.data.airDataScope.co2Min
          this.airDataScope.co2Max = response.data.data.airDataScope.co2Max
          this.airDataScope.illuminationMin = response.data.data.airDataScope.illuminationMin
          this.airDataScope.illuminationMax = response.data.data.airDataScope.illuminationMax
          if (response.data.data.airDataScope.relayIdsString !== undefined) {
            this.airDataScope.relayIds = JSON.parse(response.data.data.airDataScope.relayIdsString)
          }
        } else {
          this.$message.info(this.selectedDeviceName + "未设置报警值")
          this.airDataScope = {
            isOpen: false,
            temperatureMin: '',
            temperatureMax: '',
            humidityMin: '',
            humidityMax: '',
            pressureMin: '',
            pressureMax: '',
            tovcMin: '',
            tovcMax: '',
            co2Min: '',
            co2Max: '',
            illuminationMin: '',
            illuminationMax: ''
          }
        }
      }, error => {

      })
    },
    saveOrUpdate() {
      this.airDataScope.deviceId = this.selectedDeviceId
      this.$http.post('/airDataScope/saveOrUpdate', this.airDataScope).then(response => {
        if (response.data.status === 2000) {
          this.$message.info('修改成功')
          this.getAirDataScope(this.selectedDeviceId)
        }
      }, reason => {

      })
    }
  },
  components: {
    IconFont
  }
}
</script>

<style scoped>

</style>
