<template>
  <div class="h100">
    <Row style="height:100%">
      <Col span="4" class="h100 zt-scroll-y bg-white">
        <div class="pd h100">
          <card-title title="指标分类"></card-title>
          <ele-custome-tree @handleSelect="handleSelect" ></ele-custome-tree>
        </div>
      </Col>
      <Col span="20 bg-white h100">
        <div class="pd">
          <config-manage :selectedId="selectedId" :selectedName="selectedName"></config-manage>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import EleCustomeTree from "./components/EleCustomeTree";
import ConfigManage from "./components/ConfigManage";

export default {
  name: "Home",
  data() {
    return {
      buttonSize: "large",
      gData: [],
      selectedId: 0,
      TreeFlatList: [],
      selectedName: ""
    };
  },
  created() {
  },
  components: {  ConfigManage, EleCustomeTree },
  computed: {},
  methods: {
    handleSelect(e) {
      this.selectedId = e ? e.pkId : null
      this.selectedName = e ? e.zbflName : null
    },
    handleTreeList(e) {
      this.getFlattenList(e);
      // 重新请求datalist
      this.selectedId = this.TreeFlatList[0] && this.TreeFlatList[0]["key"];
      this.selectedName = this.TreeFlatList[0] && this.TreeFlatList[0]["title"];
      console.log("this.selectedId", this.selectedId, this.selectedName);
    },
    getFlattenList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        this.TreeFlatList.push({
          key,
          title: node.title
        });

        if (node.children) {
          this.getFlattenList(node.children);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
