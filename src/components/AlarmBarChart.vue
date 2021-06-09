<template>
  <div style="width: 100%;height: 100%">
    <div id="alarmBarChart" style="width: 100%;height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "AlarmBarChart",
  data() {
    return {
      onresizeTopic: '',
      topic: '',
      option: {
        tooltip: {
          formatter(event) {
            return `${event.name}<br/>${event.value}次报警`
          }
        },
        grid: {
          top: '5%',
          left: '8%',
          right: '5%',
          bottom: '10%'
        },
        xAxis: {
          type: 'category',
          data: ['05-01', '05-02', '05-03', '05-04', '05-05', '05-06', '05-07'],
        },
        yAxis: {
          type: 'value',
          barWidth: 10
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }]
      },
      chart: ''
    }
  },
  methods: {
    init(topic, data) {
      this.option.xAxis.data = data.days
      let map = {}
      for (let j = 0; j < data.data.length; j++) {
        map[data.data[j].alarmDate] = data.data[j].frequency
      }
      let frequencyArr = []
      for (let i = 0; i < data.days.length; i++) {
        if (map[data.days[i]] !== undefined) {
          frequencyArr[i] = map[data.days[i]]
        } else {
          frequencyArr[i] = 0
        }
      }
      this.option.series[0].data = frequencyArr
      this.chart = echarts.init(document.getElementById('alarmBarChart'))
      this.chart.setOption(this.option)
    },
    /*resizeChart() {
      setTimeout(() => {
        this.chart.resize(this.option)
      }, 500)
    }*/
  },
  destroyed() {
    if (this.chart) {
      this.chart.dispose()
    }
    if (this.topic) {
      PubSub.unsubscribe(this.topic);
    }
    /* if (this.onresizeTopic) {
       PubSub.unsubscribe(this.onresizeTopic);
     }*/
  },
  mounted() {
    this.topic = PubSub.subscribe('topic02', this.init)
    /*this.onresizeTopic = PubSub.subscribe('onresize', this.resizeChart)*/
  },
  created() {

  }
}
</script>

<style scoped>

</style>
