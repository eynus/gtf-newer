<template>
  <div>
    <div class="mt">
      <Form inline>
        <FormItem>
          <Button v-auth="['page_5_4_1']" type="success" @click="handleStartRule">默认启用</Button>
        </FormItem>
        <FormItem>
          <Button v-auth="['page_5_4_2']" type="info" @click="handleAddRule">添加规则</Button>
        </FormItem>
        <FormItem>
          <Button v-auth="['page_5_4_3']" type="warning" @click="handleUpdateRule">修改规则</Button>
        </FormItem>
        <FormItem>
          <Button v-auth="['page_5_4_4']" type="error" @click="handleDeleteRule">删除规则</Button>
        </FormItem>
      </Form>
    </div>
    <Table
      border
      size="small"
      :columns="tableColumns"
      :data="tableData"
      ref="selection"
      @on-select="handleSelectRow"
      @on-select-cancel="handleCancelRow"
      @on-select-all="handleSelectRowAll"
      @on-select-all-cancel="handleCancelRowAll"
    >
      <template slot="ruleStatusSlot" slot-scope="{row,index}">
        <span :style="`color:${row.ruleStatus==='启用'?'rgb(81,81,81)':'#f00'}`">{{row.ruleStatus}}</span>
      </template>
    </Table>
    <div class="text-right mr-lg mt">
      <Page
        :total="page.total"
        @on-change="changePage"
        show-total
        show-elevator
        :current="page.current"
        :page-size="page.pageSize"
      ></Page>
    </div>

    <Modal
      v-model="modalFlag"
      class-name="vertical-center-modal"
      title="属性结构规范性规则添加"
      :width="remToPx(45)"
    >
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确定</Button>
      </div>
      <div class="modal-item">
        <div class="title mb">规则适用对象</div>
        <div>
          <!-- <Input v-model.trim="modalForm.obj" placeholder="请输入" clearable /> -->
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
                :rules="modalKeyFormRuleValidate"
                :label-width="remToPx(7.5)"
                inline
              >
                <FormItem label="字段名称：" prop="keyName">
                  <Input v-model.trim="modalKeyFormItem.keyName" />
                </FormItem>
                <FormItem label="字段类型：" prop="keyType">
                  <Select v-model="modalKeyFormItem.keyType" style="width:10.25rem">
                    <Option value="Char">Char</Option>
                    <Option value="Int">Int</Option>
                    <Option value="String">String</Option>
                  </Select>
                </FormItem>
                <FormItem label="字段代码：" prop="keyCode">
                  <Input v-model="modalKeyFormItem.keyCode" />
                </FormItem>
                <FormItem label="小数位数：" prop="keyDigit">
                  <Input v-model.number="modalKeyFormItem.keyDigit" />
                </FormItem>
                <FormItem label="字段长度：" prop="keyLength">
                  <Input v-model.trim="modalKeyFormItem.keyLength" />
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
    <my-delete :show="delModalFlag" @ok="confirmDel" @cancel="quitDel"></my-delete>
    <my-delete :show="delModalKeyFlag" @ok="confirmDelKey" @cancel="quitDelKey"></my-delete>
  </div>
</template>
<script>
import { addRules, updateRules } from "@/api/dataManage/inspection";
import { remToPx } from "@/utils/common";
import { getPaths } from "@/api/dataManage/overview";
import MyDelete from "_c/delete";
import { InspectionMixins } from "../inspection-mixins.js";

const handleRawData = data => {
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({});
    if (data[i].children) {
      newData[i].children = handleRawData(data[i].children);
    }
    newData[i].label = data[i].dataName;
    newData[i].pkId = data[i].pkId;
    newData[i].value = data[i].dataName;
  }
  return newData;
};
export default {
  name: "propstruct",
  mixins: [InspectionMixins],
  components: { MyDelete },
  data() {
    return {
      activeRow: {},
      activeKeyRow: {},
      delModalKeyFlag: false,
      positionLeft: 0,
      modalFlag: false,
      isKeyFormUpdate: false,

      dataPaths: [],
      modalKeyFormRuleValidate: {
        keyName: [
          {
            required: true,
            message: "字段名称不能为空",
            trigger: "blur"
          }
        ],
        keyCode: [
          {
            required: true,
            message: "字段代码不能为空",
            trigger: "blur"
          }
        ],
        keyType: [
          {
            required: true,
            message: "字段类型不能为空",
            trigger: "blur"
          }
        ],
        keyLength: [
          {
            required: true,
            message: "字段长度不能为空",
            trigger: "blur"
          }
        ]
      },
      selectedKeyRowIds: [],
      modalForm: {
        updateKeyBtnDisabled: false,
        addKeyBtnDisabled: false,
        deleteKeyBtnDisabled: false,
        path: [""],
        pathChildNodeId: "",
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
          // {
          //   name: "标识码",
          //   code: "BSM",
          //   type: "Char",
          //   length: 18,
          //   digit: ""
          // },

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
          align: "center"
        },
        {
          title: "默认启用",
          slot: "ruleStatusSlot",
          align: "center",
          width: remToPx(10)
        }
      ],
      tableData: []
    };
  },
  created() {
    this.getPaths();
  },
  methods: {
    // 修改规则
    handleUpdateRule() {
      // 判断是否只选了一个
      if (this.selectedRowIds.length) {
        if (this.selectedRowIds.length === 1) {
          this.isRuleUpdate = true;
          this.modalFlag = true;
          this.activeRow = this.tableData.find(
            item => String(item.pkId) === this.selectedRowIds[0]
          );
          this.$set(this.modalForm,'pathChildNodeId',this.activeRow.id)
          let rdIdentify = JSON.parse(this.activeRow.rdIdentify);
          this.$set(
            this.modalForm,
            "dataPropDefine",
            rdIdentify.dataPropDefine
          );
          this.$set(this.modalForm, "path", rdIdentify.path);

        } else {
          this.$Message.info("修改操作只针对单个规则！请重新选择。");
        }
      } else {
        this.$Message.info("请选择所要修改的规则");
      }
    },
    // 添加字段
    handleAddKey() {
      this.isKeyFormUpdate = false;
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
        if (this.selectedKeyRowIds.length === 1) {
          let pxNumber = this.remToPx(45);
          this.positionLeft = -pxNumber;
          this.handleDisableBtn();
          // 赋值
          this.modalKeyFormItem = {
            id: this.activeKeyRow.id,
            keyName: this.activeKeyRow.name,
            keyType: this.activeKeyRow.type,
            keyCode: this.activeKeyRow.code,
            keyLength: this.activeKeyRow.length,
            keyDigit: this.activeKeyRow.digit
          };
          this.isKeyFormUpdate = true;
        } else {
          this.$Message.info("修改操作只针对单个字段！请重新选择。");
        }
      } else {
        this.$Message.info("请选择所要修改的字段");
      }
    },
    // 删除字段
    handleDeleteKey() {
      if (this.selectedKeyRowIds.length) {
        this.delModalKeyFlag = true;
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
      this.modalForm.pathChildNodeId = b[b.length - 1].pkId;

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
    handleSelectKeyRow(selection, row, index) {
      this.activeKeyRow = row;
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
          if (this.isKeyFormUpdate) {
            this.$Message.info("修改成功！");
          } else {
            this.$Message.info("添加成功！");
          }
          this.positionLeft = 0;
          if (this.isKeyFormUpdate) {
            // 更新
            let targetIdx = this.modalForm.dataPropDefine.findIndex(
              item => item.id === this.modalKeyFormItem.id
            );
            this.$set(this.modalForm.dataPropDefine, targetIdx, {
              id: this.modalKeyFormItem.id,
              name: this.modalKeyFormItem.keyName,
              code: this.modalKeyFormItem.keyCode,
              type: this.modalKeyFormItem.keyType,
              length: this.modalKeyFormItem.keyLength,
              digit: this.modalKeyFormItem.keyDigit
            });
          } else {
            // 新增-插入
            this.modalForm.dataPropDefine.push({
              id: this.modalForm.dataPropDefine.length + 1,
              name: this.modalKeyFormItem.keyName,
              code: this.modalKeyFormItem.keyCode,
              type: this.modalKeyFormItem.keyType,
              length: this.modalKeyFormItem.keyLength,
              digit: this.modalKeyFormItem.keyDigit
            });
          }
          this.clearFormItem();
          // this.modalFlag = false;
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
      this.modalForm.dataPropDefine = this.modalForm.dataPropDefine.filter(
        item => this.selectedKeyRowIds.findIndex(it => it === item.id + "") < 0
      );
      this.$Message.info("删除成功！");
      // 删除规则
      this.delModalKeyFlag = false;
    },
    quitDelKey() {
      this.delModalKeyFlag = false;
    },

    // modal框确定按钮
    ok() {
      if (!this.modalForm.path[0]) {
        this.$Message.info("请选择规则适用对象");
        return;
      } else if (!this.modalForm.dataPropDefine.length) {
        this.$Message.info("请添加字段");
        return;
      } else {
        let newData = {
          dataPropDefine: this.modalForm.dataPropDefine,
          path: this.modalForm.path
        };
        let rulesNameConcat = `${this.modalForm.path[this.modalForm.path.length-1]}属性结构符合要求，包括数量、名称、类型、长度、小数位数均符合要求`
        // 请求addRules接口
        let postData ={
          createdBy: this.activeRow.createdBy,
          createdTime: "",
          dataName: this.activeRow.dataName,
          dsPkid: String(this.modalForm.pathChildNodeId),
          pkId: this.activeRow.id,
          rdIdentify: JSON.stringify(newData),
          rulesCode: this.activeRow.rulesCode,
          rulesMlId: this.$route.query.id,
          rulesName: rulesNameConcat,//自己拼接
          unCheck: this.activeRow.unCheck,
          unRead: this.activeRow.unRead,
          unUpdate: this.activeRow.unUpdate,
          updatedBy: this.activeRow.updatedBy,
          updatedTime: this.activeRow.updatedTime,
          validity: this.activeRow.validity
        };
        if (this.isRuleUpdate) {
          updateRules(postData).then(res => {
            const { data, code } = res.data;
            if (code === 1000) {
              this.$Message.info("修改成功");
              this.getZJListPageById();
            } else {
              this.$Message.info("服务异常，请稍后再试。");
            }
          });
          this.modalFlag = false;
          this.clearFormItem();
          this.clearPathAndKeys();
        } else {


          addRules(postData).then(res => {
            const { data, code } = res.data;
            if (code === 1000) {
              this.$Message.info("添加成功");
              this.getZJListPageById();
            } else {
              this.$Message.info("服务异常，请稍后再试。");
            }
          });
          this.modalFlag = false;
          this.clearFormItem();
          this.clearPathAndKeys();
        }
      }
    },
    // modal取消按钮
    cancel() {
      this.modalFlag = false;
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
