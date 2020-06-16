<template>
  <div class="h100">
    <Row style="height:100%">
      <i-col span="4" class="h100 zt-scroll-y bg-white">
        <div class="pd h100">
          <card-title title="指标分类"></card-title>
          <!-- <my-config-tree
            :gData="gData"
            @handleSelect="handleSelect"
            type="service"
            @handleTreeList="handleTreeList"
          ></my-config-tree>-->
          <ele-custome-tree @handleSelect="handleSelect" ></ele-custome-tree>
        </div>
      </i-col>
      <i-col span="20 bg-white h100">
        <div class="pd">
          <config-manage :selectedId="selectedId" :selectedName="selectedName"></config-manage>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
import MyConfigTree from "./components/MyConfigTree";
import EleCustomeTree from "./components/eleCustomeTree";
import ConfigManage from "./components/ConfigManage";
// import { getCatalogue } from "@/api/dataManage/query";
const handleRawData = data => {
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({});
    if (data[i].children) {
      newData[i].children = handleRawData(data[i].children);
    }
    // if (data[i].childrens) {
    //   newData[i].children = handleRawData(data[i].childrens);
    // }
    newData[i].childrens = data[i].childrens;
    newData[i].key = data[i].identification + "";
    // newData[i].key = data[i].dataName + data[i].pkId;
    newData[i].title = data[i].dataName;
    newData[i].scopedSlots = { title: "title" };
  }
  return newData;
};
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
    // this.getCatalogue();
  },
  components: { MyConfigTree, ConfigManage, EleCustomeTree },
  computed: {},
  methods: {
    // getCatalogue() {
    //   getCatalogue().then(res => {
    //     const { data, code } = res.data;
    //     if (code === 1000) {
    //       let result = handleRawData(data);
    //       this.gData = result;
    //     }
    //   });
    // },
    handleSelect(e) {
      this.selectedId = e.id;
      this.selectedName = e.label;
      console.log(this.selectedId, this.selectedName);

      // this.selectedName = this.TreeFlatList.find(
      //   item => item.key === this.selectedId
      // ).title;
    },
    handleTreeList(e) {
      console.log("handleTreeList", e);
      // this.TreeFlatList = e;
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