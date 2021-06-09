<template>
  <div style="width: 100%;height: 100%">
    <div id="hygrometer" style="width: 100%;height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

const PubSub = require('pubsub-js')
export default {
  name: "Hygrometer",
  data() {
    return {
      topic: '',
      chart: '',
      option: {
        tooltip: {
          formatter: '当前湿度 {c}%'
        },
        series: [{
          type: 'gauge',
          progress: {
            show: true,
            width: 10
          },
          axisLine: {
            lineStyle: {
              width: 10
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            distance: 0,
            length: 10,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 15,
            color: '#999',
            fontSize: 10
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 10,
            itemStyle: {
              borderWidth: 5
            }
          },
          title: {
            show: true
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '70%'],
            formatter: '{value}％',
          },
          data: [{
            value: 70,
            name: "湿度"
          }]
        }]
      }
    }
  },
  methods: {
    init(topic, data) {
      if (data) {
        this.option.series[0].data[0].value = parseInt(data)
      }
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('hygrometer'))
      }
      this.chart.setOption(this.option)
    }
  },
  mounted() {
    this.topic = PubSub.subscribe('getHumidity', this.init)
  },
  destroyed() {
    if (this.chart) {
      this.chart.dispose()
    }
    if (this.topic) {
      PubSub.unsubscribe(this.topic)
    }
  }
}
</script>

<style scoped>

</style>
