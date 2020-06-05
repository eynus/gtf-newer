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
import { mapGetters } from "vuex";
export default {
  name: "dataManage",
  data() {
    return {
      dataManageList: [
        {
          name: "数据总览",
          key: "overview",
          show: false,
          icon: "iconfont  icon-shuju",
          id: "page_5_1"
        },
        {
          name: "查询浏览",
          key: "query",
          show: false,
          icon: "iconfont  icon-zaitu",
          id: "page_5_2"
        },
        {
          name: "服务管理",
          key: "service",
          show: false,
          icon: "iconfont  icon-fuwutiyanguanli",
          id: "page_5_3"
        },
        {
          name: "质检管理",
          key: "inspection",
          show: false,
          icon: "iconfont  icon-zhijianguanli",
          id: "page_5_4"
        }
      ]
    };
  },
  created() {},
  computed: {},
  watch: {},
  methods: {}
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

