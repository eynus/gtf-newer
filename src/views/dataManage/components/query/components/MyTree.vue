<template>
  <div>
    <i-input placeholder="输入关键字进行过滤" v-model="filterText"></i-input>

    <el-tree
      class="filter-tree"
      :data="data"
      :load="loadNode"
      check-strictly
      lazy
      :props="defaultProps"
      :filter-node-method="filterNode"
      ref="tree"
      accordion
      show-checkbox
      node-key="id"
      :expand-on-click-node="true"
      @check-change="handleClick"
    ></el-tree>
  </div>
</template>

<script>
import { getLeavesById } from "@/api/dataManage/query";
import { getCatalogue, getMetaByName } from "@/api/dataManage/query";
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getCatalogue();
  },
  methods: {
    handleClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data]);
        // this.selectedData = data;
        this.$emit("handleSelect", data);
      }
    },
    loadNode(node, resolve) {
      console.log(node);

      if (node.data.children) {
          const data = node.data.children

          resolve(data);
        return;
      } else {
        getLeavesById({ dataName: node.data.label }).then(res => {
          const { code, data } = res.data;
          if (code === 1000) {
              let newData=[]
            if (data.length) {
               newData = data.map(item => ({
                id: item.pkId+'-'+item.identification,
                label: item.dataName,
                isLeaf: true
              }));
            } else {
            }
            resolve(newData);
          }
        });
      }
      // if (node.level === 0) {
      //   return resolve([{ name: 'region' }]);
      // }
      // if (node.level > 1) return resolve([]);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取左侧目录
    getCatalogue() {
      getCatalogue().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          const handleRawData = data => {
            let newData = [];
            for (let i = 0; i < data.length; i++) {
              newData.push({});
              if (data[i].children) {
                newData[i].children = handleRawData(data[i].children);
              }
              //   if (data[i].childrens) {
              //     newData[i].children = handleRawData(data[i].childrens);
              //   }
              newData[i].id = data[i].pkId+'-'+data[i].identification;
              newData[i].label = data[i].dataName;
              newData[i].isLeaf = false;
              //   newData[i].scopedSlots = { title: "title" };
            }
            return newData;
          };
          this.data = handleRawData(data);
          //   generateList(this.data);
        }
      });
    }
  },

  data() {
    return {
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      filterText: "",
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf:'isLeaf'
      }
    };
  }
};
</script>