<template>
  <div class="h100">
    <Row style="height:100%">
      <Col span="4" class="h100 zt-scroll-y bg-white">
        <div class="pd h100">
          <my-tree  @handleSelect="handleSelect" type="service"></my-tree>
        </div>
      </Col>
      <Col span="20 bg-white h100">
        <div class="pd">
          <router-view :selectedId="selectedId"></router-view>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import MyTree from "./components/MyTree";
  // import { getCatalogue } from "@/api/dataManage/query";
  // const handleRawData = data => {
  //   let newData = [];
  //   for (let i = 0; i < data.length; i++) {
  //     newData.push({});
  //     if (data[i].children) {
  //       newData[i].children = handleRawData(data[i].children);
  //     }
  //     // if (data[i].childrens) {
  //     //   newData[i].children = handleRawData(data[i].childrens);
  //     // }
  //     newData[i].childrens = data[i].childrens;
  //     newData[i].key = data[i].identification+'';
  //     // newData[i].key = data[i].dataName + data[i].pkId;
  //     newData[i].title = data[i].dataName;
  //     newData[i].scopedSlots = { title: "title" };
  //   }
  //   return newData;
  // };
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
      // this.getCatalogue();
    },
    components: { MyTree },
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
        console.log(e)
        this.selectedId = e.identification;
      }
    }
  };
</script>
<style lang="scss" scoped>

</style>
