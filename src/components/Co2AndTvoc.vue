<template>
  <div class="chartContainer">
    <div id="chart_05_container"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

const PubSub = require('pubsub-js')
export default {
  name: "Chart05",
  data() {
    return {
      topic: '',
      option: {
        tooltip: {
          formatter(event) {
            return `${event.name}浓度 ${event.value}PPM`
          }
        },
        series: [{
          min: 0,
          max: 1000,
          type: 'gauge',
          anchor: {
            show: true,
            showAbove: true,
            size: 5,
            itemStyle: {
              color: '#FAC858'
            }
          },
          axisTick: {
            distance: 5
          },
          axisLabel: {
            distance: 7,
            color: '#999',
            fontSize: 10
          },
          splitLine: {
            distance: 5
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 2,
            length: '70%',
            offsetCenter: [0, '8%']
          },
          progress: {
            show: true,
            width: 5
          },
          axisLine: {
            lineStyle: {
              width: 5
            }
          },
          data: [{
            value: 0,
            name: 'CO2',
            title: {
              offsetCenter: ['-60%', '80%']
            },
            detail: {
              offsetCenter: ['-60%', '110%']
            }
          },
            {
              value: 0,
              name: 'TVOC',
              title: {
                offsetCenter: ['60%', '80%']
              },
              detail: {
                offsetCenter: ['60%', '110%']
              }
            }
          ],
          title: {
            fontSize: 13
          },
          detail: {
            width: 20,
            height: 10,
            fontSize: 10,
            color: '#fff',
            backgroundColor: 'auto',
            borderRadius: 3,
            formatter: '{value}'
          }
        }]
      },
      chart: ""
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('chart_05_container'), 'dark');
      this.chart.setOption(this.option);
    },
    init(topic, data) {
      if (data.co2) {
        this.option.series[0].data[0].value = parseInt(data.co2)
      }
      if (data.tvoc) {
        this.option.series[0].data[1].value = parseInt(data.tvoc)
      }
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('chart_05_container'));
      }
      this.chart.setOption(this.option);
    }
  },
  mounted() {
    this.topic = PubSub.subscribe('getCo2AndTvoc', this.init)
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

#chart_05_container {
  width: 100%;
  height: 100%;
}
</style>
