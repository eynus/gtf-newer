<template>
  <div>
    <Input placeholder="输入关键字进行过滤" v-model="filterText"></Input>
    <Tree
        :data="data"
        :render="renderContent"
        :multiple="false"
        check-strictly
        check-directly
        @on-select-change="handleClick"
        ></Tree>
<!--        <el-tree-->
<!--      class="filter-tree"-->
<!--      :data="data"-->
<!--      :props="defaultProps"-->
<!--      :filter-node-method="filterNode"-->
<!--      ref="tree"-->
<!--      accordion-->
<!--      check-strictly-->
<!--      show-checkbox-->
<!--      node-key="id"-->
<!--      :expand-on-click-node="true"-->
<!--      @check-change="handleClick"-->
<!--    ></el-tree>-->
  </div>
</template>

<script>
import { getLeavesById } from "@/api/dataManage/query";
import { getCatalogue, getMetaByName } from "@/api/dataManage/query";
export default {
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
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'child 1-1',
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
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf:'isLeaf'
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getCatalogue();
  },
  methods: {
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'ios-paper-outline'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.label)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        })
      ]);
    },
    handleClick(data, checked, node) {
      if (checked) {
        // this.$refs.tree.setCheckedNodes([data])
        // this.selectedData = data;
        this.$emit("handleSelect", checked);
      }
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

              newData[i].id = data[i].pkId+'-'+data[i].identification;
              newData[i].identification = data[i].identification;
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

};
</script>
