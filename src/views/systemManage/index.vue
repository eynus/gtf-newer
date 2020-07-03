<template>
  <Layouts :dataList="dataManageList"></Layouts>
</template>

<script>
import Layouts from '@/components/Layouts'
export default {
  name: "system",
  components: {
    Layouts
  },
  data() {
    return {
      activeMenuItem: "user",
      dataManageList: [
        {
          name: "用户管理",
          key: "user",
          icon: "iconfont  icon-yonghuguanli",
          id: "page_4_1"
        },
        {
          name: "角色管理",
          key: "role",
          icon: "iconfont  icon-quanxianguanli",
          id: "page_4_2"
        },
        {
          name: "日志管理",
          key: "log",
          icon: "iconfont  icon-rizhiguanli",
          id: "page_4_3"
        },
        {
          name: "数据备份",
          key: "database",
          icon: "iconfont  icon-shujubeifen",
          id: "page_4_4"
        },
        {
          name: "系统监控",
          key: "monitor",
          icon: "iconfont  icon-xitongjiankong",
          id: "page_4_5"
        }
      ]
    };
  },
};
</script>

<style lang="scss" scoped>
.right-up-wrapper {
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25) inset;
  background-color: $wrap-bg;
}
.card-style {
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
