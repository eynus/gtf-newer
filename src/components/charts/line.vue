<template>
  <div ref="dom" class="charts chart-line"></div>
</template>

<script>
  import echarts from 'echarts'
  import tdTheme from './theme.json'
  import { on, off } from '@/libs/tools'
  import { LineOptionModel } from '../../model/echarts/line.model'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartLine',
    props: {
      value: Object,
      text: String,
      subtext: String,
      subtextPosition: {
        type: String,
        default: 'left'
      },
      subtextColor: {
        type: String,
        default: '#0ff'
      },
      subtextLH: Number,
      xAxisName: String,
      xAxisNameColor: {
        type: String,
        default: '#fff'
      },
      xAxisLabelColor: String,
      yAxisName: String,
      yAxisNameColor: {
        type: String,
        default: '#fff'
      },
      yAxisLabelColor: String,
      extNum: {
        type: Number,
        default: 0
      },
      isArea: {
        type: Boolean,
        default: false
      },
      interval: Number,
      color: {
        type: Array,
        default: function() {
          return []
        }
      },
      customLabelFontSize: {
        type: Boolean,
        default: false
      },
      smooth: {
        type: Boolean,
        default: true
      },
      option: {
        type: Object,
        default: function() {
          return new LineOptionModel()
        }
      },
      needInit: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      num() {
        return this.extNum
      }
    },
    data() {
      return {
        dom: null
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      },

      initEchart() {
        let data = this.value
        let areaOption = null
        this.option.dataset.source = data
        if (this.isArea) {
          areaOption = {
            type: 'line',
            smooth: this.smooth,
            areaStyle: {}
          }
        } else {
          areaOption = {
            type: 'line',
            smooth: this.smooth
          }
        }
        if (this.subtextLH) {
          this.option.title.subtextStyle.lineHeight = this.subtextLH
        }
        if (this.interval) {
          this.option.yAxis[0].interval = this.interval
        }
        if (this.subtext) {
          this.option.title = {
            show: true,
            subtext: this.subtext,
            x: '4%',
            y: 0,
            subtextStyle: {
              color: this.subtextColor,
              fontSize: this.remToPx(0.875),
              align: this.subtextPosition,
              width: this.remToPx(37.5)
            }
          }
        }
        if (this.xAxisName) {
          this.option.xAxis[0].name = this.xAxisName
          this.option.xAxis[0].nameTextStyle = {
            fontSize: this.remToPx(0.875),
            color: this.xAxisNameColor
          }
        }
        if (this.yAxisName) {
          this.option.yAxis[0].name = this.yAxisName
          this.option.yAxis[0].nameTextStyle = {
            fontSize: this.remToPx(0.875),
            color: this.yAxisNameColor
          }
        }
        if (this.xAxisLabelColor) {
          this.option.xAxis[0].axisLabel.color = this.xAxisLabelColor
        }
        if (this.yAxisLabelColor) {
          this.option.yAxis[0].axisLabel.color = this.yAxisLabelColor
        }
        let num = this.extNum
        this.option.series = [areaOption]
        if (num) {
          // 多条数据
          while (num) {
            this.option.series.push(areaOption)
            num--
          }
        }

        if (this.color.length) {
          this.option.color = this.color
        }
        // 统一设置了x,y轴label的字体大小
        if (!this.customLabelFontSize) {
          this.option.xAxis[0].axisLabel.fontSize = Number(this.remToPx(0.875))
          this.option.yAxis[0].axisLabel.fontSize = Number(this.remToPx(0.875))
        }
        // this.option.series[0].itemStyle.normal.label.textStyle.fontSize=Number(this.remToPx(0.875))
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')

        this.dom.setOption(this.option)
        // 只可以点击线
        // this.dom.on('click',params=>{
        //   console.log(params)
        //   this.$emit('chartClick',params)
        // })
        // 卸载，监听事件
        this.dom.getZr().off('click')
        this.dom.getZr().on('click', params => {
          // console.log(params)
          let point = [params.offsetX, params.offsetY]
          this.dom.containPixel('grid', point)
          if (this.dom.containPixel('grid', point)) {
            let xIndex = this.dom.convertFromPixel({ seriesIndex: 0 }, [
              params.offsetX,
              params.offsetY
            ])[0]
            let seriesIndex = params.target ? params.target.seriesIndex : 0

            this.$emit('chartClick', xIndex, seriesIndex)
          }
        })

        on(window, 'resize', this.resize)
      }
    },
    watch: {
      value: function() {
        this.$nextTick(() => {
          this.initEchart()
        })
      }
    },
    mounted() {
      if (this.needInit) {
        this.$nextTick(() => {
          this.initEchart()
        })
      }
    },
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>
