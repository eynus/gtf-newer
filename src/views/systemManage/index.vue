<template>
  <div class="home h100">
    <Layout style="height:100%;">
      <Sider class="h100" :width="`${remToPx(5.25)}`" :style="{background: '#fff'}">
        <my-side-bar :dataList="dataManageList"></my-side-bar>
      </Sider>
      <Layout class="h100">
        <div :style="{ height: `calc(100% - ${remToPx(3.2)}px)` }" class="pd-lg right-up-wrapper">
          <div class="h100 card-style bg-white">
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
import { mapGetters } from "vuex";

export default {
  name: "system",
  data() {
    return {
      activeMenuItem: "user",
      dataManageList: [
        {
          name: "用户管理",
          show: false,
          key: "user",
          icon: "iconfont  icon-overview",
          id: "page_4_1"
        },
        {
          name: "角色管理",
          show: false,
          key: "role",
          icon: "iconfont  icon-overview",
          id: "page_4_2"
        },
        {
          name: "日志管理",
          show: false,
          key: "log",
          icon: "iconfont  icon-overview",
          id: "page_4_3"
        },
        {
          name: "数据备份",
          show: false,
          key: "database",
          icon: "iconfont  icon-overview",
          id: "page_4_4"
        },
        {
          name: "系统监控",
          show: false,
          key: "monitor",
          icon: "iconfont  icon-overview",
          id: "page_4_5"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["role"])
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.activeMenuItem = this.$route.name.toLocaleLowerCase();

      //判断当前用户是否有权限显示左侧列表menu
      let dataSiderAuth = this.role.find(
        (item, index) => item.resIdentif === "main_menu_4"
      ).childs;
      // console.log(this.role,dataSiderAuth);

      //设置show
      dataSiderAuth.forEach((item, index) => {
        let targetIndex = this.dataManageList.findIndex(
          (data, idx) => data.id === item
        );
        this.dataManageList[targetIndex]["show"] = true;
      });
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
  /*background: transparent;*/
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
