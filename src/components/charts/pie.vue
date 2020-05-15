<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/utils/common'
import { PieOptionModel } from '../../model/echarts/pie.model'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    option: {
      type: Object,
      default: () => {
        return new PieOptionModel()
      }
    },
    defaultShow: {
      type: Boolean,
      default: false
    },
    defaultShowIndex: Number,
    text: String,
    subtext: String,
    radius: String,
    legend: {
      type: Object
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
    init () {
      this.$nextTick(() => {
        // let legend = this.value.map(_ => _.name)
        // this.option.legend.data = legend
        this.option.series[0].data = this.value
        if (this.radius) {
          this.option.series[0].radius = this.radius
        }
        if (this.legend) {
          this.option.legend = this.legend
        }

        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(this.option)
        this.dom.off('click')
        this.dom.on('click', params => {
          // const data = params;
          this.$emit('chartClick', params)
        })

        if (this.defaultShow) {
          // 设置默认选中高亮部分
          this.dom.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: this.defaultShowIndex
          })
          this.dom.on('mouseover', e => {
            // console.log('mouseover', e.dataIndex, this.defaultShowIndex)
            // 当检测到鼠标悬停事件，取消默认选中高亮
            this.dom.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex: this.defaultShowIndex
            })
            // 高亮显示悬停的那块
            this.dom.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: e.dataIndex
            })
          })
          // 检测鼠标移出后显示之前默认高亮的那块
          this.dom.on('mouseout', e => {
            // console.log('mouseout', e.dataIndex, this.defaultShowIndex)

            this.dom.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: this.defaultShowIndex
            })
          })
          this.dom.on('mouseover', 'legend', e => {})
        }
        on(window, 'resize', this.resize)
      })
    }
  },
  watch: {
    // 观察value的变化
    value: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.init()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
