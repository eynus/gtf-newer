<template>
  <Layouts :dataList="dataManageList"></Layouts>
</template>

<script>
import Layouts from '@/components/Layouts'
export default {
  name: "pic",
  components: {
    Layouts: Layouts
  },
  data() {
    return {
      dataManageList: [
        {
          name: "指标配置",
          key: "config",
          icon: "iconfont  icon-ditu-shi",
          id: "page_1_1"
        },
        {
          name: "数据管理",
          key: "data",
          icon: "iconfont  icon-ditu2",
          id: "page_1_2"
        },
        {
          name: "字典管理",
          key: "dict",
          icon: "iconfont icon-resource-base",
          id: "page_1_3"
        },
        {
          name: "GP服务管理",
          key: "gpservice",
          icon: "iconfont icon-jianguan",
          id: "page_1_4"
        },
        {
          name: "模型服务管理",
          key: "model",
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

