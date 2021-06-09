<template>
  <div style="width: 100%;height: 100%">
    <div id="barometer" style="width: 100%;height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

const PubSub = require('pubsub-js')
export default {
  name: "Barometer",
  data() {
    return {
      topic: '',
      chart: '',
      option: {
        tooltip: {
          formatter: '当前气压 {c}pa'
        },
        series: [{
          center: ['50%', '60%'],
          type: 'gauge',
          min: 0,
          max: 1000,
          splitNumber: 10,
          radius: '80%',
          axisLine: {
            lineStyle: {
              color: [
                [1, '#FFAB91']
              ],
              width: 2
            }
          },
          splitLine: {
            distance: -18,
            length: 18,
            lineStyle: {
              color: '#FFAB91'
            }
          },
          axisTick: {
            distance: -12,
            length: 10,
            lineStyle: {
              color: '#FFAB91'
            }
          },
          axisLabel: {
            distance: -30,
            color: '#FFAB91',
            fontSize: 10
          },
          anchor: {
            show: true,
            size: 10,
            itemStyle: {
              borderColor: '#FFAB91',
              borderWidth: 2
            }
          },
          pointer: {
            offsetCenter: [0, '10%'],
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '115%',
            itemStyle: {
              color: '#FFAB91'
            }
          },
          detail: {
            valueAnimation: true,
            precision: 1,
            color: '#FFAB91',
            fontSize: 25,
            formatter: '{value}Pa'
          },
          title: {
            offsetCenter: [0, '-50%'],
            color: '#FFAB91'
          },
          data: [{
            value: 58.46,
            name: '气压计'
          }]
        }
        ]
      }
    }
  },
  methods: {
    init(topic, data) {
      if (data){
        this.option.series[0].data[0].value = parseInt(data)
      }
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('barometer'))
      }
      this.chart.setOption(this.option)
    }
  },
  mounted() {
    this.topic = PubSub.subscribe('getPressure', this.init)
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
