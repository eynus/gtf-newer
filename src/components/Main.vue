<template>
  <div id="app">
    <Layout>
      <Header id="head" class="flex flex-sb">
      <div>  昭通市国土空间基础信息平台
        <span>
          <i>「</i>
          {{moduleName}}
          <i>」</i>
        </span></div>
        <div class="user-info" title="返回主页" @click="returnHome">
          <Icon type="md-person" />
          {{userName}}
        </div>
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
  },
   computed: {
    userName(){
      return this.$store.state.user.userInfo&&this.$store.state.user.userInfo.userName||''
    }
   },
   methods:{
     returnHome(){
       this.$router.push('/home')
     }
   },
   created(){
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
  font-size:1.75rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 10px;
  background-image: url("../assets/img/dataManage/head_bg.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  span {
    font-size: 1.5rem;
    i {
      font-size: 1.125rem;
      font-style: normal;
    }
  }
  .user-info{
    margin-right: 1rem;
    color: #fff;
    font-weight: normal;
    cursor: pointer;
    font-size: 1.25rem;
  }
}
#content {
  height: 94vh;
}
</style>
