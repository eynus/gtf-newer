<template>
  <Footer class="myfooter" :style="`color:${color}`">
    <div>版权所有：昭通市自然资源和规划局</div>
    <div>
      <span style="display:inline-block;margin-right:20px" >技术支持：中国科学院地理科学与资源研究所</span>
      <span>北京山海础石信息技术有限公司</span>
    </div>
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
  width: 100%;
  background-color: transparent;
  font-size: 12px;
  height: 60px;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
