<template>
  <Layout>
    <Sider class="h100" :width="`${remToPx(6.25)}`" :style="{background: '#fff'}">
      <my-side-bar :dataList="dataList"></my-side-bar>
    </Sider>
    <Layout class="layouts">
      <div class="layout-card">
        <router-view></router-view>
      </div>
      <div>
        <my-footer color="rgb(200,200,200)"></my-footer>
      </div>
    </Layout>
  </Layout>
</template>

<script>
  export default {
    name: "Layouts",
    props: {
      dataList: Array,
    }
  };
</script>
<style lang="scss" scoped>
  .layouts {
    width: 100%;
  }
  .layout-card {
    width: 100%;
    height: calc(100% - 40px);
    padding: 15px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25) inset;
    background-color: $wrap-bg;
  }
</style>

