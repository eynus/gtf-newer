<template>
  <div class="h100">
    <div class="card-container">
      <div class="card-title">
        <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />
        <span class="ml">分类汇总</span>
      </div>
      <div class="card-body pd-lg">
        <Row>
          <i-col span="14">
            <Row type="flex" :gutter="12">
              <i-col span="12" order="1" v-for="(item,index) in typesTotal" :key="`type_${index}`">
                <div class="card-left-item" :style="`backgroundColor:${item.bgColor}`">
                  <div class="card-left-item-title">
                    <Icon :custom="`${item.icon}`" size="30" color="#fff" />
                    <span class="ml">{{item.name}}</span>
                  </div>
                  <div>
                    <Row type="flex" align="bottom">
                      <i-col span="18">
                        <Row type="flex">
                          <i-col span="12">
                            <span class="fs16">{{item.firstChilds}}个一级子类</span>
                          </i-col>
                          <i-col span="12">
                            <span>{{item.secondChilds}}个二级子类</span>
                          </i-col>
                        </Row>
                      </i-col>
                      <i-col span="6">
                        <div>
                          <span class="card-left-item-total">{{item.totalChilds}}</span> 个
                        </div>
                      </i-col>
                    </Row>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
          <i-col span="10">
            <rose-chart
              :style="{ height: `${remToPx(16.25)}px` }"
              :data="chartData"
              :dataTotal="chartDataTotal"
            ></rose-chart>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <Icon custom="iconfont  icon-input" size="16" color="#2d8cf0" />
        <span class="ml">入库历史</span>
      </div>
      <div class="card-body">
        <Form
          ref="formInline"
          :model="formInline"
          inline
          style="margin-top:.75rem"
          class="search-box smzx-search-box"
          label-position="right"
          :label-width="90"
          width="100%"
        >
          <Row>
            <i-col :md="6" :xxl="5">
              <FormItem label="入库时间：">
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
            <i-col :md="6" :xxl="5">
              <FormItem label="数据路径：">
                <Cascader :data="dataPaths" v-model="formInline.path" @on-change="handlePathChange"></Cascader>
              </FormItem>
            </i-col>
            <i-col :md="5" :xxl="4">
              <FormItem label="数据类型：">
                <Select v-model="formInline.type" class="scroll dropdown" style="width:8.75rem">
                  <Option v-for="item in typeList" :value="item.id" :key="item.id">
                    {{
                    item.name
                    }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col :md="5" :xxl="5">
              <FormItem label="上传用户：">
                <Input v-model.trim="formInline.uploader" placeholder="请输入" clearable />
              </FormItem>
            </i-col>
            <i-col :md="2">
              <FormItem :label-width="remToPx(2)">
                <Button type="primary" class="smzx-search-btn" @click="handleSubmit">查询</Button>
              </FormItem>
            </i-col>
          </Row>
        </Form>

        <Table border size="small" :columns="columnsPutIn" :data="dataPutIn" class="ml-lg mr-lg">
          <template slot="path" slot-scope="{row,index}">
            <a href="#">{{row.dataPath}}</a>
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
  </div>
</template>
<script>
import { format, subMonths } from "date-fns";
import { remToPx } from "@/utils/common";
import RoseChart from "./components/RoseChart.vue";
import {
  getListPage,
  getTypeDetail,
  getPaths
} from "@/api/dataManage/overview";
// let pathList = [];
const handleRawData = data => {
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({});
    if (data[i].children) {
      newData[i].children = handleRawData(data[i].children);
    }
    newData[i].label = data[i].dataName;
    newData[i].value = data[i].dataName;
  }
  return newData;
};

export default {
  name: "Home",
  components: {
    RoseChart
  },
  data() {
    return {
      chartData: [
        ["现状数据", 0],
        ["规划数据", 0],
        ["管理数据", 0],
        ["社会经济数据", 0]
      ],
      dataPath: [],
      dataPaths: [],
      typesTotal: [
        {
          name: "现状数据",
          firstChilds: 0,
          secondChilds: 0,
          totalChilds: 0,
          bgColor: "rgb(0,131,255)",
          icon: "iconfont icon-earth"
        },
        {
          name: "规划数据",
          firstChilds: 0,
          secondChilds: 0,
          totalChilds: 0,
          bgColor: "rgb(255,195,0)",
          icon: "iconfont icon-hill"
        },
        {
          name: "管理数据",
          firstChilds: 0,
          secondChilds: 0,
          totalChilds: 0,
          bgColor: "rgb(67,207,124)",
          icon: "iconfont icon-setting"
        },
        {
          name: "社会经济数据",
          firstChilds: 0,
          secondChilds: 0,
          totalChilds: 0,
          bgColor: "rgb(227,60,100)",
          icon: "iconfont icon-person"
        }
      ],
      columnsPutIn: [
        {
          title: "入库时间",
          key: "time",
          align: "center"
        },
        {
          title: "数据路径",
          slot: "path",
          align: "center",
          width: remToPx(30)
        },
        {
          title: "数据类型",
          key: "type",
          align: "center"
        },
        {
          title: "上传用户",
          key: "uploader",
          align: "center"
        }
      ],
      dataPutIn: [],
      formInline: {
        path: [""],
        date: [
          format(subMonths(new Date(), 1), "yyyy-MM-dd"),
          format(new Date(), "yyyy-MM-dd")
        ],
        uploader: "",
        type: ""
      },
      typeList: [
        {
          id: "0",
          name: "矢量"
        },
        {
          id: "1",
          name: "栅格"
        },
        {
          id: "2",
          name: "表格"
        },
        {
          id: "3",
          name: "其他"
        }
      ],
      page: {
        current: 1,
        total: 0,
        pageSize: 6
      }
    };
  },
  computed: {
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    chartDataTotal() {
      return this.typesTotal.reduce((pre, now) => pre + now.totalChilds, 0);
    }
  },
  created() {
    this.getPaths();
    this.setTypesTotalData();
    this.getListPage();
  },
  methods: {
    //设置四大类各自的数据详情
    setTypesTotalData() {
      this.typesTotal.forEach((item, index) => {
        getTypeDetail({ dataName: item.name }).then(res => {
          let firstChilds,
            secondChilds,
            totalChilds = 0;
          const { data, code } = res.data;
          if (code === 1000) {
            item.firstChilds = data.firstCount || 0;
            item.secondChilds = data.secondCount || 0;
            item.totalChilds = data.sumCount || 0;
            this.$set(this.chartData[index], 1, data.sumCount || 0);
          }
        });
      });
    },
    //获取数据路径列表
    getPaths() {
      getPaths().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          let raw = (data && data.data) || [];
          let result = handleRawData(raw);
          this.dataPaths = result;
        }
      });
    },
    //获取查询列表
    getListPage() {
      getListPage({
        createdBy: this.formInline.uploader,
        dataPath: this.formInline.path.join("/"),
        dataType: this.formInline.type,
        endTime: this.formInline.date[1],
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        startTime: this.formInline.date[0]
      }).then(res => {
        const { data, code, total } = res.data;
        if (code === 1000) {
          if (data.list.length) {
            //查詢结果不为空
            this.page.total = data.total;
            //赋值dataPutIn
            this.dataPutIn = data.list.map((item, index) => ({
              uploader: item.realName,
              type: this.typeList.find((it, id) => it.id === item.dataType)
                .name,
              time: item.createdTime,
              dataPath:item.dataPath
            }));
          } else {
            // 置空
            this.dataPutIn = [];
          }
        }
      });
    },
    handleSubmit() {
      this.page.current = 1;
      this.getListPage();
    },
    //选择日期变化
    handleDateChange(e) {
      this.formInline.date = e;
    },
    //切换页数
    changePage(index) {
      this.page.current = index;
      this.getListPage();
    },
    //选中路径变化
    handlePathChange(a, b) {
      this.formInline.path = a;
    }
  }
};
</script>
<style lang="scss" scoped>
.ivu-table{
  min-height: 280px;
}
.card-container {
  .card-title {
    background-color: rgba(0, 0, 0, 0.1);
    font-weight: bold;

    line-height: 1.75;
    color: rgb(81, 81, 81);
    padding: 0 4px;
  }
  .card-body {
    .card-left-item {
      border-radius: 0.25rem;
      margin: 1rem;
      padding: 0.75rem;
      color: white;
      .card-left-item-title {
        font-size: 1.5rem;

        font-weight: 500;
      }
      .card-left-item-total {
        font-size: 2.75rem;
        font-weight: bold;
      }
    }
  }
}
</style>