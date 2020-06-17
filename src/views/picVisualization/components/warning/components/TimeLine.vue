<template>
  <div class="timeline w100">
    <!-- <div class="timeline">
      <a-steps progress-dot :current="current" @change="onChange">
      <a-step :title="item" v-for="(item, index) in time">
      </a-step>
    </a-steps>
    </div>-->
    <div class="w100">
      <el-steps  :active="1" finish-status="success">
        <el-step title="已完成"></el-step>
        <el-step title="进行中"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import Steps from "ant-design-vue/lib/steps";
import ElSteps from "element-ui/lib/steps";
import ElStep from "element-ui/lib/step";
import Vue from "vue";
Vue.use(Steps);
Vue.use(ElSteps);
Vue.use(ElStep);
const showNumber = 5;
const time = [2010, 2011, 2012, 2013, 2014, 2019, 2020, 2021, 2022, 2023];
export default {
  name: "TimeLine",
  data() {
    return {
      current: null,
      checked: null,
      time: []
    };
  },
  methods: {
    onChange(v) {
      this.current = v;
      let checked = this.time[v];
      let checkedIdx = time.findIndex(item => item === checked);
      // 前方还有日期
      if (v === 0) {
        // 选中第一个，向前挪动
        let total = time.length - 1 - checkedIdx;
        total = total >= showNumber - 1 ? showNumber - 2 : total;
        let i = 0;
        for (; i < total; i++) {
          let item = time[checkedIdx - i - 1];
          if (item) {
            this.time.pop();
            this.time.unshift(item);
          } else {
            break;
          }
        }
        this.current = checkedIdx === 0 ? 0 : this.current + i;
      }
      // 后方还有日期
      if (v === this.time.length - 1) {
        // 选中最后一个,往后挪动
        let total = time.length - 1 - checkedIdx;
        total = total >= showNumber - 1 ? showNumber - 2 : total;
        let i = 0;
        for (; i < total; i++) {
          let item = time[checkedIdx + i + 1];
          this.time.shift();
          this.time.push(item);
        }
        this.current = this.current - i;
      }
      this.checked = checked;
      this.$emit("change", checked);
    }
  },
  mounted() {
    setTimeout(() => {
      let year = new Date().getFullYear();
      let nowYear = time.findIndex(item => item === year);
      let center = null;
      // 判断time中间位置
      if (time.indexOf(year) !== -1) {
        center = time.findIndex(item => item === year);
      } else {
        center = parseInt(time.length / 2);
      }
      let arr = [];
      if (time.length > showNumber) {
        //如果当前年份是最后一年
        if (center === time.length - 1) {
          arr = time.concat([]).splice(center - showNumber + 1, center);
        } else {
          let min = center - 2;
          let max = center + 2;
          let i = min;
          for (; i <= max; i++) {
            time[i] && arr.push(time[i]);
          }
          if (arr.length < showNumber) {
            let total = showNumber - arr.length;
            let i = 0;
            for (; i < total; i++) {
              arr.unshift(time[min - 1]);
            }
          }
        }
      } else {
        arr = time;
        center = arr.length - 1;
      }
      center =
        arr.indexOf(year) !== -1 ? arr.findIndex(item => item === year) : 2;
      this.time = arr;
      this.current = center;
      this.checked = this.time[center];
    }, 0);
  }
};
</script>

<style lang="scss"  scoped>
.timeline {
  height: 8rem;
  padding-top: 1rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  ::v-deep .ant-steps {
    width: auto;
  }
}
</style>
