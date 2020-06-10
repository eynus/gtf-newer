<template>
  <div>
    <!-- <div class="module-head">
      <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />
      <span class="ml">指标配置</span>
    </div>-->
    <card-title icon="iconfont  icon-type" title="指标配置"></card-title>

    <div class="flex mt">
      <Input
        search
        enter-button="搜索"
        v-model="inputVal"
        placeholder="Enter something..."
        style="width:400px"
      />
      <Button v-auth="['page_3_1_1']" type="primary" @click="handleAdd" class="btn-margin">添加指标</Button>
      <Button v-auth="['page_3_1_2']" type="primary" @click="handleUpdate" class="btn-margin">修改指标</Button>
      <Button v-auth="['page_3_1-3']" type="primary" @click="handleDelete" class="btn-margin">删除指标</Button>
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
      >
        <!-- <template slot="status" slot-scope="{row}">
          <div href="#" :style="`color:${row.serviceStatus==='0'?'#2d8cf0':'#f00'}`">{{row.status}}</div>
        </template>-->
      </Table>
      <div class="text-right mr-lg mt">
        <Page
          :total="page.total"
          @on-change="changePage"
          show-total
          show-elevator
          :current="page.current"
          :page-size="page.pageSize"
        ></Page>
      </div>
    </div>

    <config-manage-add-modal
      :type="addModalType"
      :show="modalFlag"
      @showModel="showModel"
      :data="addModalData"
      @handleAdd="getData"
    ></config-manage-add-modal>

    <my-delete :show="delModalFlag" @ok="confirmDel" @cancel="delModalFlag=false"></my-delete>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
import { format, subMonths } from "date-fns";
import MyDelete from "_c/delete";
import ConfigManageAddModal from "./ConfigManageAddModal";
import {
  getFWListPage,
  getListById,
  delFw,
  updateOver,
  updateStart
} from "@/api/dataManage/service";
import { getListPage } from "@/api/modelConfig/config";

export default {
  name: "configManage",
  props: {
    selectedId: Number
  },
  computed: {
    selectedId() {
      return selectedId;
    }
  },
  data() {
    return {
      inputVal: "",
      addModalData: {
        id: 0,
        class: "",
        code: "1",
        name: "",
        unit: "",
        fitrange: "",
        type: "",
        valrange: "",
        source: "",
        content: ""
      },
      addModalType: "",
      unstartedArr: [], //未启用集合
      startedArr: [], //已启用集合
      isRuleUpdate: false,
      selectedRowIds: [],
      modalFlag: false,
      tableLoading: false,
      delModalFlag: false,
      fitRangeList: [
        { id: 0, name: "全域" },
        { id: 1, name: "城区" }
      ],
      typeList: [
        { id: 0, name: "约束性" },
        { id: 1, name: "预期性" }
      ],
      unitList: [
        { id: 0, name: "平方千米(km²)" },
        { id: 1, name: "百分比(%)" },
        { id: 2, name: "平方米(㎡)" },
        { id: 3, name: "亩" }
      ],
      statusList: [
        { name: "正常", id: "0" },
        { name: "停止", id: "1" }
      ],
      typeList: [
        {
          typeId: "0",
          typeName: "矢量"
        },
        {
          typeId: "1",
          typeName: "栅格"
        },
        {
          typeId: "2",
          typeName: "表格"
        },
        {
          typeId: "3",
          typeName: "其他"
        }
      ],

      formInline: {
        serviceName: "",
        date: [
          format(subMonths(new Date(), 1), "yyyy-MM-dd"),
          format(new Date(), "yyyy-MM-dd")
        ],
        serviceStatus: ""
      },
      columnsPutIn: [
        {
          title: "选中",
          type: "selection",
          key: "time",
          align: "center",
          width: remToPx(5)
        },
        {
          type: "index",
          // key: "",
          align: "center"
          // width: remToPx(18)
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
          key: "unit",
          align: "center"
          // width: remToPx(8)
        },
        {
          title: "指标分类",
          key: "class",
          align: "center"
          // width: remToPx(8)
        },
        {
          title: "指标类型",
          key: "type",
          align: "center"
          // width: remToPx(8)
        },
        {
          title: "适用范围",
          key: "fitrange",
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
      dataPutIn: [],
      page: {
        current: 1,
        total: 0,
        pageSize: 10
      }
    };
  },
  watch: {
    selectedId(newVal, oldVal) {
      //重新請求数据 不为空则代表选择了模块
      if (newVal) {
        this.page.current = 1;
        this.getListById(newVal);
      }
    }
  },
  created() {
    this.getData();
  },
  computed: {},
  components: { MyDelete, ConfigManageAddModal },
  methods: {
    getData() {
      getListPage({
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        queryTerms: {
          pkZbflId: this.selectedId,
          zbmxName: this.inputVal
        }
      }).then(res => {
        const { code, data } = res.data;
        if (code === 1000) {
          this.page.total = data.total;
          if (data.records.length) {
            data.records.forEach(it2 => {
              this.dataPutIn.push({
                // ...it2,
                name: it2.zbmxName,
                code: it2.zbmxCode,
                unit: this.unitList.find(it => it.id === it2.zbmxZbdw).name,
                class: it2.pkZbflId,
                valrange: it2.zbmxZyfw,
                max: it2.zbmxYz,
                fitrange: this.fitRangeList.find(it => it.id === it2.zbmxZbfw).name,
                type:
                  (it2.dataType &&
                    this.typeList.find(it => it.id === it2.zbmxType)
                      .typeName) ||
                  "-",
                source: it2.zbmxZbly,
                content: it2.zbmxZbhy,
                id: it2.pkId
              });
              if (it2.serviceStatus === "0") {
                this.startedArr.push(it2.pkId + "");
              } else {
                this.unstartedArr.push(it2.pkId + "");
              }
            });
          } else {
            this.dataPutIn = [];
          }
        }
      });
    },
    // 分页查询模块服务列表
    getListById(id) {
      let postData = {
        identification: id,
        serviceName: this.formInline.serviceName,
        serviceStatus: this.formInline.serviceStatus
          ? this.formInline.serviceStatus
          : "",
        startTime: this.formInline.date[0],
        endTime: this.formInline.date[1],
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        pkId: "",
        createdBy: "",
        serviceDesc: "",
        createdTime: "",
        releaseTime: "",
        rkId: "",
        updatedBy: "",
        updatedTime: "",
        validity: ""
      };

      getListById(postData).then(res => {
        const { data, code } = res.data;
        this.dataPutIn = [];
        this.unstartedArr = [];
        this.startedArr = [];
        this.tableLoading = false;
        if (code === 1000) {
          this.page.total = data.total;
          if (data.list.length) {
            console.log(it2, "it2");

            data.list.forEach(it2 => {
              this.dataPutIn.push({
                ...it2,
                name: it2.serviceName,
                code: "-",
                unit: this.statusList.find(it => it.id === it2.serviceStatus)
                  .name,
                class: "-",
                valrange: "-",
                max: "-",
                fitrange: "-",
                type:
                  (it2.dataType &&
                    this.typeList.find(it => it.typeId === it2.dataType)
                      .typeName) ||
                  "-",
                source: format(it2.releaseTime, "yyyy-MM-dd hh:mm:ss"),
                content: it2.serviceDesc,
                id: it2.pkId
              });
              if (it2.serviceStatus === "0") {
                this.startedArr.push(it2.pkId + "");
              } else {
                this.unstartedArr.push(it2.pkId + "");
              }
            });
            // }
          } else {
            this.dataPutIn = [];
          }
        }
      });
    },
    //分页查询服务列表
    getFWListPage() {
      this.tableLoading = true;
      let postData = {
        serviceName: this.formInline.serviceName,
        serviceStatus: this.formInline.serviceStatus
          ? this.formInline.serviceStatus
          : "",
        startTime: this.formInline.date[0],
        endTime: this.formInline.date[1],
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        pkId: 0,
        identification: 0,
        createdBy: "",
        serviceDesc: "",
        createdTime: "",
        releaseTime: "",
        rkId: "",
        updatedBy: "",
        updatedTime: "",
        validity: ""
      };

      getFWListPage(postData).then(res => {
        const { data, code } = res.data;
        this.dataPutIn = [];
        this.unstartedArr = [];
        this.startedArr = [];
        this.tableLoading = false;
        if (code === 1000) {
          this.page.total = data.total;
          if (data.list.length) {
            data.list.forEach(it2 => {
              this.dataPutIn.push({
                ...it2,
                name: it2.serviceName,
                code: "-",
                unit: this.statusList.find(it => it.id === it2.serviceStatus)
                  .name,
                class: "-",
                valrange: "-",
                max: "-",
                fitrange: "-",
                type:
                  (it2.dataType &&
                    this.typeList.find(it => it.typeId === it2.dataType)
                      .typeName) ||
                  "-",
                source: format(it2.releaseTime, "yyyy-MM-dd hh:mm:ss"),
                content: it2.serviceDesc,
                id: it2.pkId
              });
              if (it2.serviceStatus === "0") {
                this.startedArr.push(it2.pkId + "");
              } else {
                this.unstartedArr.push(it2.pkId + "");
              }
            });
          } else {
            this.dataPutIn = [];
          }
        }
      });
    },
    // 点击查询按钮
    handleSubmit() {
      this.page.current = 1;
      this.getFWListPage();
    },

    //切换页数
    changePage(index) {
      this.page.current = index;
      if (this.selectedId) {
        this.getListById(this.selectedId);
      } else {
        this.getFWListPage();
      }
    },
    //选择日期变化
    handleDateChange(e) {
      this.formInline.date = e;
    },
    // 添加规则
    handleAdd() {
      this.addModalData = {
        id: this.selectedId,
        class: this.selectedId,
        code: "A1",
        name: "",
        unit: 0,
        fitrange: 0,
        type: 0,
        valrange: "",
        source: "",
        content: ""
      };
      this.addModalType = "add";
      this.modalFlag = true;
    },
    // 修改规则
    handleUpdate() {
      this.addModalData = {
        id: this.selectedId,
        class: this.selectedId,
        code: "A1",
        name: "33",
        unit: 0,
        fitrange: 0,
        type: 0,
        valrange: "77",
        source: "88",
        content: "99"
      };
      // 判断是否只选了一个
      if (this.selectedRowIds.length) {
        if (this.selectedRowIds.length === 1) {
          this.modalFlag = true;
          this.addModalType = "update";
          // this.isRuleUpdate = true;
          // this.modalFlag = true;
          // this.activeRow = this.tableData.find(
          //   item => String(item.pkId) === this.selectedRowIds[0]
          // );
          // this.$set(this.modalForm, "pathChildNodeId", this.activeRow.id);
          // let rdIdentify = JSON.parse(this.activeRow.rdIdentify);
          // this.$set(
          //   this.modalForm,
          //   "dataPropDefine",
          //   rdIdentify.dataPropDefine
          // );
          // this.$set(this.modalForm, "path", rdIdentify.path);
        } else {
          this.$Message.info("修改操作只针对单个规则！请重新选择。");
        }
      } else {
        this.$Message.info("请选择所要修改的规则");
      }
    },
    // 确认删除
    confirmDel() {
      delFw({ ids: this.selectedRowIds.join(",") }).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.delModalFlag = false;
          this.$Message.info("删除成功");
          this.selectedRowIds = [];
          this.getFWListPage();
        }
      });
    },
    // 点击删除按钮
    handleDelete() {
      if (this.selectedRowIds.length) {
        this.delModalFlag = true;
      } else {
        this.$Message.info("请选择服务");
      }
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
    },
    showModel(val) {
      if (!val) {
        this.modalFlag = false;
        this.addModalType = "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-margin {
  margin-left: 1rem;
}
</style>
