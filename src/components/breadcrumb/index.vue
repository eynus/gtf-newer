<template>
  <div class="breadcrumb">
    <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />
    <span class="ml">{{ name }}</span>
  </div>
</template>

<script>
  export default {
    name: "Breadcrumb",
    data() {
      return {
        name: ''
      }
    },
    mounted() {
      this.name = this.$route.meta.title
    }
  }
</script>

<style scoped>
.breadcrumb {
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.75;
  color: rgb(81, 81, 81);
  padding: 0 .25rem;
}
</style>
