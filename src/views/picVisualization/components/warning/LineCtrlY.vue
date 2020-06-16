<template>
  <div :key="dk" class="content">
    <Spin fix v-if="load"></Spin>
    <Row v-for="(item, index) in dataset" :key="index">
      <Col class="chart-line">
        <Bar
            :title="item.title"
            :type="item.type"
            :label="item.label"
            :dimensions="item.dimensions"
            :source="item.source">
        </Bar>
      </Col>
    </Row>
  </div>
</template>

<script>
  /**
   * 底线管控-年份统计
   */
  import Bar from './components/Bar'
  export default {
    name: "LineCtrlY",
    components: {
      Bar
    },
    props: {
      dk: Number
    },
    data() {
      return {
        load: true,
        dataset: []
      }
    },
    mounted() {
      setTimeout(() => {
        this.load = false
        this.dataset = [
          {
            title: '生态保护红线范围内建设用地面积',
            type: 'bar',
            label: '面积',
            dimensions: ['year', 'num'],
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
          {
            title: '永久基本农田保护面积',
            type: 'bar',
            label: '面积',
            dimensions: ['year', 'num'],
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
          {
            title: '耕地保有量',
            type: 'bar',
            label: '面积',
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
          {
            title: '森林覆盖率',
            type: 'line',
            label: '百分率',
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
          {
            title: '湿地面积',
            type: 'bar',
            label: '面积',
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
          {
            title: '河湖水面率',
            type: 'line',
            label: '百分率',
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
          {
            title: '水资源开发利用率',
            type: 'line',
            label: '百分率',
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
          {
            title: '自然岸线保有率',
            type: 'line',
            label: '百分率',
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
          {
            title: '重要江河湖泊水功能区水质达标率',
            type: 'line',
            label: '百分率',
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
          {
            title: '近岸海域水质优良（一、二类）比例',
            type: 'line',
            label: '百分率',
            source: [
              {year: '2014', 'num': 43.3},
              {year: '2015', 'num': 100},
              {year: '2016', 'num': 86.4},
              {year: '2017', 'num': 72.4},
              {year: '2018', 'num': 72.4},
              {year: '2019', 'num': 72.4},
              {year: '2020', 'num': 72.4},
            ]
          },
        ]
      }, 5000)
    }
  }
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  height: 100%;
  ::v-deep .ivu-row {
    height: auto !important;
  }
  .chart-line {
    height: 250px;
    margin: 0 15px;
    margin-bottom: 15px;
  }
}
</style>
