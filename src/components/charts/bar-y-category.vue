<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import { BarYCategory } from '../../model/echarts/bar-y-category.model'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBarYCatagory',
  props: {
    value1: Array,
    value2: Array,
    yAxis: Array,
    legend: Array,
    text: String,
    subtext: String
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
      let option = new BarYCategory()
      option.title = {
        subtext: this.subtext // "单位：台"
      }
      option.legend = {
        data: this.legend
      }
      option.yAxis.data = this.yAxis
      option.series = [
        {
          name: '正常',
          type: 'bar',
          data: this.value1
        },
        {
          name: '异常',
          type: 'bar',
          data: this.value2
        }
      ]

      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  },
  watch: {
    value1: function () {
      this.$nextTick(() => {
        this.initEchart()
      })
    },
    value2: function () {
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
