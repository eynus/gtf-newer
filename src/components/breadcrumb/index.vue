<template>
  <div class="breadcrumb">
    <Icon custom="iconfont icon-type" size="16" color="#2d8cf0" />
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
  color: #515a6e;
  font-size: 14px;
  margin-bottom: 14px;
}
</style>
