<template>
  <div class="imgView">
    <img :src="path" alt="">
  </div>
</template>

<script>
  export default {
    name: "imgView",
    props: {
      path: String
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
.imgView {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
