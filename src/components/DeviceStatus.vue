<template>
  <div style="width: 100%;height: 100%">
    <div id="deviceStatusChart" style="width: 100%;height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

const PubSub = require('pubsub-js')
export default {
  name: "DeviceStatus",
  data() {
    return {
      onresizeTopic: '',
      topic: '',
      option: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '设备情况',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 0, name: '正常设备'},
              {value: 0, name: '报警设备'},
              {value: 0, name: '离线设备'}
            ]
          }
        ]
      },
      chart: ''
    }
  },
  methods: {
    init(topic, deviceInfo) {
      this.option.series[0].data[0].value = deviceInfo.normalCount
      this.option.series[0].data[1].value = deviceInfo.alarmCount
      this.option.series[0].data[2].value = deviceInfo.offlineCount
      this.chart = echarts.init(document.getElementById('deviceStatusChart'),);
      this.chart.setOption(this.option);
    }
  },
  /* resizeChart() {
     console.log("zzz")
     setTimeout(() => {
       console.log("zzz")
       this.chart.resize(this.option)
     }, 500)
   },*/
  destroyed() {
    if (this.chart) {
      this.chart.dispose()
    }
    if (this.topic) {
      PubSub.unsubscribe(this.topic);
    }
    /*    if (this.onresizeTopic) {
          PubSub.unsubscribe(this.onresizeTopic);
        }*/
  },
  mounted() {
    this.topic = PubSub.subscribe('topic01', this.init);
    /*   this.onresizeTopic = PubSub.subscribe('onresize', this.resizeChart)*/
    /*  window.onresize = this.resizeChart*/
  },
}
</script>

<style scoped>

</style>
