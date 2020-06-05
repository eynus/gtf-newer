<template>
  <div class="home h100">
    <Layout style="height:100%;">
      <Sider class="h100" :width="`${remToPx(5.25)}`" :style="{background: '#fff'}">
        <my-side-bar :dataList="dataManageList"></my-side-bar>
      </Sider>
      <Layout class="h100">
        <div :style="{ height: `calc(100% - ${remToPx(3.2)}px)` }" class="pd-lg right-up-wrapper">
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
// @ is an alias to /src
// import MyFooter from "@/components/MyFooter";
// import MySideBar from "@/components/mySideBar";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  // components: { MyFooter, MySideBar },
  data() {
    return {
      activeMenuItem: "overview",
      dataManageList: [
        {
          name: "数据总览",
          key: "overview",
          show: false,
          icon: "iconfont  icon-overview",
          id: "page_5_1"
        },
        {
          name: "查询浏览",
          key: "query",
          show: false,
          icon: "iconfont  icon-file",
          id: "page_5_2"
        },
        {
          name: "服务管理",
          key: "service",
          show: false,
          icon: "iconfont  icon-jiangbei",
          id: "page_5_3"
        },
        {
          name: "质检管理",
          key: "inspection",
          show: false,
          icon: "iconfont  icon-setting",
          id: "page_5_4"
        }
      ]
    };
  },
  created() {
    this.activeMenuItem = this.$route.path.replace("/data/", "").split("/")[0];
    //判断当前用户是否有权限显示左侧列表menu
    let dataSiderAuth = this.role.find(
      (item, index) => item.resIdentif === "main_menu_5"
    ).childs;
    //设置show
    dataSiderAuth.forEach((item, index) => {
      let targetIndex = this.dataManageList.findIndex(
        (data, idx) => data.id === item
      );
      this.dataManageList[targetIndex]["show"] = true;
    });
  },
  computed: {
    ...mapGetters(["role"]),
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
      if (data === "inspection") {
        this.$router.push("/data/inspection/mathBasic?id=1");
      } else {
        this.$router.push("/data/" + data);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.right-up-wrapper {
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25) inset;
  background-color: $wrap-bg;
}
.card-style {
  background: transparent;
  // border-radius: 4px;
}
</style>

