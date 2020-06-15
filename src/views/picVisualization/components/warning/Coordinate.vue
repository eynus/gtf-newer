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
   * 协调
   */
  import Table from './Table'
  import TimeLine from './TimeLine'
  export default {
    name: "Coordinate",
    components: {
      Table,
      TimeLine,
    },
    data() {
      return {
        datas: [
          {
            label: '',
            name: '户籍人口城镇化率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '常住人口城镇化率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '常住人口数量',
            value: 800,
            unit: '万人'
          },
          {
            label: '',
            name: '实际服务人口数量',
            value: 800,
            unit: '万人'
          },
          {
            label: '',
            name: '等级医院交通30分钟村庄覆盖率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '行政村等级公路通达率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '农村自来水普及率',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '城乡居民人均可支配收入比',
            value: 800,
            unit: '-'
          },
          {
            label: '',
            name: '海洋生产总值占GDP比重',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '人均地下空间面积',
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

