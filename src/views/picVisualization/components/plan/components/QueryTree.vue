<template>
  <div>
    <Input style="margin-bottom: 8px" placeholder="请输入关键字进行搜索" @on-change="onChange" />
    <a-tree
      ref="tree"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="gData"
      @expand="onExpand"
      @select="onSelect"
      :load-data="onLoadData"
    >
      <template slot="title" slot-scope="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span
            style="color: #f50"
          >{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>
<script>
import { getLeavesById } from "@/api/dataManage/query";
import { getCatalogue, getMetaByName } from "@/api/dataManage/query";
const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    // if (this.type === "service") {
    dataList.push({
      key,
      title: node.title,
      childrens: node.childrens
    });

    if (node.children) {
      generateList(node.children);
    }
  }
};

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
    if (data[i].children) {
      newData[i].children = handleRawData(data[i].children);
    }
    if (data[i].childrens) {
      newData[i].children = handleRawData(data[i].childrens);
    }
    newData[i].key = data[i].dataName;
    newData[i].title = data[i].dataName;
    newData[i].isLeaf = false;
    newData[i].scopedSlots = { title: "title" };
  }
  return newData;
};
export default {
  name: "mytree",
  watch: {
    gData: {
      handler(newVal, oldVal) {
        generateList(newVal);
      }
    }
  },
  data() {
    return {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      inputVal: "",
      gData: []
    };
  },
  created() {
    this.getCatalogue();
  },
  methods: {
    // 获取左侧目录
    getCatalogue() {
      getCatalogue().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.gData = handleRawData(data);
          generateList(this.gData);
        }
      });
    },
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        getLeavesById({ identification: treeNode.dataRef.key }).then(res => {
          const { code, data } = res.data;
          if (code === 1000) {
            if (data.length) {
              treeNode.dataRef.children = data.map(item => ({
                title: item.dataName,
                key: item.dataName,
                isLeaf: true
              }));
            } else {
            }
            this.gData = [...this.gData];
            resolve();
          }
        });
      });
    },

    onSelect(e, a) {
      if (e[0]) {
        this.$emit("handleSelect", e);
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, this.gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
