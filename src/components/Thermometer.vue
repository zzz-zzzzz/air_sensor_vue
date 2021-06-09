<template>
  <div class="chartContainer">
    <div id="chart_04_container"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

const PubSub = require('pubsub-js')
export default {
  name: "Thermometer",
  data() {
    return {
      option: {
        series: [
          {
            type: 'gauge',
            center: ["50%", "60%"],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            splitNumber: 12,
            itemStyle: {
              color: '#FFAB91'
            },
            progress: {
              show: true,
              width: 5
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                width: 10
              }
            },
            axisTick: {
              distance: -15,
              splitNumber: 5,
              lineStyle: {
                width: 1,
                color: '#999'
              }
            },
            splitLine: {
              distance: -25,
              length: 14,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            axisLabel: {
              distance: -20,
              color: '#999',
              fontSize: 10
            },
            anchor: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              height: '15%',
              borderRadius: 8,
              offsetCenter: [0, '-15%'],
              fontSize: 20,
              fontWeight: 'bolder',
              formatter: '{value} °C',
              color: 'auto'
            },
            data: [{
              value: 20
            }]
          }
        ],
      },
      chart: ""
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('chart_04_container'));
      this.chart.setOption(this.option);
    },
    init(topic, data) {
      if (data) {
        this.option.series[0].data[0].value = parseInt(data)
      }
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('chart_04_container'))
      }
      this.chart.setOption(this.option)
    }
  },
  mounted() {
    this.topic = PubSub.subscribe('getTemperature', this.init)
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
.chartContainer {
  width: 100%;
  height: 100%;
}

#chart_04_container {
  width: 100%;
  height: 100%;
}
</style>
