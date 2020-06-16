<template>
  <Tab :animated="false" @on-click="tabsClick">
    <template v-slot:table>
      <Table :datas="datas"></Table>
      <TimeLine @change="timeChange"></TimeLine>
    </template>
    <template v-slot:charty>
      <LineCtrlY :dk="tab1"></LineCtrlY>
    </template>
    <template v-slot:chartx>
      <LineCtrlX :dk="tab2"></LineCtrlX>
      <TimeLine @change="timeChange"></TimeLine>
    </template>
  </Tab>
</template>

<script>
  /**
   * 底线管控
   */
  import Tab from './components/Tab'
  import Table from './components/Table'
  import TimeLine from './components/TimeLine'
  import LineCtrlY from './LineCtrlY'
  import LineCtrlX from './LineCtrlX'
  export default {
    name: "LineCtrl",
    components: {
      Tab,
      Table,
      TimeLine,
      LineCtrlX,
      LineCtrlY,
    },
    data() {
      return {
        tab1: Math.random(),
        tab2:  Math.random(),
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
      timeChange(val) {
        console.log(val)
      },
      tabsClick(name) {
        switch (name) {
          case 1:
            this.tab1 = Math.random()
          case 2:
            this.tab2 = Math.random()
        }
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>

</style>
