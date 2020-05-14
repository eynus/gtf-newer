<template>
  <div ref="dom" class="charts chart-ybar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import { YBarOptionModel } from '../../model/echarts/ybar.model'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartYBar',
  props: {
    value: Array,
    text: String,
    subtext: String,
    gridTop: String
  },
  data () {
    return {
      dom: null,
      option: new YBarOptionModel()
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },

    initEchart () {
      let data = this.value
      this.option.title.subtext = this.subtext ? this.subtext : ''
      if (this.gridTop) {
        // 距离顶部的距离
        this.option.grid.top = this.gridTop
      }
      this.option.dataset.source = data
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.option)

      this.dom.getZr().off('click')
      this.dom.getZr().on('click', params => {
        // console.log(params)
        let point = [params.offsetX, params.offsetY]
        this.dom.containPixel('grid', point)
        if (this.dom.containPixel('grid', point)) {
          let xIndex = this.dom.convertFromPixel({ seriesIndex: 0 }, [
            params.offsetX,
            params.offsetY
          ])[1]
          let currentData = data[xIndex]
          // console.log(data)
          // console.log(xIndex)
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
