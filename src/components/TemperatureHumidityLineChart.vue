<template>
  <div class="chartContainer">
    <div id="chart_01_container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "TemperatureHumidityLineChart",
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['温度', '湿度']
        },
        grid: {
          top:'20%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '温度',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '湿度',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      },
      chart: ""
    }
  },
  methods: {
    initChart() {
      if (this.chart !== null && this.chart !== "" && this.chart !== undefined) {
        this.chart.dispose();
      }
      this.chart = echarts.init(document.getElementById('chart_01_container'));
      this.chart.setOption(this.option);
    },
    init(topic, data) {
      this.option.xAxis.data = data.days
      let map01 = {}
      let map02 = {}
      let temperatureList = []
      let humidityList = []

      for (let i = 0; i < data.data.length; i++) {
        let o = {}
        if (data.data[i].temperatureAverage !== undefined) {
          map01[data.data[i].recordTime] = data.data[i].temperatureAverage
        }
        if (data.data[i].humidityAverage !== undefined) {
          map02[data.data[i].recordTime] = data.data[i].humidityAverage
        }
      }
      for (let i = 0; i < data.days.length; i++) {
        if (map01[data.days[i]] === undefined) {
          temperatureList.push(0)
        } else {
          temperatureList.push(map01[data.days[i]])
        }
        if (map02[data.days[i]] === undefined) {
          humidityList.push(0)
        } else {
          humidityList.push(map02[data.days[i]])
        }
      }
      this.option.series[0].data = temperatureList
      this.option.series[1].data = humidityList
      this.initChart()
    }
  },
  mounted() {
    this.topic = PubSub.subscribe('topic04', this.init);
  },
  destroyed() {
    if (this.chart) {
      this.chart.dispose()
    }
    if (this.topic) {
      PubSub.unsubscribe(this.topic);
    }
  }
}
</script>

<style scoped>
.chartContainer {
  width: 100%;
  height: 100%;
}

#chart_01_container {
  width: 100%;
  height: 100%;
}
</style>
