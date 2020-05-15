<template>
  <div class="home h100">
    <Layout style="height:100%;">
      <Sider class="h100" width="110" :style="{background: '#fff'}">
        <Menu
          :active-name="activeMenuItem"
          theme="light"
          width="auto"
          :class="menuitemClasses"
          @on-select="changeRoute"
        >
          <MenuItem name="overview" class="menu-item">
            <Icon
              custom="iconfont  icon-overview"
              size="22"
              :color="activeMenuItem==='overview'?'#2d8cf0':'#8391B8'"
            />

            <div>数据总览</div>
          </MenuItem>
          <MenuItem name="query" class="menu-item">
            <Icon
              custom="iconfont  icon-file"
              size="22"
              :color="activeMenuItem==='query'?'#2d8cf0':'#8391B8'"
            />
            <div>查询浏览</div>
          </MenuItem>
          <MenuItem name="service" class="menu-item">
            <Icon
              custom="iconfont  icon-jiangbei"
              size="22"
              :color="activeMenuItem==='service'?'#2d8cf0':'#8391B8'"
            />
            <div>服务管理</div>
          </MenuItem>
          <MenuItem name="inspection" class="menu-item">
            <Icon
              custom="iconfont  icon-setting"
              size="22"
              :color="activeMenuItem==='inspection'?'#2d8cf0':'#8391B8'"
            />
            <div>质检管理</div>
          </MenuItem>
        </Menu>
        <div slot="trigger"></div>
      </Sider>
      <Layout class="h100">
        <div :style="{ height: `calc(100% - 42px)` }" class=" pd">
          <div  class="scroll-y h100 card-style">
          <router-view />
          </div>
        </div>

        <div>
          <my-footer color="rgb(200,200,200)"></my-footer>
        </div>
      </Layout>
    </Layout>
  </div>
</template>

<script>
// @ is an alias to /src
import MyFooter from "@/components/MyFooter";
export default {
  name: "Home",
  components: { MyFooter },
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
      this.$router.push("/data/" + data);
    }
  }
};
</script>
<style lang="scss" scoped>
.card-style{
  background: #fff;
  border-radius: 4px;
  
}
.menu-item {
  text-align: center;
  color: #8391b8;
  padding: 10px 0;
  font-weight: 600;
  div {
    margin-top: 6px;
  }
}
</style>

