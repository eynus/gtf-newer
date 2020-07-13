<template>
  <div>
    <div ref="opt" class="mt">
      <div class="g-button-wrapper">
        <button v-auth="['page_5_4_1']" class="g-button" @click="handleStartRule">
          <Icon :type="$btn.play" /> 启用</button>
        <button v-auth="['page_5_4_5']" class="g-button" @click="handleStopRule">
          <Icon :type="$btn.stop" /> 停止</button>
        <button v-auth="['page_5_4_2']" class="g-button" @click="open">
          <Icon :type="$btn.create" /> 新建</button>
        <button v-auth="['page_5_4_3']" class="g-button" @click="edit">
          <Icon :type="$btn.edit" /> 修改</button>
        <button v-auth="['page_5_4_4']" class="g-button" @click="handleDeleteRule">
          <Icon :type="$btn.del" /> 删除</button>
      </div>
    </div>
    <Table
        class="inspection-table"
        :height="tbhopt"
        width="100%"
        border
        stripe
        size="small"
        :columns="tableColumns"
        :data="tableData"
        ref="selection"
        @on-select="handleSelectRow"
        @on-select-cancel="handleCancelRow"
        @on-select-all="handleSelectRowAll"
        @on-select-all-cancel="handleCancelRowAll"
    >
      <template slot="ruleStatusSlot" slot-scope="{row,index}">
        <span>{{row.ruleStatus}}</span>
      </template>
    </Table>
    <Page
      class="pagination"
      :total="page.total"
      @on-change="changePage"
      @on-page-size-change="changePageSize"
      show-total
      show-sizer
      show-elevator
      :current="page.current"
      :page-size="page.pageSize"
    ></Page>
    <my-delete :show="delModalFlag" @ok="confirmDel" @cancel="quitDel"></my-delete>
    <PropStructEdit ref="edit" :dataPaths="dataPaths" @close="close"></PropStructEdit>
  </div>
</template>
<script>
import {
  addRules,
  updateRules,
  getVRRKeyListById
} from "@/api/dataManage/inspection";
import { remToPx } from "@/utils/common";
import { getPaths } from "@/api/dataManage/overview";
import PropStructEdit from '../edit/PropStructEdit'
import MyDelete from "_c/delete";
import { InspectionMixins } from "../inspection-mixins.js";
import { ivtable } from "@/mixin/table";

const handleRawData = data => {
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({});
    if (data[i].children) {
      newData[i].children = handleRawData(data[i].children);
    }
    newData[i].label = data[i].dataName;
    newData[i].pkId = data[i].pkId;
    newData[i].value = data[i].dataName;
  }
  return newData;
};
export default {
  name: "propstruct",
  mixins: [InspectionMixins, ivtable],
  components: { MyDelete, PropStructEdit },
  data() {
    return {
      canISelect: true,
      activeRow: {},
      activeKeyRow: {},
      selectedKeyRowIds: [],
      tableColumns: [
        {
          title: "选中",
          type: "selection",
          key: "time",
          align: "center",
          width: remToPx(10)
        },
        {
          title: "规则描述",
          key: "rulesName"
          // align: "center"
        },
        {
          title: "必须应用规则",
          slot: "ruleStatusSlot",
          align: "center",
          width: remToPx(10)
        }
      ],
      tableData: [],
      dataPaths: [],
    };
  },
  created() {
    this.getPaths();
    // this.activeRow.rulesCode = this.$route.query.rules_code;
  },
  methods: {
    open() {
      this.$refs.edit.insert()
    },
    edit() {
      if (this.selectedRowIds.length) {
        if (this.selectedRowIds.length !== 1) {
          this.$Message.info("修改操作只针对单个规则！请重新选择。")
          return 0
        }
      } else {
        this.$Message.info("请选择所要修改的规则");
        return 0
      }
      this.isRuleUpdate = true;
      this.modalFlag = true;
      this.activeRow = this.tableData.find(
        item => String(item.pkId) === this.selectedRowIds[0]
      );
      this.$refs.edit.edit(this.activeRow)
    },
    close() {
      this.selectedRowIds = []
      this.getZJListPageById()
    },
    //选中路径变化
    getPaths() {
      getPaths().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          let raw = (data && data.data) || [];
          let result = handleRawData(raw);
          this.dataPaths = result;
          console.log(this.dataPaths)
        }
      });
    },
    // 选择某一行-字段
  },
};
</script>
<style lang="scss" scoped>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.modal-item {
  .title {
    font-weight: bold;
    &:before {
      content: "";
      display: inline-block;
      width: 0.625rem;
      height: 0.625rem;
      background-color: #2d8cf0;
      // border-radius: 50%;
      margin-right: 0.375rem;
    }
  }
  .right-box {
    min-height: 15rem;
    width: 48rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    // border-radius: 4px;
    padding: 1.25rem 0;
    margin-left: 2rem;
    // margin-right: 2rem;
    .divided {
      margin-top: 1.75rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding-top: 1rem;
    }
  }
}
</style>
