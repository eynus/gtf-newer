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
   * 开放
   */
  import Table from './components/Table'
  import TimeLine from './components/TimeLine'
  export default {
    name: "Open",
    components: {
      Table,
      TimeLine,
    },
    data() {
      return {
        datas: [
          {
            label: '',
            name: '定期国际通航城市数量',
            value: 800,
            unit: '个'
          },
          {
            label: '',
            name: '机场国内通航城市数量',
            value: 800,
            unit: '个'
          },
          {
            label: '',
            name: '国内旅游人数',
            value: 800,
            unit: '万人次/年'
          },
          {
            label: '',
            name: '入境旅游人数',
            value: 800,
            unit: '万人次/年'
          },
          {
            label: '',
            name: '外籍常住人口数量',
            value: 800,
            unit: '万人'
          },
          {
            label: '',
            name: '机场年旅客吞吐量',
            value: 800,
            unit: '万人次'
          },
          {
            label: '',
            name: '铁路年旅客运输量',
            value: 800,
            unit: '万人次'
          },
          {
            label: '',
            name: '城市对外日均人流联系量',
            value: 800,
            unit: '万人次'
          },
          {
            label: '',
            name: '国际会议、展览、体育赛事数量',
            value: 800,
            unit: '次'
          },
          {
            label: '',
            name: '港口年集装箱吞吐量',
            value: 800,
            unit: '万标准箱'
          },
          {
            label: '',
            name: '机场年货邮吞吐量',
            value: 800,
            unit: '万吨'
          },
          {
            label: '',
            name: '对外贸易进出口总额',
            value: 800,
            unit: '亿元'
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

