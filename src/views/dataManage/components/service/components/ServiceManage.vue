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
        <i-col :md="5" :xxl="4">
          <FormItem label="服务名称：">
            <Input v-model.trim="formInline.serviceName" placeholder="请输入" clearable />
          </FormItem>
        </i-col>
        <i-col :md="3" :xxl="4">
          <FormItem label="状态：" :label-width="60">
            <Select
              v-model="formInline.serviceStatus"
              class="scroll dropdown"
              style="width:8.75rem"
            >
              <Option v-for="item in statusList" :value="item.id" :key="item.id">
                {{
                item.name
                }}
              </Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :md="3" :xxl="4">
          <FormItem label="服务类型：">
            <Select v-model="formInline.type" class="scroll dropdown" style="width:8.75rem">
              <Option v-for="item in typeList" :value="item.typeId" :key="item.typeId">
                {{
                item.typeName
                }}
              </Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :md="3" :xxl="4">
          <FormItem label="专题类型：">
            <Select v-model="formInline.type" class="scroll dropdown" style="width:8.75rem">
              <Option v-for="item in typeList" :value="item.typeId" :key="item.typeId">
                {{
                item.typeName
                }}
              </Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col :md="8" :xxl="6">
          <FormItem label="发布时间：">
            <DatePicker
              type="daterange"
              :value="formInline.date"
              @on-change="handleDateChange"
              placeholder="请选择起止日期"
              :clearable="false"
              class="smzx-normal-datepick smzx-date-range"
            ></DatePicker>
          </FormItem>
        </i-col>
        <i-col :md="2">
          <FormItem :label-width="remToPx(2)">
            <Button type="primary" class="smzx-search-btn" @click="handleSubmit">查询</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
    <div class="flex flex-sb">
      <Form inline>
        <FormItem>
          <Button type="primary">浏览</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleStart">启动</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleStop">停止</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleDelete">删除</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" to="/data/service/register">注册</Button>
        </FormItem>
      </Form>
      <!-- <ButtonGroup>
        <Button type="primary">
          资源名称
          <Icon type="md-arrow-up" />
        </Button>
        <Button type="primary">
          更新日期
          <Icon type="md-arrow-down" />
        </Button>
      </ButtonGroup>-->
      <!-- <Button type="primary" to="/data/service/register">注册服务</Button> -->
    </div>
    <div class="mt">
      <!-- <div class="service-list-item" v-for="i in 3" :key="`${i}`">
        <Row :gutter="6" type="flex" justify="center">
          <i-col span="3">
            <div class="img-wrap"></div>
          </i-col>
          <i-col span="15" class="text-darkgrey">
            <div class="item-title">2019年昭通影像</div>
            <Row>
              <i-col span="8">
                <span class="item-label">专题类型：</span>
                <span class="item-value">遥感测绘</span>
              </i-col>
              <i-col span="8">
                <span class="item-label">专题类型：</span>
                <span class="item-value">遥感测绘</span>
              </i-col>
              <i-col span="8">
                <span class="item-label">专题类型：</span>
                <span class="item-value">遥感测绘</span>
              </i-col>
              <i-col span="8">
                <span class="item-label">专题类型：</span>
                <span class="item-value">遥感测绘</span>
              </i-col>
            </Row>
          </i-col>
          <i-col span="6">
            <Button type="primary" shape="circle">启动</Button>
            <Button type="primary" shape="circle" class="ml">停止</Button>
            <Button type="primary" shape="circle" class="ml">删除</Button>
          </i-col>
        </Row>
      </div>-->
      <Table
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
          :size="'small'"
          :total="page.total"
          @on-change="changePage"
          show-total
          show-elevator
          :current="page.current"
          :page-size="page.pageSize"
        ></Page>
      </div>
    </div>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
import { format, subMonths } from "date-fns";
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
    selectedId: Number
  },
  data() {
    return {
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
          width: remToPx(4)
        },
        {
          title: "服务名称",
          key: "name",
          align: "center",
          width: remToPx(10),
          tooltip: true,
          sortable: true
        },
        {
          title: "状态",
          slot: "status",
          align: "center",
          width: remToPx(5)
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
          width: remToPx(12),
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
      }
    };
  },
  watch: {
    selectedId(newVal, oldVal) {
      //重新請求数据 不为空则代表选择了模块
      if (newVal) {
        this.getListById(newVal);
      } else {
        this.getFWListPage(newVal);
      }
    }
  },
  created() {
    this.getFWListPage();
  },
  computed: {},
  methods: {
    // 分页查询模块服务列表
    getListById(id) {
      let postData = {
        identification: id,
        serviceName: this.formInline.serviceName,
        serviceStatus: this.formInline.serviceStatus,
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
        if (code === 1000) {
          if (data.list.length) {
            this.page.total = data.total;
            this.dataPutIn = data.list.map((item, index) => ({
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
              id: item.pkId,
             
            }));
          } else {
            this.dataPutIn = [];
          }
        }
      });
    },
    //分页查询服务列表
    getFWListPage() {
      let postData = {
        serviceName: this.formInline.serviceName,
        serviceStatus: this.formInline.serviceStatus,
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
        if (code === 1000) {
          if (data.list.length) {
            this.page.total = data.total;
            this.dataPutIn = data.list.map((item, index) => ({
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
            }));
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
      // this.getFWListPage();
    },
    //选择日期变化
    handleDateChange(e) {
      this.formInline.date = e;
    },
    // 点击启动按钮
    handleStart() {
      if (this.selectedRowIds.length) {
        updateStart({ checkbox: this.selectedRowIds.join(",") }).then(res => {
          const { data, code } = res.data;
          if (code === 1000) {
            //修改成功，再请求一次
            this.$Message.info("启动成功");
            this.selectedRowIds = [];
            this.getFWListPage();
          }
        });
      } else {
        this.$Message.info("请选择服务");
      }
    },
    // 点击停止按钮
    handleStop() {
      if (this.selectedRowIds.length) {
        updateOver({ checkbox: this.selectedRowIds.join(",") }).then(res => {
          const { data, code } = res.data;
          if (code === 1000) {
            //修改成功，再请求一次
            this.$Message.info("停止成功");
            this.selectedRowIds = [];
            this.getFWListPage();
          }
        });
      } else {
        this.$Message.info("请选择服务");
      }
    },
    // 点击删除按钮
    handleDelete() {
      if (this.selectedRowIds.length) {
        delFw({ ids: this.selectedRowIds.join(",") }).then(res => {
          const { data, code } = res.data;
          if (code === 1000) {
            //修改成功，再请求一次
            this.$Message.info("删除成功");
            this.selectedRowIds = [];
            this.getFWListPage();
          }
        });
      } else {
        this.$Message.info("请选择服务");
      }
    },
    handleSelectRow(selection, row) {
      this.selectedRowIds.push(row.id + "");
    },
    handleSelectRowAll(selection) {
      this.selectedRowIds = selection.map((item, index) => item.id);
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
.img-wrap {
  width: 5rem;
  height: 5rem;
  background: url("../../../../../assets/img/dataManage/query/map.png");
}
.service-list-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .item-title {
    font-weight: 700;
    font-size: 1.125rem;
  }
  .item-label {
    display: inline-block;
    width: 6rem;
  }
}
</style>