<template>
  <div class="mapContainer">
    <div id="container"></div>
  </div>
</template>

<script>
const PubSub = require('pubsub-js')
export default {
  name: "MyMap",
  props: {
    theme: {
      type: String,
     /* default: 'amap://styles/6c4e5777b93033c0d470cbe197681830'*/
      default:'amap://styles/462e9df1a381fd5c5da3af00ced97d5f'
    }
  },
  data() {
    return {
      topic: '',
      map: ''
    }
  },
  methods: {
    init(topic, locationList) {
      if (locationList.length >= 1) {
        this.map = new AMap.Map(document.getElementById("container"), {
          center: [locationList[0].latitude, locationList[0].longitude],
          zoom: 10,
          mapStyle: this.theme,
          zoomEnable: false
        })
        for (let i = 0; i < locationList.length; i++) {
          let marker = new AMap.Marker({
            position: new AMap.LngLat(locationList[i].latitude, locationList[i].longitude),
          })
          this.map.add(
            marker
          )
        }
      }
    }
  },
  mounted() {
    this.topic = PubSub.subscribe('initMap', this.init);
  },
  destroy() {
    if (this.map) {
      this.map.destroy();
    }
    if (this.token) {
      PubSub.unsubscribe(this.topic);
    }
  }
}
</script>

<style scoped>
.mapContainer {
  width: 100%;
  height: 100%;
}

#container {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
</style>
