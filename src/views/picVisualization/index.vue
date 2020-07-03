<template>
  <Layouts :dataList="dataManageList"></Layouts>
</template>

<script>
import Layouts from '@/components/Layouts'
export default {
  name: "pic",
  components: {
    Layouts
  },
  data() {
    return {
      dataManageList: [
        {
          name: "现状一张图",
          key: "situation",
          icon: "iconfont  icon-ditu-shi",
          id: "page_1_1"
        },
        {
          name: "规划一张图",
          key: "plan",
          icon: "iconfont  icon-ditu2",
          id: "page_1_2"
        },
        {
          name: "审批一张图",
          key: "approve",
          icon: "iconfont icon-resource-base",
          id: "page_1_3"
        },
        {
          name: "监管一张图",
          key: "supervision",
          icon: "iconfont icon-jianguan",
          id: "page_1_4"
        },
        {
          name: "预警一张图",
          key: "warning",
          icon: "iconfont  icon-jinggaowarning19",
          id: "page_1_5"
        }
      ]
    };
  },
};
</script>
