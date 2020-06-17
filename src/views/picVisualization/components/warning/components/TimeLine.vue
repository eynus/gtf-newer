<template>
  <div class="timeline w100" :key="current && Math.random()">
    <Steps :current="current" @click.native="stepClick">
      <Step
          v-for="item in time"
          icon="ios-disc"
          :title="String(item)"
          :key="item">
      </Step>
    </Steps>
  </div>
</template>

<script>
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
    stepClick(e) {
      let checked = Number(e.target.innerHTML)
      if (!checked) return 0
      let v = this.time.findIndex(item => item === checked)
      this.onChange(v)
    },
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
      center = arr.indexOf(year) !== -1 ? arr.findIndex(item => item === year) : 2;
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
