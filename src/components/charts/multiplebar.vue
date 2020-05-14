<template>
  <div ref="dom" class="charts chart-multiple-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import { MultipleBarOptionModel } from '../../model/echarts/multiplebar.model'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartMultipleBar',
  props: {
    value: Array,
    text: String,
    subtext: String,
    subtextColor: {
      type: String,
      default: '#fff'
    },
    top: String, // 调整legend距离上边距
    series: Array,
    option: {
      type: Object,
      default: function () {
        return new MultipleBarOptionModel()
      }
    }
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    initEchart () {
      this.option.dataset.source = []
      // this.option.series = []
      let data = this.value
      if (this.series) {
        this.option.series = this.series
      }
      if (this.subtext) {
        this.option.title = [
          {
            subtext: this.subtext,
            subtextStyle: {
              color: this.subtextColor,
              fontSize: this.remToPx(0.875),
              align: this.subtextPosition,
              width: this.remToPx(37.5)
            }
          }
        ]
      }

      if (this.top) {
        this.option.legend.top = this.top
      }
      this.option.dataset.source = data
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
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
          let xIndex = this.dom.convertFromPixel({ seriesIndex: 0 }, [
            params.offsetX,
            params.offsetY
          ])[0]
          let currentData = data[xIndex + 1]
          console.log(params)
          let seriesIndex = params.target ? params.target.seriesIndex : 0

          this.$emit('chartClick', currentData, seriesIndex)
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
