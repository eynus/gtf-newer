<template>
  <div class="tab">
    <Tabs :animated="false">
      <TabPane label="总览" icon="ios-aperture-outline">
        <Table :datas="datas"></Table>
        <TimeLine @change="timeChange"></TimeLine>
      </TabPane>
      <TabPane label="年份统计" icon="ios-calendar-outline">年份统计</TabPane>
      <TabPane label="行政区划统计" icon="ios-barcode-outline">行政区划统计</TabPane>
    </Tabs>
  </div>
</template>

<script>
  /**
   * 共享
   */
  import Table from './components/Table'
  import TimeLine from './components/TimeLine'
  export default {
    name: "Share",
    components: {
      Table,
      TimeLine,
    },
    data() {
      return {
        datas: [
          {
            label: '',
            name: '年新增政策性住房占比',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '人均公园绿地面积',
            value: 800,
            unit: '平方米'
          },
          {
            label: '',
            name: '空气质量优良天数',
            value: 800,
            unit: '天'
          },
          {
            label: '',
            name: '人均绿道长度',
            value: 800,
            unit: '米'
          },
          {
            label: '',
            name: '每万人拥有咖啡馆、茶舍、书吧等数量',
            value: 800,
            unit: '个'
          },
          {
            label: '',
            name: '每10万人拥有的博物馆、图书馆、科技馆、艺术馆等文化艺术场馆数量',
            value: 800,
            unit: '处'
          },
          {
            label: '',
            name: '轨道站点800米范围人口和岗位覆盖率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '足球场地设施步行15分钟覆盖率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '平均每社区拥有老人日间照料中心数量',
            value: 800,
            unit: '个'
          },
          {
            label: '',
            name: '万人拥有幼儿园班数',
            value: 800,
            unit: '班'
          },
          {
            label: '',
            name: '城镇年新增就业人数',
            value: 800,
            unit: '万人'
          },
          {
            label: '',
            name: '工作日平均通勤时间',
            value: 800,
            unit: '分钟'
          },
          {
            label: '',
            name: '45分钟通勤时间内居民占比',
            value: 800,
            unit: '%'
          },
        ],
      }
    },
    methods: {
      timeChange(val) {
        console.log(val)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .tab {
    height: 100%;
    position: relative;
    ::v-deep .ivu-tabs {
      height: 100%;
    }
    ::v-deep .ivu-tabs-bar {
      margin-bottom: 1rem;
    }
    ::v-deep .ivu-tabs-content {
      height: calc(100% - 11rem);
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>

