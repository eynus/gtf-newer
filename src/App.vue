<template>
  <div id="app">
    <!-- <div id="nav"> -->
      <!-- <router-link to="/">ceshi </router-link> |
      <router-link to="/about">About</router-link> -->
      <!-- <div class="layout"> -->
        <Layout>
            <Header id="head">昭通市国土空间基础信息平台</Header>
            <Content id="content" >
               <router-view/>
            </Content>
            <!-- <Footer id="foot">Footer</Footer> -->
        </Layout>
      <!-- </div> -->
    <!-- </div> -->
   
  </div>
</template>

<style lang="scss" scoped>
@import './style.scss';
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;

  height: 100vh;
}
#head{
  height: 6vh;
  line-height: 6vh;
}
#content{
  height: 94vh;
}
// #foot{
//   height: 4vh;
// }
</style>
