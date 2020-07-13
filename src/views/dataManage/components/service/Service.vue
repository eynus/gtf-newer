<template>
  <div class="h100 position-r bg-white">
    <div ref="opt" class="opt">
      <div class="g-button-wrapper">
        <button class="g-button">
          <Icon :type="$btn.look" /> 浏览</button>
        <button v-auth="['page_5_3_1']" @click="handleStart" class="g-button">
          <Icon :type="$btn.play" /> 启用</button>
        <button v-auth="['page_5_3_2']" @click="handleStop"  class="g-button">
          <Icon :type="$btn.stop" /> 停止</button>
        <button v-auth="['page_5_3_3']" @click="handleDelete" class="g-button">
          <Icon :type="$btn.del" /> 删除</button>
        <button v-auth="['page_5_3_4']" @click="register" class="g-button">
          <Icon :type="$btn.register" /> 注册</button>
      </div>
      <Query ref="query" :formArr="queryForm" @query="onSearch"></Query>
    </div>
     <Row>
      <Col span="4" class="h100 zt-scroll-y">
        <div class="pd h100">
          <my-tree :tree="tree" @handleSelect="handleSelect" type="service"></my-tree>
        </div>
      </Col>
      <Col span="20 h100">
        <div class="pd">
          <Table
              border
              stripe
              size="small"
              ref="selection"
              :height="tbhopt"
              :columns="columnsPutIn"
              :loading="tableLoading"
              :data="dataPutIn"
              @on-select="handleSelectRow"
              @on-select-cancel="handleCancelRow"
              @on-select-all="handleSelectRowAll"
              @on-select-all-cancel="handleCancelRowAll"
          >
            <template slot-scope="{ row, index }" slot="desc">
              {{ row.tdataFwgl && row.tdataFwgl.serviceName }}
            </template>
            <template slot-scope="{ row, index }" slot="time">
              {{ row.tdataFwgl && row.tdataFwgl.releaseTime }}
            </template>
            <template slot-scope="{ row, index }" slot="status">
              {{ row.tdataFwgl && row.tdataFwgl.serviceStatus }}
            </template>
          </Table>
        </div>
      </Col>
    </Row>
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
    <my-delete :show="delModalFlag" @ok="confirmDel" @cancel="delModalFlag=false"></my-delete>
  </div>
</template>
<script>
  import { Validator } from 'vee-validate';
  import MyTree from "./components/MyTree";
import {remToPx} from "@/utils/common";
import {serviceStatus} from "@/filters/dataManage";
import { ivtable } from '@/mixin/table'
import { format, subMonths } from "date-fns";
import MyDelete from "_c/delete";
import { getFWListPage, getListById, delFw, updateOver, updateStart, getmlService, insertServer} from "@/api/dataManage/service";

export default {
  name: "Home",
  mixins: [ivtable],
  data() {
    return {
      tableLoading: false,
      delModalFlag: false,
      tree: [],
      unstartedArr: [],
      startedArr: [],
      formInline: [],
      selectedRowIds: [],
      queryForm: [
        {
          type: 1,
          field: 'dataName',
          title: '服务名称',
        },
        {
          type: 2,
          field: 'serviceStatus',
          title: '状态',
          data: [
            { label: "正常", value: "0" },
            { label: "停止", value: "1" },
            { label: "未注册", value: "2" }
          ]
        },
        {
          type: 2,
          field: 'dataType',
          title: '服务类型',
          data: [
            {
              value: "0",
              label: "矢量"
            },
            {
              value: "1",
              label: "栅格"
            }
          ]
        },
      ],
      columnsPutIn: [
        {
          title: "选中",
          type: "selection",
          key: "time",
          align: "center",
          fixed: 'left',
          width: remToPx(5)
        },
        {
          title: "序号",
          type: "index",
          align: "center",
          fixed: 'left',
          width: remToPx(5)
        },
        {
          title: "服务名称",
          key: "dataName",
          align: "center",
          width: remToPx(15),
          fixed: 'left',
          tooltip: true,
        },
        {
          title: "状态",
          slot: "status",
          align: "center",
          width: remToPx(6)
        },
        {
          title: "服务类型",
          key: "sevType",
          align: "center",
          width: remToPx(8)
        },
        {
          title: "发布时间",
          slot: 'time',
          align: "center",
          minWidth: remToPx(14),
        },
        {
          title: "服务描述",
          key: "tdataFwgl",
          slot: 'desc',
          align: "center",
          tooltip: true,
          minWidth: remToPx(14),
        }
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
      dataPutIn: [],
      gData: [],
      selectedId: ''
    };
  },
  components: { MyTree, MyDelete },
  computed: {},
  methods: {
    register() {
      if (!this.selectedRowIds.length) {
        this.$Message.info("请选择数据")
        return
      }
      insertServer({ ids: this.selectedRowIds.join(",") }).then(res => {
        let { data, code } = res.data;
        if (code === 1000) {
          this.$Message.info("发布成功！")
          this.getFWListPage()
        }
      });
    },
    onSearch(data) {
      this.formInline = data
      // if(this.formInline.date.length) {
      //   this.formInline.startTime = this.formInline.date[0]
      //   this.formInline.endTime = this.formInline.date[1]
      //   delete this.formInline.date
      // }
      this.getmlService()
      // this.getFWListPage()
    },
    handleSelect(e) {
      this.selectedId = e.identification;
    },
    // 点击启动按钮
    handleStart() {
      if (this.selectedRowIds.length) {
        // 不包含已启动的选项
        if (_.intersection(this.selectedRowIds, this.startedArr).length) {
          this.$Message.info("您选择的服务中包含已启用项！");
        } else {
          updateStart({ checkbox: this.selectedRowIds.join(",") }).then(res => {
            const { data, code } = res.data;
            if (code === 1000) {
              //修改成功，再请求一次
              this.$Message.info("启用成功");
              this.selectedRowIds = [];
              this.getFWListPage();
            }
          });
        }
      } else {
        this.$Message.info("请选择服务");
      }
    },
    // 点击停止按钮
    handleStop() {
      if (this.selectedRowIds.length) {
        if (_.intersection(this.selectedRowIds, this.unstartedArr).length) {
          this.$Message.info("您选择的服务中包含已停止项！");
        } else {
          updateOver({ checkbox: this.selectedRowIds.join(",") }).then(res => {
            const { data, code } = res.data;
            if (code === 1000) {
              this.$Message.info("停止成功");
              this.selectedRowIds = [];
              this.getFWListPage();
            }
          });
        }
      } else {
        this.$Message.info("请选择服务");
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
      this.selectedRowIds.push(row.pkId + "");
    },
    handleSelectRowAll(selection) {
      this.selectedRowIds = selection.map((item, index) => item.pkId + "");
    },
    handleCancelRow(selection, row) {
      for (let i = 0; i < this.selectedRowIds.length; i++) {
        if (this.selectedRowIds[i] === row.pkId + "") {
          this.selectedRowIds.splice(i, 1);
        }
      }
    },
    handleCancelRowAll(selection) {
      this.selectedRowIds = [];
    },
    // 分页查询模块服务列表
    getListById(id) {
      let postData = {
        identification: id,
        serviceName: this.formInline.serviceName,
        serviceStatus: this.formInline.serviceStatus
          ? this.formInline.serviceStatus
          : "",

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
      this.tableLoading = true;
      getListById(postData).then(res => {
        const { data, code } = res.data;
        this.dataPutIn = [];
        this.unstartedArr = [];
        this.startedArr = [];
        if (code === 1000) {
          this.page.total = data.total;
          this.tableLoading = false;
          if (data.list.length) {
            if (Array.isArray(data.list[0])) {
              data.list.forEach(it => {
                it.forEach(it2 => {
                  this.dataPutIn.push({
                    ...it2,
                    name: it2.serviceName,
                    status: this.statusList.find(
                      it => it.id === it2.serviceStatus
                    ).name,
                    sevType: "-",

                    themeType: "-",
                    spaceType:
                      (it2.dataType &&
                        this.typeList.find(it => it.typeId === it2.dataType)
                          .typeName) ||
                      "-",
                    time: format(it2.releaseTime, "yyyy-MM-dd hh:mm:ss"),
                    desc: it2.serviceDesc,
                    id: it2.pkId
                  });
                  if (it2.serviceStatus === "0") {
                    this.startedArr.push(it2.pkId + "");
                  } else {
                    this.unstartedArr.push(it2.pkId + "");
                  }
                });
              });
            } else {
              data.list.forEach(it2 => {
                this.dataPutIn.push({
                  ...it2,
                  name: it2.serviceName,
                  status: this.statusList.find(
                    it => it.id === it2.serviceStatus
                  ).name,
                  sevType: "-",

                  themeType: "-",
                  spaceType:
                    (it2.dataType &&
                      this.typeList.find(it => it.typeId === it2.dataType)
                        .typeName) ||
                    "-",
                  time: format(it2.releaseTime, "yyyy-MM-dd hh:mm:ss"),
                  desc: it2.serviceDesc,
                  id: it2.pkId
                });
                if (it2.serviceStatus === "0") {
                  this.startedArr.push(it2.pkId + "");
                } else {
                  this.unstartedArr.push(it2.pkId + "");
                }
              });
            }
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
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
      }
      getFWListPage(postData).then(res => {
        const { data, code } = res.data;
        this.dataPutIn = [];
        this.unstartedArr = [];
        this.startedArr = [];
        this.tableLoading = false;
        if (code === 1000) {
          this.page.total = data.total;
          this.dataPutIn = data.records
          // if (data.list.length) {
          //   data.list.forEach((item, index) => {
          //     this.dataPutIn.push({
          //       ...item,
          //       name: item.serviceName,
          //       status: this.statusList.find(it => it.id === item.serviceStatus)
          //         .name,
          //       sevType: "-",
          //       themeType: "-",
          //       spaceType:
          //         (item.dataType &&
          //           this.typeList.find(it => it.typeId === item.dataType)
          //             .typeName) ||
          //         "-",
          //       time: format(item.releaseTime, "yyyy-MM-dd hh:mm:ss"),
          //       desc: item.serviceDesc,
          //       id: item.pkId
          //     });
          //     if (item.serviceStatus === "0") {
          //       this.startedArr.push(item.pkId + "");
          //     } else {
          //       this.unstartedArr.push(item.pkId + "");
          //     }
          //   });
          // } else {
          //   this.dataPutIn = [];
          // }
        }
      });
    },
    // 点击查询按钮
    handleSubmit() {
      this.page.current = 1
      this.getFWListPage()
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
    changePageSize(val) {
      this.page.pageSize = val
      if (this.selectedId) {
        this.getListById(this.selectedId);
      } else {
        this.getFWListPage()
      }
    },
    // 服务树
    getmlService() {
      let param = {
        ...this.formInline
      }
      getmlService(param).then(res => {
        let { data, code } = res.data
        if (code === 1000) {
          this.tree = data.data
        }
      })
    }
  },
  mounted() {
    this.getmlService()
    this.getFWListPage()
    // const v = new Validator({
    //   FieldType: 'required'
    // })
    // v.localize('zh_CN', validate)
    // v.validateAll({'FieldType': null}).then(res => {
    //   console.log(v.errors.first('FieldType'))
    // })
  },
};
</script>
<style lang="scss" scoped>

</style>
