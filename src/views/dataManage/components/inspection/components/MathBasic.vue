<template>
  <div class="h100">
    <div class="mt opt-area" ref="opt">
      <div class="g-button-wrapper">
        <div v-auth="['page_5_4_1']" @click="handleStartRule" class="g-button">
          <Icon :type="$btn.play" /> 启用</div>
        <div v-auth="['page_5_4_5']" @click="handleStopRule" class="g-button">
          <Icon :type="$btn.stop" /> 停用</div>
      </div>
    </div>
    <Table
      class="inspection-table"
      border
      stripe
      size="small"
      :height="tbhopt"
      :columns="tableColumns"
      :data="tableData"
      ref="selection"
      @on-select="handleSelectRow"
      @on-select-cancel="handleCancelRow"
      @on-select-all="handleSelectRowAll"
      @on-select-all-cancel="handleCancelRowAll"
    >
      <template slot="ruleStatusSlot" slot-scope="{row,index}">
        <span>{{row.ruleStatus}}</span>
      </template>
    </Table>
    <Page
      class="pagination"
      :total="page.total"
      @on-change="changePage"
      @on-page-size-change="changePageSize"
      show-total
      show-sizer
      show-elevator
      :current="page.current"
      :page-size="page.pageSize"
    ></Page>

    <Modal
      v-model="modalFlag"
      class-name="vertical-center-modal"
      title="属性结构规范性规则添加"
      @on-ok="ok"
      @on-cancel="cancel"
      :width="remToPx(45)"
    >
      <div class="modal-item">
        <div class="title mb">规则适用对象</div>
        <div>
          <Cascader :data="dataPaths" v-model="modalForm.path" @on-change="handlePathChange"></Cascader>
        </div>
      </div>
      <div class="modal-item mt position-r">
        <div class="title">属性结构定义</div>
        <div class="mt">
          <Form inline>
            <FormItem>
              <Button type="info" @click="handleAddKey" :disabled="modalForm.addKeyBtnDisabled">添加字段</Button>
            </FormItem>
            <FormItem>
              <Button
                type="warning"
                @click="handleUpdateKey"
                :disabled="modalForm.updateKeyBtnDisabled"
              >修改字段</Button>
            </FormItem>
            <FormItem>
              <Button
                type="error"
                @click="handleDeleteKey"
                :disabled="modalForm.deleteKeyBtnDisabled"
              >删除字段</Button>
            </FormItem>
          </Form>
        </div>
        <div class="overflow-hidden">
          <div
            class="flex flex-nowrap transition"
            :style="{ width: `${remToPx(90)}px`,'margin-left':`${positionLeft}px `}"
          >
            <div>
              <Table
                border
                size="small"
                :columns="modalForm.columnsPropDefine"
                :data="modalForm.dataPropDefine"
                ref="selection"
                @on-select="handleSelectKeyRow"
                @on-select-cancel="handleCancelKeyRow"
                @on-select-all="handleSelectKeyRowAll"
                @on-select-all-cancel="handleCancelKeyRowAll"
                :width="remToPx(43)"
              ></Table>
            </div>
            <div class="right-box">
              <Form
                :model="modalKeyFormItem"
                ref="modalKeyFormItem"
                :label-width="remToPx(7.5)"
                inline
              >
                <FormItem label="字段名称：">
                  <Input v-model.trim="modalKeyFormItem.keyName" />
                </FormItem>
                <FormItem label="字段类型：">
                  <Select v-model="modalKeyFormItem.keyType" style="width:10.25rem">
                    <Option value="1">Char</Option>
                    <Option value="2">Int</Option>
                    <Option value="3">String</Option>
                  </Select>
                </FormItem>
                <FormItem label="字段代码：">
                  <Input v-model="modalKeyFormItem.keyCode" />
                </FormItem>
                <FormItem label="小数位数：">
                  <Input v-model.number="modalKeyFormItem.keyDigit" />
                </FormItem>
                <FormItem label="字段长度：">
                  <Input v-model.number="modalKeyFormItem.keyLength" />
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="handleKeySubmit">提交</Button>
                  <Button style="margin-left: 8px" @click="handleKeyQuit">取消</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <my-delete :show="delModalFlag" @ok="confirmDelKey" @cancel="quitDelKey"></my-delete>
    <!-- <my-delete :title="'启用'" :show="delModalFlag" @ok="confirmDelKey" @cancel="quitDelKey"></my-delete> -->
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
import { getPaths } from "@/api/dataManage/overview";
import MyDelete from "_c/delete";
import { InspectionMixins } from "../inspection-mixins.js";
import { ivtable } from "@/mixin/table"

const handleRawData = data => {
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({});
    if (data[i].children) {
      newData[i].children = handleRawData(data[i].children);
    }
    newData[i].label = data[i].dataName;
    newData[i].value = data[i].dataName;
  }
  return newData;
};
export default {
  name: "propstruct",
  mixins: [InspectionMixins, ivtable],
  components: { MyDelete },
  data() {
    return {
      delModalFlag: false,
      positionLeft: 0,
      modalFlag: false,
      dataPaths: [],

      selectedKeyRowIds: [],
      modalForm: {
        updateKeyBtnDisabled: false,
        addKeyBtnDisabled: false,
        deleteKeyBtnDisabled: false,
        path: [""],
        columnsPropDefine: [
          {
            title: "选中",
            type: "selection",
            align: "center",
            width: remToPx(5)
          },
          {
            title: "字段名称",
            key: "name",
            align: "center",
            width: remToPx(10)
          },
          {
            title: "字段代码",
            key: "code",
            align: "center"
          },
          {
            title: "字段类型",
            key: "type",
            align: "center"
          },
          {
            title: "字段长度",
            key: "length",
            align: "center"
          },
          {
            title: "小数位数",
            key: "digit",
            align: "center"
          }
        ],
        dataPropDefine: [
          {
            name: "标识码",
            code: "BSM",
            type: "Char",
            length: 18,
            digit: ""
          },
          {
            name: "要素代码",
            code: "YSDM",
            type: "Char",
            length: 10,
            digit: ""
          },
          {
            name: "行政区代码",
            code: "XZQDM",
            type: "Char",
            length: 12,
            digit: ""
          }
        ]
      },
      modalKeyFormItem: {
        keyName: "",
        keyType: "1",
        keyCode: "",
        keyLength: "",
        keyDigit: ""
      },
      tableColumns: [
        {
          title: "选中",
          type: "selection",
          key: "time",
          align: "center",
          width: remToPx(10)
        },
        {
          title: "规则描述",
          key: "rulesName",
          // align: "center"
        },
        {
          title: "必须应用规则",
          slot: "ruleStatusSlot",
          align: "center",
          width: remToPx(10)
        }
      ],
      tableData: []
    };
  },
  mounted() {
    this.getPaths();
    console.log(this.tbhopt)
  },
  methods: {
    // 添加字段
    handleAddKey() {
      let pxNumber = this.remToPx(45);
      this.positionLeft = -pxNumber;
      this.handleDisableBtn();
    },
    // modal-置灰按钮
    handleDisableBtn() {
      this.$set(this.modalForm, "updateKeyBtnDisabled", true);
      this.$set(this.modalForm, "addKeyBtnDisabled", true);
      this.$set(this.modalForm, "deleteKeyBtnDisabled", true);
    },
    // modal-高亮按钮
    handleEnableBtn() {
      this.$set(this.modalForm, "updateKeyBtnDisabled", false);
      this.$set(this.modalForm, "addKeyBtnDisabled", false);
      this.$set(this.modalForm, "deleteKeyBtnDisabled", false);
    },
    // 修改字段
    handleUpdateKey() {
      if (this.selectedKeyRowIds.length) {
        this.positionLeft = 0;
        this.handleDisableBtn();
      } else {
        this.$Message.info("请选择所要修改的字段");
      }
    },
    // 删除字段
    handleDeleteKey() {
      if (this.selectedKeyRowIds.length) {
        this.delModalFlag = true;
      } else {
        this.$Message.info("请选择所要删除的字段");
      }
    },

    // 清空路径和所有字段
    clearPathAndKeys() {
      this.$set(this.modalForm, "dataPropDefine", []);
      this.$set(this.modalForm, "path", []);
    },
    // 清空规则
    clearFormItem() {
      this.modalKeyFormItem = {
        keyName: "",
        keyType: "",
        keyCode: "",
        keyLength: "",
        keyDigit: ""
      };
    },
    //选中路径变化
    handlePathChange(a, b) {
      this.modalForm.path = a;
      console.log(a,b);

    },
    //获取数据路径列表
    getPaths() {
      getPaths().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          let raw = (data && data.data) || [];
          let result = handleRawData(raw);
          this.dataPaths = result;
        }
      });
    },
    // 选择某一行-字段
    handleSelectKeyRow(selection, row) {
      this.selectedKeyRowIds.push(row.id + "");
    },
    handleSelectKeyRowAll(selection) {
      this.selectedKeyRowIds = selection.map((item, index) => item.id);
    },
    handleCancelKeyRow(selection, row) {
      for (let i = 0; i < this.selectedKeyRowIds.length; i++) {
        if (this.selectedKeyRowIds[i] === row.id + "") {
          this.selectedKeyRowIds.splice(i, 1);
        }
      }
    },
    handleCancelKeyRowAll(selection) {
      this.selectedKeyRowIds = [];
    },

    // 添加字段-提交
    handleKeySubmit() {
      this.$refs.modalKeyFormItem.validate(valid => {
        if (valid) {
          this.handleEnableBtn();
          this.$Message.info("添加成功！");
          this.positionLeft = 0;
          this.modalForm.dataPropDefine.push({
            name: this.modalKeyFormItem.keyName,
            code: this.modalKeyFormItem.keyCode,
            type: this.modalKeyFormItem.keyType,
            length: this.modalKeyFormItem.keyLength,
            digit: this.modalKeyFormItem.keyDigit
          });
          this.clearFormItem();
        }
      });
    },
    // 添加/修改字段-取消
    handleKeyQuit() {
      this.positionLeft = 0;
      this.handleEnableBtn();
    },
    // 确认删除字段
    confirmDelKey() {
      if (this.modalFlag) {
        // 删除字段
        console.log(this.selectedKeyRowIds);
      } else {
        console.log(this.selectedRowIds);
      }
      // 删除规则
      this.delModalFlag = false;
    },
    quitDelKey() {
      this.delModalFlag = false;
    },
    // modal框确定按钮
    ok() {
      this.clearFormItem();
      this.clearPathAndKeys();
    },
    // modal取消按钮
    cancel() {
      this.clearFormItem();
      this.clearPathAndKeys();
    }
  }
};
</script>
<style lang="scss" scoped>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.modal-item {
  .title {
    font-weight: bold;
    &:before {
      content: "";
      display: inline-block;
      width: 0.625rem;
      height: 0.625rem;
      background-color: #2d8cf0;
      // border-radius: 50%;
      margin-right: 0.375rem;
    }
  }
  .right-box {
    padding-left: 32px;
  }
}
</style>
