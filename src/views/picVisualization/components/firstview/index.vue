<template>
  <div class="h100 bg-white">
     1111
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
    newData[i].key = data[i].identification+'';
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
      selectedId: ''
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
      this.selectedId = e;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>