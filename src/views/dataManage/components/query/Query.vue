<template>
  <div class="query-container pd bg-white h100">
    <div class="query-tree-box">
      <Collapse v-model="collapse" simple>
        <Panel name="1">
          空间数据
          <p slot="content">
            <Tabs value="name1" :animated="false">
              <TabPane label="图层" name="name1">
                <Tree
                    :data="space"
                    show-checkbox
                    :render="renderContent">
                </Tree>
              </TabPane>
              <TabPane label="图例" name="name2">

              </TabPane>
            </Tabs>
          </p>
        </Panel>
        <Panel name="2">
          结构数据
          <p slot="content">
            <Tree
                :data="nospace"
                :render="renderContent"
                @on-select-change="nospaceSelect">
            </Tree>
          </p>
        </Panel>
      </Collapse>
    </div>
    <div class="query-content">
      <component :is="activeComponent" :path="datapath"></component>
    </div>
  </div>
</template>
<script>
import pdfView from "@/components/pdfview/pdfView";
import imgView from "./components/imgView";
import MyMap from "./components/MyMap";
import { getCatalogue } from "@/api/dataManage/query";

export default {
  name: "Home",
  components: { MyMap, imgView, pdfView },
  data() {
    return {
      collapse: '1',
      activeComponent: 'imgView',
      space: [], // 空间数据
      nospace: [], // 结构数据
      datapath: '',
    };
  },
  computed: {},
  methods: {
    // 空间数据树自定义渲染
    nospaceSelect(select, node) {
      if (!node.selected) return
      let activeComponent = ''
      if (node.type === 1) {
        activeComponent = 'pdfView'
      } else if (node.type === 2) {
        activeComponent = 'imgView'
      }
      this.activeComponent = activeComponent
      this.datapath = node.dataPath
    },
    renderContent(h, { root, node, data }) {
      return h('span', data.dataName)
    },
    getCatalogue() {
      this.nospace = [
        {
          dataName: 'pdf',
          dataPath: '/pdf/123.pdf',
          type: 1,
          children: [
            {
              dataName: 2,
              dataName: 'pic',
              type: 2,
              dataPath: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594606105&di=887e4a4be7bd1a043fc2dc19dc9fcd96&src=http://dik.img.kttpdq.com/pic/142/99386/5bdc6bc2302e4423_1440x900.jpg',
            }
          ]
        },
        {
          dataName: 'pdf',
          dataPath: '/pdf/openlayer.pdf',
          type: 1,
          children: [
            {
              dataName: 2,
              dataName: 'pic',
              type: 2,
              dataPath: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594606105&di=887e4a4be7bd1a043fc2dc19dc9fcd96&src=http://dik.img.kttpdq.com/pic/142/99386/5bdc6bc2302e4423_1440x900.jpg',
            }
          ]
        },
        {
          dataName: 'excel',
          dataPath: '',
          type: 3,
          children: [
            {
              dataName: 2,
              dataName: 'pic',
              type: 2,
              dataPath: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594606105&di=887e4a4be7bd1a043fc2dc19dc9fcd96&src=http://dik.img.kttpdq.com/pic/142/99386/5bdc6bc2302e4423_1440x900.jpg',
            }
          ]
        },
      ]
      getCatalogue().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.space = data.spaceData.data
          this.nospace = data.noSpaceData.data
        }
      });
    },
    loadPdfHandler() {

    }
  },
  mounted() {
    // this.pdfsrc = pdf.createLoadingTask('http://59.110.219.45/')
    // console.log(this.pdfsrc)
      this.getCatalogue()
  }
};
</script>
<style lang="scss" scoped>
.query-container {
  overflow: hidden;
  .query-tree-box {
    float: left;
    width: 300px;
    height: 100%;
    overflow: auto;
    ::v-deep .ivu-tabs {
      overflow: auto;
    }
    .query-tree {
      width: 300px;
      height: 50%;
    }
  }

  // iview tab
  ::v-deep .ivu-tabs-nav {
    width: 100%;
    height: 100%;
    font-size: 16px;
    .ivu-tabs-tab {
      text-align: center;
      width: 50%;
    }
  }

  // iview tree
  ::v-deep .ivu-tree{
    margin-left: 16px;
    ul {
      font-size: 16px;
    }
    .ivu-tree-arrow {
      margin: 0 16px 0 0px;
    }
  }

  .query-content {
    float: left;
    width: calc(100% - 300px);
    height: 100%;
    overflow: hidden;
  }
}
</style>
