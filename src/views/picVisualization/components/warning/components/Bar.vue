<template>
  <div class="chart-wrap" ref="container">
    <div ref="charts" class="charts"></div>
  </div>
</template>

<script>
  import echarts from "echarts"
  import tdTheme from '@/components/charts/theme.json'
  echarts.registerTheme("tdTheme", tdTheme)
  const option = {
    title: {
      text: '',
      textStyle: {
        fontSize: 14
      }
    },
    legend: {
      right: 0,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    dataset: {
      dimensions: ['year', 'num'],
      source: [

      ]
    },
    xAxis: {type: 'category'},
    yAxis: {},
    series: { type: 'line', name: '234', barWidth: '50%'},
  }
  export default {
    name: "Bar",
    props: {
      type: String,
      title: String,
      label: String,
      source: Array,
      dimensions: Array
    },
    data() {
      return {

      }
    },
    methods: {
      init() {
        this.charts = echarts.init(this.$refs.charts, "tdTheme")
        option.title.text = this.title
        option.series.type = this.type
        option.series.name = this.label
        option.dataset.dimensions = this.dimensions
        option.dataset.source = this.source
        this.charts.setOption(option)
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
  }
</script>

<style lang="scss" scoped>
.chart-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  .charts {
    width: 100%;
    height: 100%;
  }
}
</style>
