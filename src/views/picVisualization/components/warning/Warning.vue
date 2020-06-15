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
              :custom="`iconfont icon-${item.icon}`"
              :size="remToPx(1.4)"
          />
          <span>{{ item.label }}</span>
        </div>
      </div>
      <Layout class="layout">
        <Row>
          <Col :span="`${sider ? 10 : 0}`" style="height: 100%;background: #fff;">
            <keep-alive>
              <component :is="cname"></component>
            </keep-alive>
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
import Structure from './Structure'
import LifeQuality from "./LifeQuality"
import Safe from "./Safe"
import Innovate from './Innovate'
import Coordinate from './Coordinate'
import Green from './Green'
import Open from './Open'
import Share from './Share'

export default {
  name: "warning",
  components: {
    Map,
    LineCtrl,
    Structure,
    LifeQuality,
    Safe,
    Innovate,
    Coordinate,
    Green,
    Open,
    Share
  },
  data() {
    return {
      sider: true,
      active: 0,
      cname: 'LineCtrl',
      menu: [
        {
          label: '底线管控',
          name: 'LineCtrl',
          value: 0,
          icon: 'kongzhi'
        },
        {
          label: '结构效率',
          name: 'Structure',
          value: 1,
          icon: 'jiegou'
        },
        {
          label: '生活品质',
          name: 'LifeQuality',
          value: 2,
          icon: 'shenghuopingzhi'
        },
        {
          label: '安全',
          name: 'safe',
          value: 3,
          icon: 'anquan'
        },
        {
          label: '创新',
          name: 'Innovate',
          value: 4,
          icon: 'chuangxin'
        },
        {
          label: '协调',
          name: 'Coordinate',
          value: 5,
          icon: 'xietiao'
        },
        {
          label: '绿色',
          name: 'Green',
          value: 6,
          icon: 'lvse'
        },
        {
          label: '开放',
          name: 'Open',
          value: 7,
          icon: 'kaifang'
        },
        {
          label: '共享',
          name: 'Share',
          value: 8,
          icon: 'gongxiang'
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
      this.cname = item.name
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
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      padding: 0.4rem 0;
      height: 100%;
      cursor: pointer;
      &::after {
        content: " ";
        position: absolute;
        left: 0;
        width: 2px;
        height: 50%;
        border-right: 1px solid #ccc;
      }
      &:first-child::after {
        content: " ";
        border: 0;
        width: 0;
      }
    }
    .active {
      color: #0083ff;
      background: #d0e3ff;
      &::after {
        content: " ";
        width: 0;
        border: 0;
      }
    }
    .active + .h-item {
      &::after {
        content: " ";
        width: 0;
        border: 0;
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
