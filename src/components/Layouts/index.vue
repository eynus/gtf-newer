<template>
  <Layout>
    <Sider class="h100" :width="`${remToPx(6.25)}`" :style="{background: '#fff'}">
      <my-side-bar :dataList="dataList"></my-side-bar>
    </Sider>
    <Layout class="layouts">
      <Breadcrumb>
        <BreadcrumbItem v-for="item in route">
          {{ item.meta.title }}
        </BreadcrumbItem>
      </Breadcrumb>
      <router-view></router-view>
    </Layout>
  </Layout>
</template>

<script>
  export default {
    name: "Layouts",
    props: {
      dataList: Array,
    },
    data () {
      return {
        route: []
      }
    },
    watch: {
      '$route' (to, from) {
        this.routeChange()
      }
    },
    methods: {
      routeChange() {
        this.route = this.$route.matched.filter(item => item.redirect !== '/home')
      }
    },
    mounted() {
      this.routeChange()
    }
  };
</script>
<style lang="scss" scoped>
  .layouts {
    width: 100%;
    height: 100%;
    padding: 15px;
    padding-top: 0;
    overflow: hidden;
    box-sizing: border-box;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25) inset;
    background-color: $wrap-bg;
    ::v-deep .ivu-breadcrumb{
      padding: 3px 0;
    }
    ::v-deep .ivu-breadcrumb-item-separator {
      color: #3c8fff;
    }
  }
</style>

