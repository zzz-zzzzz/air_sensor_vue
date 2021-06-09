<template>
  <div class="chartContainer">
    <div id="chart_03_container"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Chart03",
  data() {
    return {
      option: {
        series: [{
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#464646'
            }
          },
          axisLine: {
            lineStyle: {
              width: 10
            }
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 10
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            distance: 50
          },
          data: [
            {
              value: 40,
              name: 'CO2',
              title: {
                offsetCenter: ['0%', '-40%']
              },
              detail: {
                offsetCenter: ['0%', '-20%']
              }
            },
            {
              value: 60,
              name: 'TVOC',
              title: {
                offsetCenter: ['0%', '20%']
              },
              detail: {
                offsetCenter: ['0%', '50%']
              }
            }
          ],
          title: {
            fontSize: 14
          },
          detail: {
            width: 50,
            height: 14,
            fontSize: 14,
            color: 'auto',
            borderColor: 'auto',
            borderRadius: 20,
            borderWidth: 1,
            formatter: '{value}'
          }
        }]
      },
      chart: ""
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('chart_03_container'));
      this.chart.setOption(this.option);
    }
  },
  mounted() {
    this.initChart()
  },
  destroyed() {
    this.chart.dispose()
  }
}
</script>

<style scoped>
.chartContainer {
  width: 100%;
  height: 100%;
}

#chart_03_container {
  width: 100%;
  height: 100%;
}
</style>
