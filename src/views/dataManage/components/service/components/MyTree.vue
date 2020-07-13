<template>
  <div class="service-tree">
    <div class="service-tree-legend">
      已发布服务 - &nbsp;<Tag color="warning"> </Tag>
    </div>
    <div class="service-tree-legend">
      未发布服务 - &nbsp;<Tag color="success"> </Tag>
    </div>
    <RadioGroup v-model="treeNode" @on-change="radioChange">
      <Tree
          :data="tree"
          :render="renderContent"
          :multiple="false"
          check-strictly
          check-directly
          @on-select-change="handleClick"
      ></Tree>
    </RadioGroup >
  </div>
</template>

<script>
import { getLeavesById } from "@/api/dataManage/query";
import { getCatalogue, getMetaByName } from "@/api/dataManage/query";
export default {
  props: {
    tree: Array
  },
  data() {
    return {
      treeNode: null,
      data: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'child 1-1',
              num: 10,
              nonum: 20,
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1',
                  expand: true
                },
                {
                  title: 'leaf 1-1-2',
                  expand: true
                }
              ]
            },
            {
              title: 'child 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1',
                  expand: true
                },
                {
                  title: 'leaf 1-2-1',
                  expand: true
                }
              ]
            }
          ]
        }
      ],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    renderContent (h, { root, node, data }) {
      return h('Radio', {
        props: {
          label: node.nodeKey
        },
        style: {
          width: '100%'
        }
      }, [
        h('span', data.dataName),
        h('Tag', {
          props: {
            color: 'warning'
          },
          style: {
            marginLeft: '10px'
          },
        }, data.published),
        h('Tag', {
          props: {
            color: 'success'
          },
          style: {
            marginLeft: '10px'
          },
        }, data.unpublished)
      ])
    },
    handleClick(data, checked, node) {
      if (checked) {
        // this.$refs.tree.setCheckedNodes([data])
        // this.selectedData = data;
        this.$emit("handleSelect", checked);
      }
    },
    radioChange(val) {
      console.log(val)
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取左侧目录
    getCatalogue() {
      // getCatalogue().then(res => {
      //   const { data, code } = res.data;
      //   if (code === 1000) {
      //     const handleRawData = data => {
      //       let newData = [];
      //       for (let i = 0; i < data.length; i++) {
      //         newData.push({});
      //         if (data[i].children) {
      //           newData[i].children = handleRawData(data[i].children);
      //         }
      //
      //         newData[i].id = data[i].pkId+'-'+data[i].identification;
      //         newData[i].identification = data[i].identification;
      //         newData[i].label = data[i].dataName;
      //         newData[i].isLeaf = false;
      //         //   newData[i].scopedSlots = { title: "title" };
      //       }
      //       return newData;
      //     };
      //     this.data = handleRawData(data);
      //     //   generateList(this.data);
      //   }
      // });
    }
  },

};
</script>

<style lang="scss" scoped>
  .service-tree {
    .service-tree-legend {
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 5px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
</style>
