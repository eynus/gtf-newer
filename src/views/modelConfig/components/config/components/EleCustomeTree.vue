<template>
  <div class="custom-tree-container">
    <div class="text-right">
      <Select
        :clearable="true"
        v-model="selectedYear"
        class="scroll dropdown text-center"
        style="width:5rem"
        @on-change="handleYearChange"
      >
        <Option v-for="item in yearList" :value="item" :key="item">
          {{
          item
          }}
        </Option>
      </Select>
    </div>
    <div class="block">
      <Tree
          class="tree"
          children-key="childs"
          :multiple="false"
          :data="data"
          :render="treeRender"
          @on-select-change="handleClick">
      </Tree>
<!--      <el-tree-->
<!--        :data="data"-->
<!--        show-checkbox-->
<!--        check-strictly-->
<!--        node-key="id"-->
<!--        ref="tree"-->
<!--        @node-drag-start="handleDragStart"-->
<!--        @node-drag-enter="handleDragEnter"-->
<!--        @node-drag-leave="handleDragLeave"-->
<!--        @node-drag-over="handleDragOver"-->
<!--        @node-drag-end="handleDragEnd"-->
<!--        @node-drop="handleDrop"-->
<!--        draggable-->
<!--        :allow-drop="allowDrop"-->
<!--        :allow-drag="allowDrag"-->
<!--        default-expand-all-->
<!--        :expand-on-click-node="false"-->
<!--        @check-change="handleClick"-->
<!--      >-->
<!--        <span class="custom-tree-node" slot-scope="{ node, data }">-->
<!--          <span>{{ node.label }}</span>-->
<!--          <span v-if="isShowSlot(data,node)">-->
<!--            <el-button type="text" size="mini" @click="() => handleAppend(data,node)">-->
<!--              <Icon type="md-add" size="18" />-->
<!--            </el-button>-->
<!--            <el-button type="text" size="mini" @click="() => handleRemove(node, data)">-->
<!--              <Icon type="md-trash" size="18" />-->
<!--            </el-button>-->
<!--          </span>-->
<!--        </span>-->
<!--      </el-tree>/-->
    </div>
    <Modal
      v-model="modalFlag"
      class-name="vertical-center-modal"
      title="添加指标分类"
      :width="remToPx(40)"
    >
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
        <Button @click="cancel">取消</Button>
      </div>
      <Form ref="modalForm" :model="modalForm" :label-width="remToPx(12)" :rules="ruleInline">
        <FormItem label="上级分类：" prop="type">
          <Input disabled v-model.trim="modalForm.type" style="width:14rem" />
        </FormItem>
        <FormItem label="指标代码：">
          <Input disabled v-model.trim="modalForm.code" style="width:14rem" />
        </FormItem>
        <FormItem label="指标名称：" prop="name">
          <Input v-model.trim="modalForm.name" style="width:14rem" />
        </FormItem>
        <FormItem label="备注：" prop="tip">
          <Input v-model.trim="modalForm.tip" style="width:14rem" />
        </FormItem>
      </Form>
    </Modal>
    <my-delete :show="delModalFlag" @ok="confirmDel" @cancel="delModalFlag=false"></my-delete>
  </div>
</template>

<script>
import {
  getTreeList,
  getYear,
  deleteZbfl,
  insertZbfl
} from "@/api/modelConfig/config";

import MyDelete from "_c/delete";
let id = 1000;

export default {
  data() {
    return {
      yearList: [],
      selectedYear: "",
      selectedData: {},
      selectedNode: {},
      data: [],
      modalForm: { type: "", name: "", code: "", tip: "" },
      ruleInline: {
        type: [
          //   {
          //     required: true,
          //     message: "指标类型不能为空.",
          //     trigger: "change",
          //     type: "number"
          //   }
        ],
        name: [
          {
            required: true,
            message: "分类名称不能为空",
            trigger: "blur"
            // validator: (rule, value, callback) => {
            //   if (!value) {
            //     callback(new Error("附件不能为空"));
            //   } else {
            //     callback();
            //   }
            // }
          }
        ]
      },
      modalFlag: false,
      delModalFlag: false
    };
  },
  components: {
    MyDelete
  },
  created() {
    this.getYear();
  },
  methods: {
    treeRender(h, { root, node, data }) {
      if (data.pkId === 0) {
        return h('span', {
          props: {
            expand: true
          }
        }, [
          h('span', data.zbflName),
          h('Icon', {
            props: {
              type: 'md-add',
              size: 16
            },
            class: 'tree-tool',
            style: {
              marginLeft: '18px'
            },
            attrs: {
              title: '新增'
            },
            on: {
              click: () => {
                this.handleAppend(node, data)
              }
            }
          }),
        ])
      } else {
        return h('span', {
          props: {
            expand: true
          }
        }, [
          h('span', data.zbflName),
          h('Icon', {
            props: {
              type: 'md-add',
              size: 16
            },
            class: 'tree-tool',
            style: {
              marginLeft: '18px'
            },
            attrs: {
              title: '新增'
            },
            on: {
              click: () => {
                this.handleAppend(node, data)
              }
            }
          }),
          h('Icon', {
            props: {
              type: 'md-trash',
              size: 16
            },
            class: 'tree-tool',
            style: {
              marginLeft: '8px'
            },
            attrs: {
              title: '删除'
            },
            on: {
              click: () => {
                this.handleRemove(node, data)
              }
            }
          }),
        ])
      }
    },
    // 判断这个节点在不在所勾选的节点的这条回溯路径上：显不显示控制按钮
    isShowSlot(data) {
      return (
        (this.selectedData.code &&
          this.selectedData.code.includes(data.code)) ||
        false
      );
      //它是选中节点的祖先
    },
    insertZbfl() {
      insertZbfl({
        zbflCode: this.modalForm.code,
        zbflExp: this.modalForm.tip,
        zbflFid: this.selectedData.pkId,
        zbflName: this.modalForm.name,
        zbflYear: this.selectedYear
      }).then(res => {
        const { code, data, message } = res.data;
        if (code === 1000) {
          if (this.modalFlag) {
            this.modalFlag = false;
            this.$refs.modalForm.resetFields();
          }
          this.getTreeList();

          this.$Message.info("添加成功");
        } else {
          this.$Message.warning(message);
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
    handleYearChange() {
      this.getTreeList();
    },
    getTreeList() {
      getTreeList({ zbflYear: this.selectedYear }).then(res => {
        let { data, code } = res.data;
        if (code === 1000) {
          // const handleRawData = data => {
          //   let newData = [];
          //   for (let i = 0; i < data.length; i++) {
          //     newData.push({});
          //     if (data[i].childs.length) {
          //       newData[i].children = handleRawData(data[i].childs);
          //     }
          //     newData[i].id = data[i].pkId;
          //     newData[i].code = data[i].zbflCode;
          //     newData[i].label = data[i].zbflName;
          //   }
          //   return newData;
          // };
          data = [{
            zbflName: '全部分类',
            zbflCode: 'A',
            zbflFid: 0,
            pkId: 0,
            childs: data
          }]
          this.data = this.handleRow(data);
          this.selectedData = {}
          // this.$emit('handleTreeList',this.gData)
        }
      });
    },
    handleRow(data) {
        for (let i = 0; i < data.length; i++) {
          data[i]['expand'] = true
          if (data[i].childs.length) {
            data[i].childs = this.handleRow(data[i].childs);
          }
        }
        return data;
    },
    handleAppend(node, data) {
      let len = node.childs.length + 1;
      let lenStr = len < 10 ? "0" + len : len;
      this.selectedData = data;
      this.$set(this.modalForm, "type", data.zbflName);
      this.$set(this.modalForm, "code", data.zbflCode + "-" + lenStr);
      this.modalFlag = true;
      //   this.append(data)
    },
    append(data) {
      const newChild = { id: id++, label: this.modalForm.name, children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    handleRemove(node, data) {
      if (data.childs && data.childs.length) {
        this.$Message.warning("该分类下存在子分类，无法删除，请先删除子分类")
        return 0
      }
      this.delModalFlag = true;
      this.selectedData = data;
      this.selectedNode = node;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    handleClick(data, checked) {
      if (!checked.selected) {
        this.$emit("handleSelect", null)
        return 0
      }
      if (checked && checked.zbflFid !== 0) {
        // this.$refs.tree.setCheckedNodes([data]);
        // this.selectedData = data;
        this.$emit("handleSelect", checked)
      }
    },
    handleDragStart(node, ev) {
      console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      // if (dropNode.data.label === "二级 3-1") {
        console.log(type);

        return type !== "inner";//不允许拖拽到子目录中
      // } else {
        // return true;
      // }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    },
    // modal框确定按钮
    ok() {
      this.$refs["modalForm"].validate(valid => {
        if (valid) {
          this.insertZbfl();
        }
      });
    },
    // modal取消按钮
    cancel() {
      this.modalFlag = false;
      this.$refs.modalForm.resetFields();
    },
    // 确认删除
    confirmDel() {
      //   deleteZB({ pkId: this.selectedRowIds[0] }).then(res => {
      //     const { data, code } = res.data;
      //     if (code === 1000) {
      deleteZbfl({ pkId: this.selectedData.pkId }).then(res => {
        const { code, data, message } = res.data;
        this.getTreeList()
        if (code === 1000) {
          // this.remove(this.selectedNode, this.selectedData);
          this.delModalFlag = false
          this.$Message.info("删除成功")
        } else {
          this.$Message.warning(message)
          this.delModalFlag = false
        }
      });
    }
    // renderContent(h, { node, data, store }) {
    //   return (
    //     <span class="custom-tree-node">
    //       <span>{node.label}</span>
    //       <span>
    //         <el-button
    //           size="mini"
    //           type="text"
    //           on-click={() => this.append(data)}
    //         >
    //           Append
    //         </el-button>
    //         <el-button
    //           size="mini"
    //           type="text"
    //           on-click={() => this.remove(node, data)}
    //         >
    //           Delete
    //         </el-button>
    //       </span>
    //     </span>
    //   );
    // }
  }
};
</script>

<style lang="scss" scoped>
// .custom-tree-container{
//     display: flex;
// }
.tree {
  ::v-deep .ivu-tree-children {
    .tree-tool {
      display: none;
    }
    .ivu-tree-title {
      &:hover {
        .tree-tool{
          display: inline-block;
        }
      }
    }
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
