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
   * 安全
   */
  import Table from './Table'
  import TimeLine from './TimeLine'
  export default {
    name: "Structure",
    components: {
      Table,
      TimeLine,
    },
    data() {
      return {
        datas: [
          {
            label: '',
            name: '城镇开发边界范围内建设用地面积',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '三线范围外建设用地面积',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '高标准农田面积占比',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '地下水供水量占总供水量比例',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '再生水利用率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '地下水水质优良比例',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '年平均地面沉降量',
            value: 800,
            unit: '毫米'
          },
          {
            label: '',
            name: '防洪堤防达标率',
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

