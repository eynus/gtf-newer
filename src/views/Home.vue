<template>
  <div class="home h100">
    <Layout style="height:100%;background-color:yellow">
      <Sider class="h100" width="110" :style="{background: '#fff'}">
        <Menu
          :active-name="activeMenuItem"
          theme="light"
          width="auto"
          :class="menuitemClasses"
          @on-select="changeRoute"
        >
          <MenuItem name="overview">
            <Icon type="ios-navigate"></Icon>
            <div>数据总览</div>
          </MenuItem>
          <MenuItem name="query">
            <Icon type="ios-search"></Icon>
            <div>查询浏览</div>
          </MenuItem>
          <MenuItem name="service">
            <Icon type="ios-settings"></Icon>
            <div>服务管理</div>
          </MenuItem>
          <MenuItem name="inspection">
            <Icon type="ios-settings"></Icon>
            <div>质检管理</div>
          </MenuItem>
        </Menu>
        <div slot="trigger"></div>
      </Sider>
      <Layout class="h100">
        <Content id="content" style="height:94%;padding:15px">
          <Card style="height:100%">
            <router-view />
          </Card>
        </Content>
        <Footer id="foot" style="height:6%">
          <div>版权所有：昭通市自然资源与规划局</div>
          <div>技术支持：中国科学院地理科学与资源研究所 北京山海础石信息技术有限公司</div>
        </Footer>
      </Layout>
    </Layout>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      activeMenuItem: "overview"
    };
  },
 
  computed: {
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  watch: {
    "$route.path": function(newVal) {
      switch (newVal) {
        case "/data/query":
        case "/data/inspection":
        case "/data/service":
        case "/data/overview":
          this.activeMenuItem = newVal.slice(6);
          break;
        default:
          break;
      }
    }
  },
  methods: {
    changeRoute(data) {
      this.activeMenuItem = data;
      this.$router.push("/" + data);
    }
  }
};
</script>
<style lang="scss" scoped>
.card-container {
  // margin:4px;
  .card-title {
    background-color: rgba(0, 0, 0, 0.1);
    font-weight: bold;
  }
  .card-body {
    .card-left-item {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 2px;
      margin: 10px;
      padding: 6px;
      color: white;
      .card-left-item-title {
        font-size: 26px;

        font-weight: bold;
      }
      .card-left-item-total {
        font-size: 26px;
        font-weight: bold;
      }
    }
  }
}
</style>

