<template>
  <div>
    <div ref="opt">
      <div>
        <Button  class="btn-margin">启动</Button>
        <Button  class="btn-margin">停止</Button>
        <Button  class="btn-margin">删除</Button>
        <Button to="/data/service/register" class="btn-margin">注册</Button>
      </div>
    </div>
    <div class="mt">

    </div>
  </div>
</template>
<script>

export default {
  name: "serviceManage",
  props: {
    selectedId: String
  },
  data() {
    return {
      tableLoading: false,
      columnsPutIn: [
        {
          title: "选中",
          type: "selection",
          key: "time",
          align: "center",
          width: remToPx(5)
        },
        {
          title: "服务名称",
          key: "name",
          align: "center",
          width: remToPx(18),
          tooltip: true,
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          width: remToPx(6),
          render: (h, params) => {
            return h('div', serviceStatus.handler(params.row.serviceStatus))
          }
        },
        {
          title: "服务类型",
          key: "sevType",
          align: "center",
          width: remToPx(8)
        },
        {
          title: "专题类型",
          key: "themeType",
          align: "center",
          width: remToPx(8)
        },
        {
          title: "空间类型",
          key: "spaceType",
          align: "center",
          width: remToPx(8)
        },
        {
          title: "发布时间",
          key: "time",
          align: "center",
          width: remToPx(14),
          sortable: true
        },
        {
          title: "服务描述",
          key: "desc",
          align: "center",
          tooltip: true
          // width: remToPx(12)
        }
      ],
      dataPutIn: [],
      page: {
        current: 1,
        total: 0,
        pageSize: 10
      },

    };
  },
  watch: {
    selectedId(newVal, oldVal) {
      //重新請求数据 不为空则代表选择了模块
      console.log(newVal)
      if (newVal) {
        this.page.current = 1;
        this.getListById(newVal);
      }
    }
  },

  methods: {

    //选择日期变化
    handleDateChange(e) {
      this.formInline.date = e;
    },

  }
};
</script>
<style lang="scss" scoped>
.btn-margin {
  margin-left: 1rem;
}
</style>
