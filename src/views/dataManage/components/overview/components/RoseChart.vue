<template>
  <div class="h100 w100 upper">
    <chart-rose-pie :option="option" :value="data" class="h100 w100"></chart-rose-pie>
    <div class="upper-inner text-center">
      <h2>数据总量</h2>
      <div class="fs16">{{dataTotal}}</div>
    </div>
  </div>
</template>
<script>
  // @ is an alias to /src
  import { ChartRosePie } from '_c/charts'
  import { RosePieOptionModel } from '_model/echarts/rose-pie.model'
  export default {
    name: 'rose-chart',
    components: {
      ChartRosePie
    },
    created() {
      this.option.legend.formatter = params => {
        for (var i = 0; i < this.option.dataset.source.length; i++) {
          if (this.option.dataset.source[i][0] == params) {
            return params + '   ' + this.option.dataset.source[i][1]
          }
        }
      }
    },
    data() {
      return {
        option: new RosePieOptionModel(),
        data: [
          ['现状数据', 188],
          ['规划数据', 88],
          ['管理数据', 156],
          ['社会经济资源', 218]
        ]
      }
    },
    computed: {
      dataTotal() {
        return 1000
      }
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>
  .upper {
    position: absolute;
    left: 0;
    top: 0;
    &-inner {
      position: absolute;
      top: 50%;
      left: 45%;
      transform: translate(-50%, -50%);
      // z-index: 9;
    }
  }
</style>