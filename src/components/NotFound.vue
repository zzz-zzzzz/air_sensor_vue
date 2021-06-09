<template>
  <a-result status="404" title="404" sub-title="抱歉，您访问的页面不存在。" style="padding-top: 150px">
    <template #extra>
      <a-button type="primary" @click="backHome">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
  export default {
    name: "NotFound",
    methods: {
      backHome() {
        this.$router.push({path: "/"})
      }
    }
  }
</script>

<style scoped>

</style>
