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
   * 创新
   */
  import Table from './Table'
  import TimeLine from './TimeLine'
  export default {
    name: "Innovate",
    components: {
      Table,
      TimeLine,
    },
    data() {
      return {
        datas: [
          {
            label: '',
            name: '研究与试验发展经费投入强度',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '万人发明专利拥有量',
            value: 800,
            unit: '件'
          },
          {
            label: '',
            name: '科研用地占比',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '在校大学生数量',
            value: 800,
            unit: '万人'
          },
          {
            label: '',
            name: '受过高等教育人员占比',
            value: 800,
            unit: '%'
          },
          {
            label: '',
            name: '高新技术企业数量',
            value: 800,
            unit: '家'
          }
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

