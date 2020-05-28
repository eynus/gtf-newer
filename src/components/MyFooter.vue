<template>
  <Footer class="myfooter" :style="`color:${color}`">
    <div>版权所有：昭通市自然资源和规划局</div>
    <div>技术支持：中国科学院地理科学与资源研究所 北京山海础石信息技术有限公司</div>
  </Footer>
</template>
<script>
export default {
  name: "myfooter",
  props: {
    color: {
      type: String,
      default: "#000"
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.myfooter {
  // position: absolute;
  // bottom: 0;
  width: 100%;
  background-color: transparent;
  font-size: .875rem;
  line-height: 1.325rem;
  text-align: center;
  height: 2.65rem;
}
</style>
