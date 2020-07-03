<template>
  <div class="container">
    <iframe :src="`${url}/manager/html`" frameborder="0"></iframe>
  </div>
</template>

<script>
  export default {
    name: "monitor",
    data(){
      return {
        url: ''
      }
    },
    mounted() {
      this.url = process.env.NODE_ENV === 'development' ? 'http://192.168.1.159:8080' : ''
    }
  }
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
  background: #fff;
  iframe {
    height: 100%;
    width: 100%;
  }
}
</style>
