<template>
  <div ref="dom" class="charts chart-rose-bar"></div>
</template>

<script>
import echarts from "echarts";
import tdTheme from "./theme.json";
import { on, off } from "@/utils/common";
import { RosePieOptionModel } from "_model/echarts/rose-pie.model";
echarts.registerTheme("tdTheme", tdTheme);
export default {
  name: "ChartRosePie",
  props: {
    value: Array,
    text: String,
    subtext: String,
    // defaultShow: {
    //   type: Boolean,
    //   default: false
    // },
    height: String,
    option: {
      type: Object,
      default: function() {
        return new RosePieOptionModel();
      }
    }
  },
  data() {
    return {
      dom: null
    };
  },
  methods: {
    resize() {
      this.dom.resize();
    },

    initEchart() {
      let data = this.value;
      this.option.title.subtext = this.subtext ? this.subtext : "";
      this.option.dataset.source = data;
      this.dom = echarts.init(this.$refs.dom, "tdTheme");
      this.dom.setOption(this.option);
      this.dom.off("click");
      this.dom.on("click", params => {
        this.$emit("chartClick", params);
      });

      on(window, "resize", this.resize);
    }
  },
  watch: {
    value: function() {
      this.$nextTick(() => {
        this.initEchart();
      });
    },
    height: function(newVal, oldVal) {
      this.$nextTick(() => {
        this.dom.getDom().style.height = newVal;
        this.resize();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      
      this.initEchart();
    });
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>