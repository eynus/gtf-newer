<template>
  <div class="home h100">
    <Layout style="height:100%;">
      <Sider class="h100" :width="`${remToPx(6.25)}`" :style="{background: '#fff'}">
      <!-- <Sider class="h100" :width="`${remToPx(5.25)}`" :style="{background: '#fff'}"> -->
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
  // components: { MyFooter ,MySideBar},
  data() {
    return {
      activeMenuItem: "",
      dataManageList: [
        {
          name: "现状一张图",
          key: "situation",
          show: false,
          icon: "iconfont  icon-xianzhuangyizhangtu",
          id: "page_1_1"
        },
        {
          name: "规划一张图",
          key: "plan",
          show: false,
          icon: "iconfont  icon-guihuayizhangtu",
          id: "page_1_2"
        },
        {
          name: "审批一张图",
          key: "approve",
          show: false,
          icon: "iconfont  icon-shenpi",
          id: "page_1_3"
        },
        {
          name: "监管一张图",
          key: "supervision",
          show: false,
          icon: "iconfont  icon-jianguanyizhangtu",
          id: "page_1_4"
        },
        {
          name: "预警一张图",
          key: "warning",
          show: false,
          icon: "iconfont  icon-yujing",
          id: "page_1_5"
        }
      ]
    };
  },
  created() {
    this.activeMenuItem = this.$route.path.replace("/pic/", "").split("/")[0];
    //判断当前用户是否有权限显示左侧列表menu
    let dataSiderAuth = this.role.find(
      (item, index) => item.resIdentif === "main_menu_1"
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
        case "/pic/query":
        case "/pic/inspection":
        case "/pic/service":
        case "/pic/overview":
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
        this.$router.push("/pic/inspection/mathBasic?id=1");
      } else {
        this.$router.push("/pic/" + data);
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

