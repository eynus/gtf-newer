<template>
  <Layouts :dataList="dataManageList"></Layouts>
</template>

<script>
import Layouts from '@/components/Layouts'
export default {
  name: "dataManage",
  components: {
    Layouts
  },
  data() {
    return {
      dataManageList: []
    };
  },
  created() {
    this.dataManageList = [
        {
          name: "数据总览",
          key: "overview",
          icon: "iconfont  icon-shuju",
          // iconUrl: require("../../assets/img/dataManage/overview.png"),
          // iconActiveUrl: require("../../assets/img/dataManage/overview_active.png"),
          id: "page_5_1"
        },
        {
          name: "查询浏览",
          key: "query",
          icon: "iconfont  icon-zaitu",
          // iconUrl: require("../../assets/img/dataManage/query.png"),
          // iconActiveUrl: require("../../assets/img/dataManage/query_active.png"),
          id: "page_5_2"
        },
        {
          name: "服务管理",
          key: "service",
          icon: "iconfont  icon-fuwutiyanguanli",
          // iconUrl: require("../../assets/img/dataManage/service.png"),
          // iconActiveUrl: require("../../assets/img/dataManage/service_active.png"),
          id: "page_5_3"
        },
        {
          name: "质检管理",
          key: "inspection",
          icon: "iconfont  icon-zhijianguanli",
          // iconUrl: require("../../assets/img/dataManage/inspection.png"),
          // iconActiveUrl: require("../../assets/img/dataManage/inspection_active.png"),
          id: "page_5_4"
        }
      ]
  }
};
</script>

