<template>
  <div class="home h100">
    <Layout style="height:100%;">
      <Sider class="h100" :width="`${remToPx(6.25)}`" :style="{background: '#fff'}">
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
  name: "pic",
  data() {
    return {
      dataManageList: [
        {
          name: "现状一张图",
          key: "situation",
          show: false,
          icon: "iconfont  icon-ditu-shi",
          id: "page_1_1"
        },
        {
          name: "规划一张图",
          key: "plan",
          show: false,
          icon: "iconfont  icon-ditu2",
          id: "page_1_2"
        },
        {
          name: "审批一张图",
          key: "approve",
          show: false,
          icon: "iconfont icon-resource-base",
          id: "page_1_3"
        },
        {
          name: "监管一张图",
          key: "supervision",
          show: false,
          icon: "iconfont icon-jianguan",
          id: "page_1_4"
        },
        {
          name: "预警一张图",
          key: "warning",
          show: false,
          icon: "iconfont  icon-jinggaowarning19",
          id: "page_1_5"
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

