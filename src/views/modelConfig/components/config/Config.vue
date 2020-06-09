<template>
  <div class="h100">
    <Row style="height:100%">
      <i-col span="4" class="h100 zt-scroll-y bg-white">
        <div class="pd h100">
          <card-title title="指标分类"></card-title>
          <my-config-tree :gData="gData" @handleSelect="handleSelect" type="service"></my-config-tree>
        </div>
      </i-col>
      <i-col span="20 bg-white h100">
        <div class="pd">
          <config-manage :selectedId="selectedId"></config-manage>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
import MyConfigTree from "./components/MyConfigTree";
import ConfigManage from "./components/ConfigManage";
import { getCatalogue } from "@/api/dataManage/query";
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
      selectedId: -1
    };
  },
  created() {
    this.getCatalogue();
  },
  components: { MyConfigTree, ConfigManage },
  computed: {},
  methods: {
    getCatalogue() {
      getCatalogue().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          let result = handleRawData(data);
          this.gData = result;
        }
      });
    },
    handleSelect(e) {
      this.selectedId = e;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>