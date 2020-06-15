<template>
  <div>
    <!-- <Input style="margin-bottom: 8px" placeholder="请输入关键字进行搜索" @on-change="onChange" /> -->
    <Select
      :clearable="true"
      v-model="selectedYear"
      class="scroll dropdown"
      style="width:8.5rem"
      @on-change="handleYearChange"
    >
      <Option v-for="item in yearList" :value="item" :key="item">
        {{
        item
        }}
      </Option>
    </Select>
    <a-tree
      ref="tree"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="gData"
      @expand="onExpand"
      @select="onSelect"
    >
      <!-- <template slot="title" slot-scope="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span
            style="color: #f50"
          >{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>-->
    </a-tree>
  </div>
</template>
<script>
import { getTreeList, getYear } from "@/api/modelConfig/config";
const dataList = [];
// const generateList = data => {
//   for (let i = 0; i < data.length; i++) {
//     const node = data[i];
//     const key = node.key;
//     dataList.push({
//       key,
//       title: node.title,
//       childs: node.childs
//     });

//     if (node.childs) {
//       generateList(node.childs);
//     }
//   }
// };

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
const handleRawData = data => {
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({});
    if (data[i].childs.length) {
      newData[i].children = handleRawData(data[i].childs);
    }
    newData[i].key = data[i].pkId;
    newData[i].code = data[i].zbflCode;
    newData[i].title = data[i].zbflName;
  }
  return newData;
};
export default {
  name: "mytree",

  // watch: {
  //   gData: {
  //     handler(newVal, oldVal) {
  //       generateList(newVal);
  //     }
  //   }
  // },
  data() {
    return {
      gData: [],
      yearList: [],
      selectedYear: "",
      statusList: [
        { name: "正常", id: "0" },
        { name: "停止", id: "1" }
      ],
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      inputVal: ""
    };
  },
  created() {
    this.getYear();
    // generateList(this.gData);
  },
  methods: {
    handleYearChange() {
      console.log('handleYearChange');
      
      this.getTreeList();
    },
    getTreeList() {
      getTreeList({ zbflYear: this.selectedYear }).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.gData = handleRawData(data);
          // generateList(this.gDatathis.gData);
          // console.log(this.gData,dataList);
          
          this.$emit('handleTreeList',this.gData)
        }
      });
    },
    getYear() {
      getYear().then(res => {
        const { code, data } = res.data;
        if (code === 1000) {
          this.yearList = data;
          this.selectedYear = data[data.length - 1];
          this.getTreeList();
        }
      });
    },
    onSelect(e, a) {
      console.log("????", e, a);

      if (e[0]) {
        this.$emit("handleSelect", e[0]);
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    }
   
  }
};
</script>
<style lang="scss" scoped>
</style>
