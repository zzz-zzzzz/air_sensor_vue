<template>
  <div style="width: 100%;height: 100%">
    <div id="illumination" style="width: 100%;height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

const PubSub = require('pubsub-js')
export default {
  name: "Illumination",
  data() {
    return {
      topic: '',
      chart: '',
      option: {
        tooltip: {
          formatter: '当前光照度 {c}lux'
        },
        series: [{
          type: 'gauge',
          min: 0,
          max: 500,
          itemStyle: {
            color: '#58D9F9',
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          progress: {
            show: true,
            roundCap: true,
            width: 10
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '75%',
            width: 10,
            offsetCenter: [0, '5%']
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 10
            }
          },
          axisTick: {
            splitNumber: 2,
            lineStyle: {
              width: 1,
              color: '#999'
            }
          },
          splitLine: {
            length: 12,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 11,
            color: '#999',
            fontSize: 10
          },
          title: {
            show: true
          },
          detail: {
            offsetCenter: [0, '50%'],
            valueAnimation: true,
            formatter: function (value) {
              return '{value|' + value + '} {unit|Lux}';
            },
            rich: {
              value: {
                fontSize: 15,
                fontWeight: 'bolder',
                color: '#777'
              },
              unit: {
                fontSize: 15,
                color: '#999'
              }
            }
          },
          data: [{
            value: 0,
            name: '光照度'
          }]
        }]
      }
    }
  },
  methods: {
    init(topic, data) {
      if (data){
        this.option.series[0].data[0].value = parseInt(data)
      }
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('illumination'))
      }
      this.chart.setOption(this.option)
    }
  },
  destroyed() {
    if (this.chart) {
      this.chart.dispose()
    }
    if (this.topic) {
      PubSub.unsubscribe(this.topic)
    }
  },
  mounted() {
    this.topic = PubSub.subscribe('getIllumination', this.init)
  }
}
</script>

<style scoped>

</style>
