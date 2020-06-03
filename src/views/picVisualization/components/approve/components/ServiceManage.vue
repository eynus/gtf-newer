<template>
  <div>
    <div class="module-head">
      <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />
      <span class="ml">服务检索</span>
    </div>

    <!-- <Form ref="formInline" inline class="mt">
      <FormItem prop="name">
        <Input style placeholder="请输入服务名称关键字" />
      </FormItem>
      <FormItem>
        <Button type="primary">查询</Button>
      </FormItem>
    </Form>-->
    <Form
      ref="formInline"
      :model="formInline"
      inline
      style="margin-top:.75rem"
      class="search-box smzx-search-box"
      label-position="right"
      :label-width="remToPx(6.25)"
      width="100%"
    >
      <Row>
        <i-col :md="4" :xl="4" :xxl="4">
          <FormItem label="服务名称：">
            <Input v-model.trim="formInline.serviceName" placeholder="请输入" clearable />
          </FormItem>
        </i-col>
        <i-col :md="4" :xl="4" :xxl="4">
          <FormItem label="状态：" :label-width="remToPx(4)">
            <Select
              :clearable="true"
              v-model="formInline.serviceStatus"
              class="scroll dropdown"
              style="width:8.5rem"
            >
              <Option v-for="item in statusList" :value="item.id" :key="item.id">
                {{
                item.name
                }}
              </Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :md="4" :xl="4" :xxl="4">
          <FormItem label="服务类型：">
            <Select
              :clearable="true"
              v-model="formInline.type"
              class="scroll dropdown"
              style="width:8.5rem"
            >
              <Option v-for="item in typeList" :value="item.typeId" :key="item.typeId">
                {{
                item.typeName
                }}
              </Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :md="4" :xl="4" :xxl="4">
          <FormItem label="专题类型：">
            <Select v-model="formInline.type" class="scroll dropdown" style="width:8.5rem">
              <Option v-for="item in typeList" :value="item.typeId" :key="item.typeId">
                {{
                item.typeName
                }}
              </Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :md="8" :xl="6" :xxl="6">
          <FormItem label="发布时间：">
            <DatePicker
              type="daterange"
              :value="formInline.date"
              @on-change="handleDateChange"
              placeholder="请选择起止日期"
              :clearable="false"
              style="width:16.5rem"
            ></DatePicker>
          </FormItem>
        </i-col>
        <i-col span="2">
          <FormItem :label-width="remToPx(2)">
            <Button type="primary" class="smzx-search-btn" @click="handleSubmit">查询</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
    <Button type="primary" class="btn-margin">浏览</Button>
    <Button type="primary" @click="handleStart" class="btn-margin">启动</Button>
    <Button type="primary" @click="handleStop" class="btn-margin">停止</Button>
    <Button type="primary" @click="handleDelete" class="btn-margin">删除</Button>
    <Button type="primary" to="/data/service/register" class="btn-margin">注册</Button>
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
        <template slot="status" slot-scope="{row}">
          <div href="#" :style="`color:${row.serviceStatus==='0'?'#2d8cf0':'#f00'}`">{{row.status}}</div>
        </template>
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
    <my-delete :show="delModalFlag" @ok="confirmDel" @cancel="delModalFlag=false"></my-delete>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
import { format, subMonths } from "date-fns";
import MyDelete from "_c/delete";
import {
  getFWListPage,
  getListById,
  delFw,
  updateOver,
  updateStart
} from "@/api/dataManage/service";
export default {
  name: "serviceManage",
  props: {
    selectedId: String
  },
  computed: {
    selectedId() {
      return selectedId;
    }
  },
  data() {
    return {
      tableLoading: false,
      delModalFlag: false,
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
      selectedRowIds: [],
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
          title: "服务名称",
          key: "name",
          align: "center",
          width: remToPx(18),
          tooltip: true,
          sortable: true
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
      unstartedArr: [],
      startedArr: []
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
    this.getFWListPage();
  },
  computed: {},
  components: { MyDelete },
  methods: {
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
            data.list.forEach((item, index) => {
              this.dataPutIn.push({
                ...item,
                name: item.serviceName,
                status: this.statusList.find(it => it.id === item.serviceStatus)
                  .name,
                sevType: "-",

                themeType: "-",
                spaceType:
                  (item.dataType &&
                    this.typeList.find(it => it.typeId === item.dataType)
                      .typeName) ||
                  "-",
                time: format(item.releaseTime, "yyyy-MM-dd hh:mm:ss"),
                desc: item.serviceDesc,
                id: item.pkId
              });
              if (item.serviceStatus === "0") {
                this.startedArr.push(item.pkId + "");
              } else {
                this.unstartedArr.push(item.pkId + "");
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
    // 点击启动按钮
    handleStart() {
      if (this.selectedRowIds.length) {
        console.log(this.selectedRowIds, this.startedArr,_.intersection(this.selectedRowIds, this.startedArr).length);
        
        // 不包含已启动的选项
        if (_.intersection(this.selectedRowIds, this.startedArr).length) {
          this.$Message.info("您选择的服务中包含已启动项！");
        } else {
          updateStart({ checkbox: this.selectedRowIds.join(",") }).then(res => {
            const { data, code } = res.data;
            if (code === 1000) {
              //修改成功，再请求一次
              this.$Message.info("启动成功");
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
      this.selectedRowIds.push(row.id + "");
    },
    handleSelectRowAll(selection) {
      this.selectedRowIds = selection.map((item, index) => item.id+'');
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
.btn-margin {
  margin-left: 1rem;
}


</style>