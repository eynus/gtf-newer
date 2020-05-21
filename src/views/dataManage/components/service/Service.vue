<template>
  <div class="h100">
     <Row style="height:100%">
      <i-col span="4" class="h100 scroll-y">
        <div class="pd h100">
          <my-tree :gData="gData" @handleSelect="handleSelect" type="service"></my-tree>
        </div>
      </i-col>
      <i-col span="20">
        <div class="pd">
          <router-view :selectedId="selectedId"></router-view>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
import MyTree from "_c/myTree/MyTree.vue";
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
    newData[i].key = data[i].pkId;
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
  components: { MyTree },
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
      console.log(".click", e);
      this.selectedId = e;
    }
  }
};
</script>
<style lang="scss" scoped>
.img-wrap {
  width: 5rem;
  height: 5rem;
  background: url("../../../../assets/img/dataManage/query/map.png");
}
.service-list-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .item-title {
    font-weight: 700;
    font-size: 1.125rem;
  }
  .item-label {
    display: inline-block;
    width: 6rem;
  }
}
</style>