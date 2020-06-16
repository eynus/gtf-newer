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
   * 结构效率
   */
  import Table from './components/Table'
  import TimeLine from './components/TimeLine'
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
            name: '人均应急避难场所面积',
            value: 800,
            unit: '平方米'
          },
          {
            label: '',
            name: '道路网密度',
            value: 800,
            unit: '千米/平方千米'
          },
          {
            label: '',
            name: '人均城镇建设用地',
            value: 800,
            unit: '平方米'
          },
          {
            label: '',
            name: '人均农村居民点用地',
            value: 800,
            unit: '平方米'
          },
          {
            label: '',
            name: '存量土地供应比例',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '每万元GDP地耗',
            value: 800,
            unit: '平方米'
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

