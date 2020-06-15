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
   * 绿色
   */
  import Table from './Table'
  import TimeLine from './TimeLine'
  export default {
    name: "Green",
    components: {
      Table,
      TimeLine,
    },
    data() {
      return {
        datas: [
          {
            label: '',
            name: '生物多样性指数',
            value: 800,
            unit: '-'
          },
          {
            label: '',
            name: '森林蓄积量',
            value: 800,
            unit: '亿立方米'
          },
          {
            label: '',
            name: '新增国土空间生态修复面积',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '单位GDP二氧化碳排放降低',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '每万元GDP能耗',
            value: 800,
            unit: '吨标煤'
          },
          {
            label: '',
            name: '每万元GDP水耗',
            value: 800,
            unit: '立方米'
          },
          {
            label: '',
            name: '工业用地地均增加值',
            value: 800,
            unit: '亿元/平方千米'
          },
          {
            label: '',
            name: '年新增城市更新改造用地面积',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '原生垃圾填埋率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '绿色交通出行比例',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '人均年用水量',
            value: 800,
            unit: '立方米'
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

