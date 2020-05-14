<template>
  <div ref="dom" class="charts chart-bi-directional-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import { BiDirectionalBarOptionModel } from '../../model/echarts/bi-directional-bar.model'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBiDirectionalBar',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null,
      option: new BiDirectionalBarOptionModel()
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },

    initEchart () {
      let data = this.value
      // console.log(data)
      this.option.dataset.source = data
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.option)
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
