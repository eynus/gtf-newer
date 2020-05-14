<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import { BarOptionModel } from '../../model/echarts/bar.model'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Array,
    option: {
      type: Object,
      default: () => {
        return new BarOptionModel()
      }
    },
    text: String,
    subtext: String,
    subtextX: String,
    subtextY: {
      type: String,
      default: '4%'
    },
    barWidth: Number,
    barWidthPer: String,
    interval: Number,
    showYSplitLine: {
      type: Boolean,
      default: false
    },
    // showXSplitLine: {
    //   type: Boolean,
    //   default: false
    // },
    showLabel: {
      type: Boolean,
      default: true
    },
    isHorizontal: {
      type: Boolean,
      default: false
    },
    color: {
      type: Array,
      default: function () {
        return []
      }
    },
    grid: Object,
    yAxisColor: String,
    yAxisName: String,
    yAxisNameColor: {
      type: String,
      default: '#fff'
    },
    xAxisName: String,
    xAxisNameColor: {
      type: String,
      default: '#fff'
    }
  },
  data () {
    return {
      dom: null
      // option: new BarOptionModel(),
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },

    initEchart () {
      let data = this.value
      this.option.dataset.source = data

      if (this.subtext) {
        this.option.title = [
          {
            subtext: this.subtext,
            x: this.subtextX || '0',
            y: this.subtextY,
            subtextStyle: {
              // color: this.subtextColor,
              color: '#fff',
              fontSize: this.remToPx(0.875),
              // align: this.subtextPosition,
              width: this.remToPx(37.5)
            }
          }
        ]
      }

      if (this.yAxisName) {
        this.option.yAxis[0].name = this.yAxisName
        this.option.yAxis[0].nameTextStyle = {
          fontSize: this.remToPx(0.875),
          color: this.yAxisNameColor
        }
      }
      if (this.xAxisName) {
        this.option.xAxis[0].name = this.xAxisName
        this.option.xAxis[0].nameTextStyle = {
          fontSize: this.remToPx(0.875),
          color: this.xAxisNameColor
        }
      }

      if (this.barWidth) {
        this.option.series[0].barWidth = this.barWidth
      }
      if (this.barWidthPer) {
        this.option.series[0].barWidth = this.barWidthPer
      }
      if (!this.showLabel) {
        this.option.series[0].itemStyle.normal.label.show = false
      }
      if (this.showYSplitLine) {
        this.option.yAxis[0].splitLine.show = true
        this.option.yAxis[0].splitLine.lineStyle = {
          color: 'rgba(34,75,139,0.5)',
          type: 'solid',
          width: 1
        }
      }
      // if (this.showXSplitLine) {
      //   this.option.xAxis[0].splitLine.show = true
      //   this.option.xAxis[0].splitLine.lineStyle = {
      //     color: 'rgba(6,49,114,1)',
      //     type: 'solid',
      //     width: 1
      //   }
      // }

      if (this.interval) {
        this.option.yAxis[0].interval = this.interval
      }
      if (this.color) {
        this.option.color = this.color
      }
      if (this.yAxisColor) {
        this.option.yAxis[0].axisLabel.color = this.yAxisColor
      }
      if (this.grid) {
        this.option.grid = this.grid
      }
      // 统一设置了x,y轴label的字体大小
      this.option.xAxis[0].axisLabel.fontSize = Number(this.remToPx(0.875))
      this.option.yAxis[0].axisLabel.fontSize = Number(this.remToPx(0.875))

      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      // 赋值
      this.dom.setOption(this.option)
      // 只可以点击柱子
      // this.dom.on('click',params=>{
      //   console.log(params)
      //   this.$emit('chartClick',params)
      // })
      // 卸载，监听事件
      this.dom.getZr().off('click')
      this.dom.getZr().on('click', params => {
        let point = [params.offsetX, params.offsetY]
        this.dom.containPixel('grid', point)
        if (this.dom.containPixel('grid', point)) {
          let key = Number(this.isHorizontal)
          let xIndex = this.dom.convertFromPixel({ seriesIndex: 0 }, [
            params.offsetX,
            params.offsetY
          ])[key]
          let currentData = data[xIndex]
          this.$emit('chartClick', currentData)
        }
      })

      on(window, 'resize', this.resize)
    }
  },
  watch: {
    value: function () {
      this.$nextTick(() => {
        this.initEchart()
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initEchart()
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
