<template>
  <div class="h100">
    <div class="card-container card-container1">
      <div class="card-body">
        <Row style="height:100%;margin-left:0" :gutter="remToPx(2)">
          <Col span="15" class="h100 card-left" style="padding:0">
            <card-title icon="iconfont  icon-fenleihuizong" title="分类汇总"></card-title>
            <div class="h100 w100 flex flex-center flex-wrap card-left-item-list">
              <div
                class="card-left-item w100 h100"
                v-for="(item,index) in typesTotal"
                :key="`type_${index}`"
              >
                <div class="card-left-item-inner h100 w100">
                  <div
                    class="flex flex-sa h100 w100"
                    :style="{borderBottom:`2px solid ${item.bgColor}`}"
                  >
                    <div class="card-left-item-inner-right">
                      <div class="block-up">
                        <span class="value" :style="`color:${item.bgColor}`">
                          {{item.totalChilds}}
                          <i>个</i>
                        </span>
                        <span class="title">{{item.name}}</span>
                      </div>
                      <div class="block-bottom">
                        <span class="left">{{item.firstChilds}}个一级子类</span>
                        <span>{{item.secondChilds}}个二级子类</span>
                      </div>
                    </div>
                    <div class="card-left-item-inner-left flex flex-center">
                      <img :src="item.iconUrl" alt />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col span="9" class="h100">
            <div class="h100 w100 position-r card-right">
              <card-title icon="iconfont  icon-fenleihuizong" title="数据类型统计"></card-title>
              <rose-chart
                class="position-a-c"
                style="margin:1rem;height:calc(100% - 2rem)"
                :data="chartData"
                :dataTotal="chartDataTotal"
              ></rose-chart>

              <!-- </div> -->
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div class="card-container mt-lg card-container2 w100">
      <card-title icon="iconfont  icon-rukulishi" title="入库历史"></card-title>
      <div class="increate">
        <div class="ins-left-box">
          <div class="ins-left">
            <Card>
              <p slot="title">昨日新增</p>
              <div class="card-content">{{sum.newDay}}</div>
            </Card>
          </div>
          <div class="ins-left">
            <Card>
              <p slot="title">上周新增</p>
              <div class="card-content">{{sum.newWeek}}</div>
            </Card>
          </div>
          <div class="ins-left">
            <Card>
              <p slot="title">本月新增</p>
              <div class="card-content">{{sum.newMonth}}</div>
            </Card>
          </div>
        </div>
        <div class="increate-list" ref="insList">
            <ul>
              <li class="ins-list-item" v-for="(item, idx) in inslist" v-html>
                {{ idx + 1 }}.
                <span v-html="item">
                  {{item}}
                </span>
              </li>
            </ul>
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
  getSJListPage,
  getTypeDetail,
  getPaths,
  getSum,
  getByType,
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
      inslist: [],
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
        pageSize: 10
      },
      sum: {
        newDay: 0,
        newMonth: 0,
        newWeek: 0
      },
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
    this.init();
    this.getPaths();
    this.setTypesTotalData();
    this.getSJListPage();
    this.getByType()
  },
  methods: {
    init() {
      this.typesTotal = this.typesTotal.map((item, index) => ({
        ...item,
        iconUrl: require(`../../../../assets/img/dataManage/overview/${index +
          1}.png`)
      }));
    },
    getByType() {
      getByType({}).then(res => {
        const { code, data } = res.data
        let arr = []
        for(let k in data) {
          arr.push([k, data[k]])
        }
        this.chartData = arr
      })
    },
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
      getSJListPage({}).then(res => {
        console.log(res)
        const { data, code, total } = res.data;
        if (code === 1000) {
          this.inslist = data.map(item => `上传用户：<span style="border-bottom: dashed 1px #ccc;"> ${item.createdBy} </span> 于 <span style="border-bottom: dashed 1px #ccc;"> ${item.createdTime} </span> 上传了 <span style="border-bottom: dashed 1px #ccc;"> ${item.dataName} </span> 数据，路径为： <span style="border-bottom: dashed 1px #ccc;"> ${item.dataPath} </span>`)
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
    getSum() {
      getSum({}).then(res => {
        const { data, code } = res.data
        if (code === 1000) {
          this.sum = data
        }
      })
    },
    scroll1() {
      let _dom = this.$refs.insList
      let height = _dom.offsetHeight
      if(_dom.scrollTop % height == 0){
        clearInterval(this.time);
      } else {
        this.$refs.insList.scrollTop++;
        if(_dom.scrollTop >= _dom.scrollHeight - _dom.offsetHeight - 20){
          this.$refs.insList.scrollTop = 0
        }
      }
    },
    scroll() {
      let _dom = this.$refs.insList
      let height = _dom.offsetHeight
      this.$refs.insList.scrollTop += 2;
      if(_dom.scrollTop >= _dom.scrollHeight - height){
        this.$refs.insList.scrollTop = 0
      }
    },
    start() {
      this.insList = this.$refs.insList
      this.time = setInterval(this.scroll.bind(this), 100)
      this.insList.scrollTop++
    }
  },
  mounted() {
    this.getSum()
    this.$nextTick(() => {
      this.start()
    })
  },
  beforeDestroy() {
    this.time && clearInterval(this.time);
  }
};
</script>
<style lang="scss" scoped>
::v-deep .ivu-col.ivu-col-span-12.ivu-col-order-1 {
  padding: 0.5rem;
}
.card-container {
  background-color: #fff;

  &1 {
    background-color: transparent;
    height: calc(100% - 25.5rem);

    .card-body {
      height: 100%;
      .card-left {
        background-color: #fff;
        &-item-list {
          height: calc(100% - 4rem);
          margin: 1rem;
        }
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
            padding: 0 1.5rem;
            width: calc(100% - 1rem);
            height: calc(100% - 0.5rem);
            &-left {
              height: 80%;
              width: 22%;
              img {
                display: inline-block;
                max-height: 100%;
              }
            }
            &-right {
              width: 78%;
              margin: 0 2rem;
              .block-up {
                .title {
                  display: inline-block;
                  color: $text-title;
                  font-size: 1.5rem;
                }
                .value {
                  display: inline-block;
                  font-size: 2.25rem;
                  min-width: 10rem;
                  i {
                    font-style: normal;
                    font-size: 1.25rem;
                  }
                }
              }
              .block-bottom {
                margin-top: 1rem;
                .left {
                  display: inline-block;
                  min-width: 10rem;
                }
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
  padding-top: 0;
}
.tb-min-height {
  min-height: 198px;
}

.increate {
  height: calc(24rem - 32px);
  overflow: hidden;
  padding: 15px;
  box-sizing: border-box;
  .ins-left-box {
    width: 30%;
    height: 100%;
    float: left;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .ins-left {
      width: 150px;
      .card-content {
        text-align: center;
        font-size: 36px;
      }
      ::v-deep .ivu-card {
        margin-bottom: 10px;
        .ivu-card-body {
          padding: 0;
        }
      }
      ::v-deep .ivu-card-head {
        padding: 10px;
        p {
          margin: 0;
        }
      }
      .increate-item {
        width: 300px;
        margin-right: 30px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .increate-list {
    float: left;
    height: calc(24rem - 32px);
    padding: 0 15px 30px 15px;
    box-sizing: border-box;
    overflow: hidden;
    .ins-list-item {
      line-height: 36px;
      padding: 0 5px;
      /*&:hover {*/
      /*  background: #7bb1ff;*/
      /*  color: #fff;*/
      /*}*/
    }
  }


}

</style>
