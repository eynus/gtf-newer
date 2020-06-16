<template>
  <div class="custom-tree-container">
    <!-- <div class="block">
      <p>使用 render-content</p>
      <el-tree
        :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent"
      ></el-tree>
    </div>-->
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
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        ref="tree"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        default-expand-all
        :expand-on-click-node="false"
        @check-change="handleClick"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="isShowSlot(data,node)">
            <el-button type="text" size="mini" @click="() => handleAppend(data)">
              <Icon type="md-add" size="18" />
            </el-button>
            <el-button type="text" size="mini" @click="() => handleRemove(node, data)">
              <Icon type="md-trash" size="18" />
            </el-button>
          </span>
        </span>
      </el-tree>
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
    isShowSlot(node, data) {
      console.log(this.selectedData.id, data, node);

      // selectedData.id===data.id
    },
    insertZbfl() {
      insertZbfl({
        zbflCode: this.modalForm.code,
        zbflExp: this.modalForm.tip,
        zbflFid: this.selectedData.id,
        zbflName: this.modalForm.name,
        zbflYear: this.selectedYear
      }).then(res => {
        const { code, data } = res.data;
        if (code === 1000) {
          this.append(this.selectedData);
          this.modalFlag = false;
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
        const { data, code } = res.data;
        if (code === 1000) {
          const handleRawData = data => {
            let newData = [];
            for (let i = 0; i < data.length; i++) {
              newData.push({});
              if (data[i].childs.length) {
                newData[i].children = handleRawData(data[i].childs);
              }
              newData[i].id = data[i].pkId;
              newData[i].code = data[i].zbflCode;
              newData[i].label = data[i].zbflName;
            }
            return newData;
          };
          this.data = handleRawData(data);
          // generateList(this.gDatathis.gData);
          console.log(this.data);

          // this.$emit('handleTreeList',this.gData)
        }
      });
    },
    handleAppend(data) {
      this.selectedData = data;
      this.$set(this.modalForm, "type", data.label);
      this.$set(this.modalForm, "code", "A" + data.id);
      console.log("?", data);

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
      console.log(node, data);
      if (data.children && data.children.length) {
        this.$Message.warning("该文件夹下存在文件，无法删除，请先删除子文件");
      } else {
        this.delModalFlag = true;
        this.selectedData = data;
        this.selectedNode = node;
      }
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    handleClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data]);
        console.log(data);
        this.selectedData = data;
        this.$emit("handleSelect", data);
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
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    },
    // modal框确定按钮
    ok() {
      this.$refs["modalForm"].validate(valid => {
        if (valid) {
          console.log(this.modalForm);

          this.insertZbfl();
        }
      });
    },
    // modal取消按钮
    cancel() {
      this.modalFlag = false;
    },
    // 确认删除
    confirmDel() {
      //   deleteZB({ pkId: this.selectedRowIds[0] }).then(res => {
      //     const { data, code } = res.data;
      //     if (code === 1000) {
      deleteZbfl({ pkId: this.selectedData.id }).then(res => {
        const { code, data, message } = res.data;
        if (code === 1000) {
          // this.remove(this.selectedNode, this.selectedData);
          this.getTreeList();
          this.delModalFlag = false;
          this.$Message.info("删除成功");
        } else {
          this.getTreeList();
          this.$Message.warning(message);
          this.delModalFlag = false;
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

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>