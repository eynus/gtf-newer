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
        name: '面积(km²)',
        min: 0,
        max: 105,
        interval: 15,
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
        data: []
      },
      {
        name: '优化',
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {},
        data: []
      },
      {
        name: '重点',
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {},
        data: []
      },
      {
        name: '限制',
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {},
        data: []
      },
      {
        name: '禁止',
        type: 'line',
        yAxisIndex: 1,
        itemStyle: {},
        data: []
      }
    ]
  }
  export default {
    name: "AreaLineBar",
    props: {
      func: Array
    },
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
    watch: {
      func() {
        this.getFuncList()
      }
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
          series: [{ data: bar }]
        }
        this.charts.setOption(option)
        return option
      },
      getFuncList() {
        let a = [], b=[], c = [],d = []
        this.func.forEach(item => {
          if (item.level) {
            switch (item.functionType) {
              case '优化开发区域':
                a.push(item)
                break
              case '重点开发区域':
                b.push(item)
                break
              case '限制开发区域':
                c.push(item)
                break
              case '禁止开发区域':
                d.push(item)
                break
            }
          }
        })
        a.sort(this.sort)
        b.sort(this.sort)
        c.sort(this.sort)
        d.sort(this.sort)
        a = a.map(item => item.sumArea)
        b = b.map(item => item.sumArea)
        c = c.map(item => item.sumArea)
        d = d.map(item => item.sumArea)
        let option = this.getAreaList()
        option.series.push({data: a})
        option.series.push({data: b})
        option.series.push({data: c})
        option.series.push({data: d})
        this.charts.setOption(option)
      },
      sort(a, b) {
        return a.code - b.code
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
        this.getFuncList()
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
