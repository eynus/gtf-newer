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
        <Row>
          <Col :span="`${sider ? 10 : 0}`" style="height: 100%;background: #fff;">
            <LineCtrl></LineCtrl>
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
import LineCtrl from './LineCtrl'
export default {
  name: "warning",
  components: {
    Map,
    LineCtrl
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
  .layout {
    height: calc(100% - 4.8rem);
    ::v-deep .ivu-row {
      height: 100%;
    }
  }
  .tab {
    ::v-deep .ivu-tabs-nav {
      float: right;
    }
  }
}
</style>
