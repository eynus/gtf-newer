<template>
  <div class="home h100">
    <Layout style="height:100%;">
      <Sider class="h100" :width="`${remToPx(5.25)}`" :style="{background: '#fff'}">
        <Menu
            :active-name="activeMenuItem"
            theme="light"
            :width="`100%`"
            style="height:100%"
            :class="menuitemClasses"
            @on-select="changeRoute"
        >
          <template v-for="(item,index ) in dataManageList">
            <MenuItem :name="item.key" class="menu-item mb" :key="`dml_${index}`">
              <Icon
                  :custom="item.icon"
                  size="24"
                  :color="activeMenuItem===`${item.key}`?'#2d8cf0':'#8391B8'"
              />
              <div>{{item.name}}</div>
            </MenuItem>
          </template>
        </Menu>
        <!-- <div slot="trigger"></div> -->
      </Sider>
      <Layout class="h100">
        <div
            :style="{ height: `calc(100% - ${remToPx(2.8)}px)` }"
            style="box-sizing: border-box;"
            class="pd"
        >
          <div class="h100 card-style">
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
  import MyFooter from "@/components/MyFooter";
  const sidebar = [
    {
      name: "用户管理",
      key: "user",
      icon: "iconfont  icon-overview",
      id: "page_4_1"
    }, {
      name: "角色管理",
      key: "role",
      icon: "iconfont  icon-overview",
      id: "page_4_2"
    }, {
      name: "日志管理",
      key: "log",
      icon: "iconfont  icon-overview",
      id: "page_4_4"
    }, {
      name: "数据备份",
      key: "database",
      icon: "iconfont  icon-overview",
      id: "page_4_3"
    }, {
      name: "系统监控",
        key: "monitor",
      icon: "iconfont  icon-overview",
      id: "page_4_5"
    }
  ]
  export default {
    name: 'system',
    components: {
      MyFooter
    },
    data() {
      return {
        activeMenuItem: "user",
        dataManageList: []
      };
    },
    computed: {
      menuitemClasses() {
        return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.dataManageList = sidebar.filter(item => item)
        this.activeMenuItem = this.$route.name.toLocaleLowerCase()
      },
      changeRoute(data) {
        this.activeMenuItem = data;
        if (data === "inspection") {
          this.$router.push("/data/inspection/mathBasic?id=1");
        } else {
          this.$router.push("/system/" + data);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-style {
    background: #fff;
    border-radius: 4px;
  }
  .menu-item {
    & + .menu-item {
      margin-top: 1.5rem;
    }
    text-align: center;
    color: #8391b8;
    padding: 10px 0;
    // font-weight: 600;
    div {
      margin-top: 6px;
    }
  }
</style>
