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
   * 生活品质
   */
  import Table from './components/Table'
  import TimeLine from './components/TimeLine'
  export default {
    name: "LifeQuality",
    components: {
      Table,
      TimeLine,
    },
    data() {
      return {
        datas: [
          {
            label: '',
            name: '森林步行15分钟覆盖率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '公园绿地、广场步行5分钟覆盖率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '社区卫生医疗设施步行15分钟覆盖率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '社区中小学步行15分钟覆盖率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '社区体育设施步行15分钟覆盖率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '城镇人均住房建筑面积',
            value: 800,
            unit: '平方米'
          },
          {
            label: '',
            name: '历史文化风貌保护面积',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '消防救援5分钟可达覆盖率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '每千名老年人拥有养老床位数',
            value: 800,
            unit: '张'
          },
          {
            label: '',
            name: '生活垃圾回收利用率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '农村生活垃圾处理率',
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

