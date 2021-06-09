<template>
  <div>
    <a-avatar
      shape="square"
      size="large"
      style="background-color: #1890FF;vertical-align:middle }"
    >
      {{ username }}
    </a-avatar>
  </div>
</template>

<script>
export default {
  name: "MyAvatar",
  props: {
    username: {
      type: String,
      default: 'user'
    }
  }
}
</script>

<style scoped>

</style>
