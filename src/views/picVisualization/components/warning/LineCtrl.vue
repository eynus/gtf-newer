<template>
  <div class="tab">
    <Tabs :animated="false">
      <TabPane label="总览" icon="ios-aperture-outline">
        <div class="table">
          <div class="row" v-for="item in datas">
            <span class="title" :title="item.name">{{ item.name }}</span>
            <span class="num">{{ item.value }}</span>
            <span class="unit">{{ item.unit }}</span>
          </div>
          <div class="row" v-for="item in datas">
            <span class="title" :title="item.name">{{ item.name }}</span>
            <span class="num">{{ item.value }}</span>
            <span class="unit">{{ item.unit }}</span>
          </div>
        </div>
        <div class="timeline">
          <a-steps progress-dot :current="current" @change="onChange">
            <a-step :sub-title="item" v-for="item in 5"/>
          </a-steps>
        </div>
      </TabPane>
      <TabPane label="年份统计" icon="ios-calendar-outline">年份统计</TabPane>
      <TabPane label="行政区划统计" icon="ios-barcode-outline">行政区划统计</TabPane>
    </Tabs>
  </div>
</template>

<script>
  import Steps from 'ant-design-vue/lib/steps'
  import Vue from 'vue'
  Vue.use(Steps)
  export default {
    name: "LineCtrl",
    data() {
      return {
        current: 0,
        datas: [
          {
            label: '',
            name: '生态保护红线范围内建设用地面积',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '永久基本农田保护面积',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '耕地保有量',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '城乡建设用地面积',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '森林覆盖率',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '湿地面积',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '河湖水面率',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '水资源开发利用率',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '自然岸线保有率',
            value: 800,
            unit: '平方千米'
          },
          {
            label: '',
            name: '重要江河湖泊水功能区水质达标率',
            value: 800,
            unit: '平方千米'
          },{
            label: '',
            name: '近岸海域水质优良（一、二类）比例',
            value: 800,
            unit: '平方千米'
          }
        ],
      }
    },
    methods: {
      onChange(current) {
        this.current = current
      },
    }
  }
</script>

<style lang="scss" scoped>

.tab {
  height: 100%;
  position: relative;
  ::v-deep .ivu-tabs {
    height: 100%;
  }
  ::v-deep .ivu-tabs-bar {
    margin-bottom: 1rem;
  }
  ::v-deep .ivu-tabs-content {
    height: calc(100% - 11rem);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .table {
    font-size: 0.875rem;
    color: #999db2;
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 1.5rem;
      padding-left: 3rem;
      line-height: 3rem;
      height: 3rem;
      &:hover {
        background: #ebf4ff;
      }
      .title {
        flex: 1;
        height: 100%;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .num {
        width: 4rem;
        margin-left: 8rem;
        font-weight: 800;
        color: #3c8fff;
      }
      .unit {
        width: 6rem;
        margin-left: 5rem;
      }
    }
  }
  .timeline {
    height: 8rem;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

</style>
