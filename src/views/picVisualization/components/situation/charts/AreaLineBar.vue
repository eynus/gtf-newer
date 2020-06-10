<template>
  <div class="container" ref="container">
    <div ref="charts" class="charts"></div>
    <div class="text-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import echarts from "echarts"
  import tdTheme from '@/components/charts/theme.json'
  echarts.registerTheme("tdTheme", tdTheme)
  export default {
    name: "AreaLineBar",
    data() {
      return {
        option: {
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
            data: ['市、区/县面积', '优化', '重点', '限制', '禁止']
          },
          grid: {
            left: '7%',
            right: '7%',
            top: '20%',
            bottom: '25%'
          },
          barWidth: '65%',
          xAxis: [
            {
              type: 'category',
              data: ['昭通市', '昭通市', '昭通市', '昭通市', '昭通市', '昭通市', '昭通市', '昭通市', '昭通市', '昭通市', '昭通市'],
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
              name: '水量',
              min: 0,
              max: 250,
              interval: 50,
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
              name: '市、区/县面积',
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
        console.log(this.color)
        this.option.series.forEach((item, index) => {
          if (item.type === 'line') {
            item['itemStyle']['color'] = this.color[index - 1]
          }
        })
        this.charts.setOption(this.option)

        setTimeout(()=> {
          let option = {
            series: [
              {
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4]
              },
              {
                data: [15.6,15.6,15.6,15.6,15.6,15.6,15.6,15.6,15.6,15.6,15.6]
              }
            ]
          }
          this.charts.setOption(option)
        }, 3000)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
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
