<template>
  <div class="container" ref="container">
    <div ref="charts" class="charts"></div>
    <div class="text-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import Storage from "@/utils/storage"
  import echarts from "echarts"
  import tdTheme from '@/components/charts/theme.json'
  echarts.registerTheme("tdTheme", tdTheme)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['区/县面积', '优化', '重点', '限制', '禁止']
    },
    grid: {
      left: '10%',
      right: '7%',
      top: '20%',
      bottom: '25%'
    },
    barWidth: '65%',
    xAxis: [
      {
        type: 'category',
        data: ['', '', '', '', '', '', '', '', '', '', ''],
        axisLabel: {
          interval: 0,
          fontSize: 11
        },
        axisPointer: {
          type: 'line'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '面积(km²)',
        min: 0,
        max: 4000,
        interval: 500,
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '温度',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '区/县面积',
        type: 'bar',
        itemStyle: {
          color: '#7c63ea',
        },
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4]
      },
      {
        name: '优化',
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {},
        data: [18,18,18,18,18,18,18,18,18,18,18]
      },
      {
        name: '重点',
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {},
        data: [23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23]
      },
      {
        name: '限制',
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {},
        data: [6.3, 6.3, 6.3, 6.3,6.3,6.3,6.3,6.3,6.3,6.3,6.3]
      },
      {
        name: '禁止',
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {},
        data: [10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2]
      }
    ]
  }
  export default {
    name: "AreaLineBar",
    data() {
      return {
        bar: []
      }
    },
    computed: {
      color() {
        return this.$store.state.color.pic_area
      },
    },
    methods: {
      init() {
        this.charts = echarts.init(this.$refs.charts, "tdTheme")

        option.series.forEach((item, index) => {
          if (item.type === 'line') {
            item['itemStyle']['color'] = this.color[index - 1]
          }
        })
        this.charts.setOption(option)
      },
      getAreaList() {
        let data = Storage.getArea()
        let axis = []
        let bar = []
        data.forEach(item => {
          if (item.pkId !== 1) {
            axis.push(item.placeName)
            bar.push(item.area)
          }
        })
        let option = {
          xAxis: { data: axis },
          // yAxis: [{ max: data[0].area }],
          series: [{ data: bar }]
        }
        this.charts.setOption(option)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
        this.getAreaList()
      })
    }
  }
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    .charts {
      width: 100%;
      height: 100%;
    }
    .text-wrap {
      position: absolute;
      bottom: 0.3rem;
      left: 0;
      right: 0;
      text-align: center;
      color: #8391b8;
    }
  }
</style>
