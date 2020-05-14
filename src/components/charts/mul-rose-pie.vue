<template>
  <div ref="dom" class="charts chart-rose-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import { RosePieOptionModel } from '_model/echarts/rose-pie.model'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartRosePie',
  props: {
    value: Array,
    text: String,
    subtext: String,
    defaultShow: {
      type: Boolean,
      default: false
    },
    defaultShowIndex: Number,
    option: {
      type: Object,
      default: function () {
        return new RosePieOptionModel()
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
      let data = this.value
      this.option.title.subtext = this.subtext ? this.subtext : ''
      // console.log(data)
      this.option.dataset.source = data
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.option)

      this.dom.off('click')
      this.dom.on('click', params => {
        const seriesIndex = params.seriesIndex

        this.$emit('chartClick', seriesIndex)
      })

      if (this.defaultShow) {
        this.option.series.forEach((_, i) => {
          // 设置默认选中高亮部分
          this.dom.dispatchAction({
            type: 'highlight',
            seriesIndex: i,
            dataIndex: this.defaultShowIndex
          })
          this.dom.on('mouseover', e => {
            // console.log('mouseover', e.dataIndex, this.defaultShowIndex)
            // 当检测到鼠标悬停事件，取消默认选中高亮
            this.dom.dispatchAction({
              type: 'downplay',
              seriesIndex: i,
              dataIndex: this.defaultShowIndex
            })
            // 高亮显示悬停的那块
            this.dom.dispatchAction({
              type: 'highlight',
              seriesIndex: i,
              dataIndex: e.dataIndex
            })
          })
          // 检测鼠标移出后显示之前默认高亮的那块
          this.dom.on('mouseout', e => {
            // console.log('mouseout', e.dataIndex, this.defaultShowIndex)

            this.dom.dispatchAction({
              type: 'highlight',
              seriesIndex: i,
              dataIndex: this.defaultShowIndex
            })
          })
        })

        this.dom.on('mouseover', 'legend', e => {
          // console.log('mouseover2,', e)
        })
        // this.dom.dispatchAction({
        //   type: 'highlight',
        //   seriesIndex: 0,
        //   dataIndex: this.defaultShowIndex
        // }) // 设置默认选中高亮部分

        // this.dom.on('mouseover', function (e) {
        //   if (e.dataIndex !== this.defaultShowIndex) {
        //     this.dom.dispatchAction({
        //       type: 'downplay',
        //       seriesIndex: 0,
        //       dataIndex: e.dataIndex
        //     })
        //   }
        // })

        // this.dom.on('mouseout', function (e) {
        //   // index = e.dataIndex

        //   this.dom.dispatchAction({
        //     type: 'highlight',
        //     seriesIndex: 0,
        //     dataIndex: e.dataIndex
        //   })
        // })
      }

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