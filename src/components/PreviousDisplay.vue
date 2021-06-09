<template>
  <div>
    <a-row style="padding-top: 100px">
      <a-col :span="6" :offset="9" style="margin-top: 20px">
        <a-select style="width: 100%" placeholder="请选择基地" @select="selectLocation" v-model="selectedLocationId">
          <a-select-option v-for="location in locationList" :value="location.id" :key="location.id"
                           :data-name="location.name"
          >
            {{ location.name }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6" :offset="9" style="margin-top: 20px">
        <a-select style="width: 100%" :disabled="greenHouseSelectDisable" placeholder="请选择大棚"
                  v-model="selectedGreenHouseId" @select="selectGreenHouse">
          <a-select-option v-for="greenHouse in greenHouseList" :value="greenHouse.id" :key="greenHouse.id"
                           :data-name="greenHouse.name"
          >
            {{ greenHouse.name }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6" :offset="9" style="margin-top: 20px">
        <a-button type="primary" @click="nextStep" :disabled="buttonDisable"
        >确定
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "PreviousDisplay",
  data() {
    return {
      locationList: [],
      greenHouseList: [],
      selectedLocationName: '',
      selectedGreenHouseName: '',
      greenHouseSelectDisable: true,
      selectedLocationId: undefined,
      selectedGreenHouseId: undefined,
      buttonDisable: true
    }
  },
  methods: {
    nextStep() {
      let selectedGreenHouseName = this.selectedGreenHouseName
      let selectedGreenHouseId = this.selectedGreenHouseId
      let selectedLocationName = this.selectedLocationName
      this.$router.push(
        {
          name: "Display",
          query: {
            selectedGreenHouseName: selectedGreenHouseName,
            selectedGreenHouseId: selectedGreenHouseId,
            selectedLocationName: selectedLocationName
          }
        }
      )
    },
    selectGreenHouse(value, option) {
      this.buttonDisable = false
      this.selectedGreenHouseName = option.data.attrs['data-name']
    },
    getLocationList() {
      this.$http.get('/location/getAll').then(response => {
        this.locationList = response.data.data.locationList
      }, error => {
      })
    },
    selectLocation(value, option) {
      this.getGreenHouseList(value)
      this.selectedLocationName = option.data.attrs['data-name'];
      this.greenHouseSelectDisable = false
    },
    getGreenHouseList(locationId) {
      this.$http.get(`/greenHouse/getByLocationId/${locationId}`).then(response => {
        this.greenHouseList = response.data.data.greenHouseList
      }, error => {
      })
    }
  },
  mounted() {
    this.getLocationList()
  }
}
</script>

<style scoped>

</style>
