<template>
  <div class="chart" ref="rosewrap">
    <chart-rose-pie
        class="w100"
        :option="option"
        :value="value"
        :height="height"
    ></chart-rose-pie>
    <div class="percent" :style="{color: color[data.key]}">
      {{ percent }}%
    </div>
    <div class="text-wrap">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import { ChartRosePie } from "_c/charts";
  import {remToPx} from "@/utils/common";
  const item = [
    { value: 0, name: '优化面积', itemStyle: {  color: '#08c28b' }},
    { value: 0, name: '重点面积', itemStyle: {  color: '#0b89fe' }},
    { value: 0, name: '限制面积', itemStyle: {  color: '#fe8e0b' }},
    { value: 0, name: '禁止面积', itemStyle: {  color: '#ff4d4f' }},
    { value: 11287, name: '全市面积', itemStyle: { color: '#cfe7ff' }, tooltip: {show: false },},
  ]
  const v_color = ['#cff3e8', '#cfe7ff', '#ffe7cf', '#FDE2E2']
  export default {
    name: "AreaPie",
    props: {
      dataTotal: {
        type: Number,
        default: 0
      },
      data: {
        type: Object
      }
    },
    components: {
      ChartRosePie
    },
    data() {
      return {
        option: {
          title: {
            show: true,
            text: '',
            subtext: '',
            subtextStyle: {
              color: '#000',
              fontSize: remToPx(1)
            },
            x: '30'
          },
          tooltip: {
            trigger: 'item',
            formatter: function (pargram) {
              return `${pargram.name}:${pargram.value.value}km²`
            }
          },
          legend: {
            show: false
          },
          dataset: {
            // dimensions: [],
            source: []
          },
          series: [
            {
              name: '半径模式',
              type: 'pie',
              startAngle: -180,
              radius : ['55%', '80%'],
              center: ['50%', '65%'],
              avoidLabelOverlap: false,
              hoverAnimation: true,
              label: {
                normal: {
                  show: true,
                  formatter: function (pargram) {
                    if (pargram.name === '全市面积') {
                      return `${pargram.name}\n11287km²`
                    }
                    return `${pargram.name}\n${pargram.value.value}km²`
                  },
                  position: 'outside',
                  color: '#8f9bb3',
                },
                emphasis: {
                  show: true
                }
              },
              labelLine: {
                show: true,
                length: 10,
                length2: 2
              },

            }
          ]
        },
        height: '',
        percent: ''
      }
    },
    computed: {
      color() {
        return this.$store.state.color.pic_area
      },
      value() {
        let key = this.data.key
        let check = item[key]
        check.value = this.data.value
        check.itemStyle.color = this.color[key]

        this.percent = (check.value / 11287 * 100).toFixed(2)

        let empty = { value:201, name:'_hidden', itemStyle: { opacity: 0 }, tooltip: {show: false }, label: { show: false }, labelLine: { show: false }}

        let all = JSON.parse(JSON.stringify(item[4]))
        all.itemStyle.color = v_color[key]

        let sum = 0
        let data = [check, all]
        // TODO 全市面积11287替换
        data[1].value = 11287 - data[0].value
        data.map(item => sum += item.value)
        empty.value = sum
        data.push(empty)
        // data[1].value = data[1].value - data[0].value
        return data
      }
    },
    created() {
      this.$nextTick(()=>{
        this.height=this.chartssize(this.$refs.rosewrap)
      })
    },
    methods: {
      //为图表计算高度
      chartssize(container) {
        container = window.getComputedStyle ? window.getComputedStyle(container, null) : container.currentStyle
        return container.height
      }
    }
  };
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
  position: relative;
  .percent {
    font-size: 1.5rem;
    position: absolute;
    left: 52%;
    top: 60%;
    transform: translateX(-52%) translateY(-60%);
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
