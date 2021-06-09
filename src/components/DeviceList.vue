<template>
  <div class="deviceListContainer" style="padding:10px">
    <div class="my-font" style="margin-bottom: 10px">
      设备列表
    </div>
    <div class="deviceList" style="height: 90%;margin-bottom: 10px">
      <vue-scroll :ops="ops" ref="deviceList">
        <div class="deviceItem" v-for="(device,index) in deviceList" :key="device.id" :data-device-index="index"
             @click="switchDevice"
             :class="index===activeDeviceIndex?'active':''" :id="'deviceItem'+index">
          <div class="deviceName" :data-device-index="index">
            {{ device.name }}
          </div>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
const PubSub = require('pubsub-js')
export default {
  name: "DeviceList",
  data() {
    return {
      activeDeviceIndex: 0,
      deviceList: [],
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {
          background: '#eeeeee'
        }
      },
      topic: '',
      iterator: '',
      iteratorCount: 0
    }
  },
  methods: {
    switchDevice(event) {
      this.activeDeviceIndex = parseInt(event.target.dataset.deviceIndex)
      this.iteratorCount = event.target.dataset.deviceIndex
      PubSub.publish('nextDevice', this.deviceList[this.activeDeviceIndex])
    },
    init(topic, data) {
      this.deviceList = data
      if (this.deviceList.length > 1) {
        this.initIterator()
      }
    },
    initIterator() {
      this.iterator = setInterval(() => {
        this.iteratorCount++
        this.activeDeviceIndex = this.iteratorCount % this.deviceList.length
        this.$refs.deviceList.scrollIntoView('#deviceItem' + this.activeDeviceIndex)
        PubSub.publish('nextDevice', this.deviceList[this.activeDeviceIndex])
      }, 20000)
    }
  },
  mounted() {
    this.topic = PubSub.subscribe('getDeviceList', this.init)
  },
  destroyed() {
    if (this.topic) {
      PubSub.unsubscribe(this.topic)
    }
    if (this.iterator) {
      clearInterval(this.iterator)
    }
  }
}
</script>

<style scoped>
@import "../assets/font/font.css";

.deviceListContainer {
  width: 100%;
  height: 100%;
}

.deviceList .deviceItem {
  padding: 10px;
  margin: 5px;
  color: yellow;
  font-weight: bold;
  border: 1px solid #2F5377;
  display: flex;
  justify-content: space-between;
}

.deviceItem.active {
  background-color: #132230;
}
</style>
