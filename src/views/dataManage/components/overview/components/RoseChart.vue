<template>
  <div class="h100 w100 upper" ref="rosewrap">
    <chart-rose-pie
      :option="option"
      :value="data"
      class="w100"
      :height=" height"
    ></chart-rose-pie>
    <div class="upper-inner text-center">
      <h3>数据总量</h3>
      <div class="value">{{dataTotal}}</div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import { ChartRosePie } from "_c/charts";
import { RosePieOptionModel } from "_model/echarts/rose-pie.model";

export default {
  name: "rose-chart",
  props: {
    dataTotal: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: function() {
        return [["暂无数据", 0]];
      }
    }
  },
  watch: {
    data(newVal, old) {}
  },
  components: {
    ChartRosePie
  },
  created() {
    this.$nextTick(()=>{
      
      this.height=this.chartssize(this.$refs.rosewrap)
      console.log(this.height);
      
    })
    
    // this.option.legend.formatter = params => {
    //   for (var i = 0; i < this.option.dataset.source.length; i++) {
    //     if (this.option.dataset.source[i][0] == params) {
    //       return params + "   " + this.option.dataset.source[i][1];
    //     }
    //   }
    // };
  },
  data() {
    return {
      option: new RosePieOptionModel(),
      height:'',
    };
  },
  methods: {
     //为图表计算高度
    chartssize(container) {
      function getStyle(el, name)
      {
        if (window.getComputedStyle) {
          return window.getComputedStyle(el, null);
        } else {
          return el.currentStyle;
        }
      }
      // let wi = getStyle(container, 'width').width;
      let hi = getStyle(container, 'height').height;
      // charts.style.height = hi
      return hi
    }
  }
};
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
    h3,
    .value {
      color: $text-normal;
      font-size: 1.25rem;
      line-height: 1;
      font-weight: 500;
    }
    .value {
      line-height: 1;
      font-size: 2rem;
    }
  }
}
</style>