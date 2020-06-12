<template>
  <div class="h100 bg-white">
    <card-title icon="iconfont  icon-type" title="指标数据查看"></card-title>
    <div class="pd">
      <div class="search-box position-r">
        <div class="top flex flex-sb">
          <div class="top-left">
            <span>地区：</span>
            <span  class="mr-lg">昭阳区</span>
            <span>指标分类：</span>
            <span>底线管控</span>
          </div>
          <div class="top-right">
            <Button type="primary" class="btn-margin">导出表格</Button>
            <Button type="normal" class="btn-margin ml" @click="handleShowSearchBox">显示筛选条件</Button>
          </div>
        </div>
        <div class="bottom" v-if="showSearchBox">222</div>
      </div>

      <div class="mt">
        <Table
          :loading="tableLoading"
          border
          size="small"
          :columns="columnsPutIn"
          :data="dataPutIn"
          ref="selection"
          @on-select="handleSelectRow"
          @on-select-cancel="handleCancelRow"
          @on-select-all="handleSelectRowAll"
          @on-select-all-cancel="handleCancelRowAll"
        ></Table>
      </div>
    </div>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
export default {
  name: "plan",
  data() {
    return {
      tableLoading: false,
      selectedRowIds: [],
      showSearchBox: false,
      columnsPutIn: [
        {
          title: "选中",
          type: "selection",
          key: "time",
          align: "center",
          width: remToPx(4)
        },
        {
          type: "index",
          title: "序号",
          align: "center",
          width: remToPx(4)
        },

        {
          title: "指标名称",
          key: "name",
          align: "center",
          // width: remToPx(18),
          tooltip: true,
          sortable: true
        },
        {
          title: "指标编码",
          key: "code",
          align: "center"
          // width: remToPx(6)
        },
        {
          title: "指标单位",
          key: "unitName",
          align: "center"
          // width: remToPx(8)
        },
        {
          title: "指标分类",
          key: "classname",
          align: "center"
          // width: remToPx(8)
        },
        {
          title: "指标类型",
          key: "typeName",
          align: "center"
          // width: remToPx(8)
        },
        {
          title: "适用范围",
          key: "fitrangeName",
          align: "center"
          // width: remToPx(8)
        },
        {
          title: "指标内涵",
          key: "content",
          align: "center",
          // width: remToPx(14),
          sortable: true
        },
        {
          title: "指标来源",
          key: "source",
          align: "center",
          tooltip: true
          // width: remToPx(12)
        },
        {
          title: "值域范围",
          key: "valrange",
          align: "center",
          tooltip: true
          // width: remToPx(12)
        },
        {
          title: "阈值",
          key: "max",
          align: "center",
          tooltip: true
          // width: remToPx(12)
        }
      ],
      dataPutIn: []
    };
  },
  components: {},
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    // 显示筛选条件
    handleShowSearchBox() {
      this.showSearchBox = !this.showSearchBox;
    },
    // 选择某一行
    handleSelectRow(selection, row) {
      this.selectedRowIds.push(row.id + "");
    },
    handleSelectRowAll(selection) {
      this.selectedRowIds = selection.map((item, index) => item.id + "");
    },
    handleCancelRow(selection, row) {
      for (let i = 0; i < this.selectedRowIds.length; i++) {
        if (this.selectedRowIds[i] === row.id + "") {
          this.selectedRowIds.splice(i, 1);
        }
      }
    },
    handleCancelRowAll(selection) {
      this.selectedRowIds = [];
    }
  }
};
</script>
<style lang="scss" scoped>
.search-box {
  padding: 1rem;
  border-bottom: 1px solid $text-normal;
  .bottom{
    position: absolute;
    left: 0;
    top: 3rem;
    width: 100%;
    height: 20rem;
    z-index: 9;
    background-color: rgba(0,0,0,0.4);
  }
}
</style>