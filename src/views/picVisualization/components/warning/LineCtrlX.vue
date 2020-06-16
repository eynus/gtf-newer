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
   * 底线管控-行政区划统计
   */
  import Bar from './components/Bar'
  export default {
    name: "LineCtrlX",
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
            dimensions: ['area', 'num'],
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
            ]
          },
          {
            title: '永久基本农田保护面积',
            type: 'bar',
            label: '面积',
            dimensions: ['area', 'num'],
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
            ]
          },
          {
            title: '耕地保有量',
            type: 'bar',
            label: '面积',
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
            ]
          },
          {
            title: '森林覆盖率',
            type: 'line',
            label: '百分率',
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
            ]
          },
          {
            title: '湿地面积',
            type: 'bar',
            label: '面积',
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
            ]
          },
          {
            title: '河湖水面率',
            type: 'line',
            label: '百分率',
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
            ]
          },
          {
            title: '水资源开发利用率',
            type: 'line',
            label: '百分率',
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
            ]
          },
          {
            title: '自然岸线保有率',
            type: 'line',
            label: '百分率',
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
            ]
          },
          {
            title: '重要江河湖泊水功能区水质达标率',
            type: 'line',
            label: '百分率',
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
            ]
          },
          {
            title: '近岸海域水质优良（一、二类）比例',
            type: 'line',
            label: '百分率',
            source: [
              {area: '昭阳区', 'num': 43.3},
              {area: '水富县', 'num': 100},
              {area: '鲁甸县', 'num': 86.4},
              {area: '巧家县', 'num': 72.4},
              {area: '盐津县', 'num': 72.4},
              {area: '大关县', 'num': 72.4},
              {area: '永善县', 'num': 72.4},
              {area: '绥江县', 'num': 72.4},
              {area: '镇雄县', 'num': 72.4},
              {area: '彝良县', 'num': 72.4},
              {area: '威信县', 'num': 72.4},
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
