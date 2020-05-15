<template>
  <div id="app">
    <Layout>
      <Header id="head">
        昭通市国土空间基础信息平台
        <span>
          <i>「</i>
          {{moduleName}}
          <i>」</i>
        </span>
      </Header>
      <Content id="content">
        <router-view />
      </Content>
    </Layout>
  </div>
</template>
<script>
export default {
  name: "mainpage",
  data() {
    return {
      moduleName: "数据管理"
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../style.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
#head {
  height: 6vh;
  line-height: 6vh;
  font-size: 24px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 10px;
  background-image: url("../assets/img/dataManage/head_bg.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  span {
    font-size: 20px;
    i {
      font-size: 18px;
      font-style: normal;
    }
  }
}
#content {
  height: 94vh;
}
</style>
