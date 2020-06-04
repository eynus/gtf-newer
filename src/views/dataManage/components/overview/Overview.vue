<template>
  <div class="h100">
    <div class="card-container card-container1">
      <div class="card-title">
        <Icon custom="iconfont  icon-fenleihuizong" size="16" color="#fff" />
        <span class="ml">分类汇总</span>
      </div>
      <div class="card-body">
        <Row style="height:100%">
          <i-col span="15" class="h100">
            <div class="h100 w100 card-left flex flex-center flex-wrap">
              <!-- <Row type="flex" :gutter="12"> -->
              <!-- <div class=""> -->
              <div
                class="card-left-item w100 h100"
                v-for="(item,index) in typesTotal"
                :key="`type_${index}`"
              >
                <div class="card-left-item-inner h100 w100">
                  <div class="flex flex-sa h100 w100">
                    <div
                      class="card-left-item-inner-left flex flex-center"
                      :style="{backgroundColor:`${item.bgColor}`, boxShadow: `0 0 6px ${item.bgColor}`}"
                     
                    >
                      <Icon :custom="`${item.icon}`" :size="remToPx(3)" color="#fff" />
                    </div>
                    <div class="card-left-item-inner-right">
                      <div class="block-up">
                        <span class="title">{{item.name}}</span>
                        <span class="value" :style="`color:${item.bgColor}`">{{item.totalChilds}}</span>
                        <span :style="`color:${item.bgColor}`">个</span>
                      </div>
                      <div class="block-bottom">
                        <span class="mr-lg">{{item.firstChilds}}个一级子类</span>
                        <span>{{item.secondChilds}}个二级子类</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </i-col>
          <i-col span="9" class="h100">
            <div class="h100 w100 position-r card-right">
              <!-- <div :style="{ height: `${remToPx(15)}px` ,width:`100%`}"> -->
              <!-- <div :style="{ height: `${remToPx(15)}px` ,width:`100%`}">1</div> -->
              <rose-chart
             
                class="position-a-c h100"
                :data="chartData"
                :dataTotal="chartDataTotal"
              ></rose-chart>

              <!-- </div> -->
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="card-container mt-lg card-container2">
      <div class="card-title">
        <Icon custom="iconfont  icon-rukulishi" size="16" color="#fff" />
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
          :label-width="remToPx(6.5)"
          width="100%"
        >
          <!-- <Row> -->
          <!-- <i-col :md="6" :xxl="5"> -->
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
          <!-- </i-col> -->
          <!-- <i-col :md="6" :xxl="5"> -->
          <FormItem label="数据路径：">
            <Cascader :data="dataPaths" v-model="formInline.path" @on-change="handlePathChange"></Cascader>
          </FormItem>
          <!-- </i-col> -->
          <!-- <i-col :md="5" :xxl="4"> -->
          <FormItem label="数据类型：">
            <Select v-model="formInline.type" class="scroll dropdown" style="width:8.75rem">
              <Option v-for="item in typeList" :value="item.id" :key="item.id">
                {{
                item.name
                }}
              </Option>
            </Select>
          </FormItem>
          <!-- </i-col> -->
          <!-- <i-col :md="5" :xxl="5"> -->
          <FormItem label="上传用户：">
            <Input v-model.trim="formInline.uploader" placeholder="请输入" clearable />
          </FormItem>
          <!-- </i-col> -->
          <!-- <i-col :md="2"> -->
          <FormItem :label-width="remToPx(2)">
            <Button type="primary" class="smzx-search-btn" @click="handleSubmit">查询</Button>
          </FormItem>
          <!-- </i-col> -->
          <!-- </Row> -->
        </Form>

        <Table
          border
          size="small"
          :columns="columnsPutIn"
          :data="dataPutIn"
          class="ml-lg mr-lg tb-min-height"
        >
          <template slot="path" slot-scope="{row}">
            <div>{{row.dataPath}}</div>
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
    </div>
  </div>
</template>
<script>
import { format, subMonths } from "date-fns";
import { remToPx } from "@/utils/common";
import RoseChart from "./components/RoseChart.vue";
import { getCatalogue } from "@/api/dataManage/query";
import {
  getSJListPage,
  getTypeDetail,
  getPaths
} from "@/api/dataManage/overview";
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
          bgColor: "#0b89fe",
          icon: "iconfont icon-earth"
        },
        {
          name: "规划数据",
          firstChilds: 0,
          secondChilds: 0,
          totalChilds: 0,
          bgColor: "#fe8e0b",
          icon: "iconfont icon-hill"
        },
        {
          name: "管理数据",
          firstChilds: 0,
          secondChilds: 0,
          totalChilds: 0,
          bgColor: "#7c63ea",
          icon: "iconfont icon-setting"
        },
        {
          name: "社会经济数据",
          firstChilds: 0,
          secondChilds: 0,
          totalChilds: 0,
          bgColor: "#08c28b",
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
        pageSize: 4
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
    this.getSJListPage();
    this.getCatalogue(); //先请求一次，为查询浏览做准备
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
    getSJListPage() {
      getSJListPage({
        identification: "",
        fidentification: [],
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
          this.page.total = data.total;
          if (data.list.length) {
            this.dataPutIn = data.list.map((item, index) => ({
              uploader: item.realName,
              type: this.typeList.find((it, id) => it.id === item.dataType)
                .name,
              time: item.createdTime,
              dataPath: item.dataPath
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
      this.getSJListPage();
    },
    //选择日期变化
    handleDateChange(e) {
      this.formInline.date = e;
    },
    //切换页数
    changePage(index) {
      this.page.current = index;
      this.getSJListPage();
    },
    //选中路径变化
    handlePathChange(a, b) {
      this.formInline.path = a;
    },
    // 获取左侧目录
    getCatalogue() {
      getCatalogue().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .ivu-col.ivu-col-span-12.ivu-col-order-1 {
  padding: 0.5rem;
}
.ivu-table {
  min-height: 280px;
}
.card-container {
  background-color: #fff;
 
  &1 {
    padding-top: 0;
    background-color: transparent;
    height: calc(100% - 26rem);
    .card-body {
      margin-top: 1rem;
      margin-left: -1rem;
      margin-right: -1rem;
      height: calc(100% - 2rem);

      .card-left {
        .card-left-item:nth-of-type(1) .card-left-item-inner,
        .card-left-item:nth-of-type(2) .card-left-item-inner {
          margin-bottom: 0.5rem;
        }
        .card-left-item:nth-of-type(3) .card-left-item-inner,
        .card-left-item:nth-of-type(4) .card-left-item-inner {
          margin-top: 0.5rem;
        }
        .card-left-item {
          width: 50%;
          height: 50%;
          &-inner {
            background-color: #fff;
            color: $text-normal;
            margin-right: 1rem;
            padding: 0 4rem;
            width: calc(100% - 1rem);
            height: calc(100% - 0.5rem);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
            &-left {
              height: 62%;
              width: 22%;
              border-radius: 6px;

              
            }
            &-right {
              .block-up {
                .title {
                  display: inline-block;
                  color: #000;
                  font-size: 1.5rem;
                  margin-right: 2rem;
                  min-width: 8.5rem;
                }
                .value {
                  font-size: 1.5rem;
                }
              }
              .block-bottom {
                margin-top: 1rem;
              }
            }
          }
        }
      }
      .card-right {
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
      }
    }
  }
  &2 {
    min-height: 24rem;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }
  padding: 1rem;
  .card-title {
    text-align: center;
    margin-left: -1rem;
    background-color: $cardtitle-bg;
    width: 8rem;
    // font-weight: bold;
    font-size: 1rem;
    line-height: 1.75;
    color: #fff;
    padding: 0 4px;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
   
  }
  .card-body {
  }
}
.tb-min-height {
  min-height: 198px;
}
</style>