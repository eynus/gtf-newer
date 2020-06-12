<template>
    <Layout class="container">
      <div class="header">
        <div
            :class="`${item.value === active ? 'h-item active' : 'h-item'}`"
            v-for="item in menu"
            :key="item.value"
            @click="hClick(item)"
        >
          <Icon
              custom="iconfont icon-yonghuguanli"
              :size="remToPx(1.6)"
          />
          <span>{{ item.label }}</span>
        </div>
      </div>
      <Layout class="layout">
        <Row class="h100" style="height: 100%">
          <Col :span="`${sider ? 10 : 0}`" style="height: 100%;background: #fff;">
            <Tabs class="tab">
              <TabPane label="总览" icon="ios-aperture-outline">
                <div class="">
                  <span>生态保护红线范围内建设用地面积</span>
                  <span>800</span>
                  <span>平方千米</span>
                </div>
              </TabPane>
              <TabPane label="年份统计" icon="ios-calendar-outline">">年份统计</TabPane>
              <TabPane label="行政区划统计" icon="ios-barcode-outline">行政区划统计</TabPane>
            </Tabs>
          </Col>
          <Col :span="`${sider ? 14 : 24}`" style="height: 100%">
            <Map></Map>
          </Col>
        </Row>
      </Layout>
    </Layout>
</template>
<script>
import Map from './Map'
export default {
  name: "warning",
  components: {
    Map
  },
  data() {
    return {
      sider: true,
      active: 2,
      menu: [
        {
          label: '底线管控',
          value: 0,
          icon: ''
        },
        {
          label: '结构效率',
          value: 1,
          icon: ''
        },
        {
          label: '生活品质',
          value: 2,
          icon: ''
        },
        {
          label: '安全',
          value: 3,
          icon: ''
        },
        {
          label: '创新',
          value: 4,
          icon: ''
        },
        {
          label: '协调',
          value: 5,
          icon: ''
        },
        {
          label: '绿色',
          value: 6,
          icon: ''
        },
        {
          label: '开放',
          value: 7,
          icon: ''
        },
      ]
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    hClick(item) {
      this.sider = true
      this.active = item.value
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background: #dce0e9;
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 3.75rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    background: #fff;
    .h-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0.5rem 0;
      height: 100%;
      cursor: pointer;
      &.active {
        color: #0083ff;
        background: #d0e3ff;
      }
    }
  }
  .tab {
    ::v-deep .ivu-tabs-nav {
      float: right;
    }
  }
}
</style>
