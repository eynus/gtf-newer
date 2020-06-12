<template>
  <div>
    <div class="mt">
      <Form inline>
        <FormItem>
          <Button v-auth="['page_5_4_1']" type="success" @click="handleStartRule">默认启用</Button>
        </FormItem>
        <FormItem>
          <Button v-auth="['page_5_4_5']" type="primary" @click="handleStopRule">停止启用</Button>
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
        <span :class="`${row.ruleStatus==='启用'?'text-blue':'text-normal'}`">{{row.ruleStatus}}</span>
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
      :width="remToPx(50)"
    >
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
        <Button @click="cancel">取消</Button>
      </div>
      <div class="modal-item">
        <div class="title mb">规则适用对象</div>
        <div>
          <!-- <Input v-model.trim="modalForm.obj" placeholder="请输入" clearable /> -->
          <Cascader
            :disabled="isRuleUpdate"
            :data="dataPaths"
            v-model="modalForm.path"
            @on-change="handlePathChange"
          ></Cascader>
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
        <div class="overflow-hidden-x zt-scroll-y">
          <!-- <div> -->
          <div
            class="flex flex-nowrap transition"
            :style="{ width: `${remToPx(98)}px`,'margin-left':`${positionLeft}px `}"
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
                :width="remToPx(48)"
              ></Table>
            </div>
            <div class="right-box">
              <Row>
                <Form
                  :model="modalKeyFormItem"
                  ref="modalKeyFormItem"
                  :rules="modalKeyFormRuleValidate"
                  :label-width="remToPx(7.5)"
                  inline
                >
                  <i-col span="12">
                    <FormItem label="字段名称：" prop="keyName">
                      <Input v-model.trim="modalKeyFormItem.keyName" />
                    </FormItem>
                  </i-col>
                  <i-col span="12">
                    <FormItem label="字段代码：" prop="keyCode">
                      <Input v-model="modalKeyFormItem.keyCode" />
                    </FormItem>
                  </i-col>
                  <i-col span="12">
                    <FormItem label="字段类型：" prop="keyType">
                      <Select
                        v-model="modalKeyFormItem.keyType"
                        style="width:10.25rem"
                        @on-change="handleKeyTypechange"
                      >
                        <Option value="Char">Char</Option>
                        <Option value="VarChar">VarChar</Option>
                        <Option value="Int">Int</Option>
                        <Option value="Float">Float</Option>
                        <Option value="Date">Date</Option>
                      </Select>
                    </FormItem>
                  </i-col>
                  <i-col span="12">
                    <FormItem label="字段长度：" prop="keyLength">
                      <Input v-model.trim="modalKeyFormItem.keyLength" />
                    </FormItem>
                  </i-col>
                  <i-col span="12">
                    <FormItem
                      label="小数位数："
                      prop="keyDigit"
                      v-if="modalKeyFormItem.keyType==='Float'"
                    >
                      <Input v-model="modalKeyFormItem.keyDigit" />
                    </FormItem>
                  </i-col>
                </Form>
              </Row>
              <div class="text-right divided mr-lg">
                <Button type="primary" @click="handleKeySubmit">提交</Button>
                <Button style="margin-left: 8px" @click="handleKeyQuit">取消</Button>
              </div>
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
import {
  addRules,
  updateRules,
  getVRRKeyListById
} from "@/api/dataManage/inspection";
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
      canISelect: true,
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
            key: "FieldName",
            align: "center",
            width: remToPx(10)
          },
          {
            title: "字段代码",
            key: "FieldCode",
            align: "center"
          },
          {
            title: "字段类型",
            key: "FieldType",
            align: "center"
          },
          {
            title: "字段长度",
            key: "FieldLength",
            align: "center"
          },
          {
            title: "小数位数",
            key: "DecimalLength",
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
          key: "rulesName"
          // align: "center"
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
    this.activeRow.rulesCode = this.$route.query.rules_code;
  },
  methods: {
    // 获取字段代码表-判断能否选择该适用对象
    getVRRKeyListById() {
      getVRRKeyListById({ pkId: this.modalForm.pathChildNodeId }).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          if (data.length) {
            // 有数据说明不可选择
            this.canISelect = false;
               this.$Message.warning("该适用对象规则已存在，不能重复添加。");
          } else {
            this.canISelect = true;
          }
        }
      });
    },
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
          this.$set(this.modalForm, "pathChildNodeId", this.activeRow.dsPkid);
          this.$set(
            this.modalForm,
            "dataPropDefine",
            this.activeRow.rdIdentify
          );
          this.$set(this.modalForm, "path", this.activeRow.path);
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
      let pxNumber = this.remToPx(50);
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
          let pxNumber = this.remToPx(50);
          this.positionLeft = -pxNumber;
          this.handleDisableBtn();
          // 赋值
          this.modalKeyFormItem = {
            id: this.activeKeyRow.id,
            keyName: this.activeKeyRow.FieldName,
            keyType: this.activeKeyRow.FieldType,
            keyCode: this.activeKeyRow.FieldCode,
            keyLength: this.activeKeyRow.FieldLength,
            keyDigit: this.activeKeyRow.DecimalLength
          };
          this.isKeyFormUpdate = true;
        } else {
          console.log(this.selectedKeyRowIds.length);
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
      //  console.log("??2", this.modalForm, this.modalForm.dataPropDefine,b);
      this.modalForm.path = a;
      this.modalForm.pathChildNodeId = b[b.length - 1].pkId;
      this.getVRRKeyListById();
    },
    //获取数据路径列表
    getPaths() {
      getPaths().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          let raw = (data && data.data) || [];
          let result = handleRawData(raw);
          this.dataPaths = result;
          console.log(this.dataPaths, "????");
        }
      });
    },
    // 选择某一行-字段
    handleSelectKeyRow(selection, row, index) {
      this.activeKeyRow = row;
      this.selectedKeyRowIds.push(row.id + "");
    },
    handleSelectKeyRowAll(selection) {
      this.selectedKeyRowIds = selection.map((item, index) => item.id + "");
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

    // 添加修改字段-提交
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
            this.selectedKeyRowIds = [];
            // 更新
            let targetIdx = this.modalForm.dataPropDefine.findIndex(
              item => item.id === this.modalKeyFormItem.id
            );
            this.$set(this.modalForm.dataPropDefine, targetIdx, {
              id: this.modalKeyFormItem.id,
              FieldName: this.modalKeyFormItem.keyName,
              FieldCode: this.modalKeyFormItem.keyCode,
              FieldType: this.modalKeyFormItem.keyType,
              FieldLength: this.modalKeyFormItem.keyLength,
              DecimalLength: this.modalKeyFormItem.keyDigit
            });
          } else {
            this.selectedKeyRowIds = [];
            // 新增-插入
            this.modalForm.dataPropDefine.push({
              id: this.modalForm.dataPropDefine.length + 1,
              FieldName: this.modalKeyFormItem.keyName,
              FieldCode: this.modalKeyFormItem.keyCode,
              FieldType: this.modalKeyFormItem.keyType,
              FieldLength: this.modalKeyFormItem.keyLength,
              DecimalLength: this.modalKeyFormItem.keyDigit
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
      this.selectedKeyRowIds = []; //selectedKeyRowIds删除对应id

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
        // console.log("??2", this.modalForm, this.modalForm.dataPropDefine);

        // let newData = this.modalForm.dataPropDefine
        let rulesNameConcat = `${
          this.modalForm.path[this.modalForm.path.length - 1]
        }属性结构符合要求，包括数量、名称、类型、长度、小数位数均符合要求`;
        // 请求addRules接口
        let postData = {
          createdBy: this.activeRow.createdBy,
          createdTime: "",
          dataName: this.activeRow.dataName,
          dsPkid: String(this.modalForm.pathChildNodeId),
          pkId: this.activeRow.id,
          dataPath: this.modalForm.path.join(","),
          rdIdentify: JSON.stringify(this.modalForm.dataPropDefine),
          rulesCode: this.activeRow.rulesCode,
          rulesMlId: this.$route.query.id,
          rulesName: rulesNameConcat, //自己拼接
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
          this.selectedRowIds = [];
        } else {
          if (this.canISelect) {
            addRules(postData).then(res => {
              const { data, code, message } = res.data;
              if (code === 1000) {
                this.$Message.info("添加成功");
                this.getZJListPageById();
                this.modalFlag = false;
                this.clearFormItem();
                this.clearPathAndKeys();
                this.selectedRowIds = [];
              } else if (code === 2001) {
                this.$Message.warning(message);
              } else {
                this.$Message.info("服务异常，请稍后再试。");
              }
            });
          } else {
            this.$Message.warning("该适用对象规则已存在，不能重复添加。");
          }
        }
      }
    },
    // modal取消按钮
    cancel() {
      this.modalFlag = false;
      this.clearFormItem();
      this.clearPathAndKeys();
    },
    handleKeyTypechange(e) {
      // console.log(e);
      if (e !== "Float") {
        this.modalKeyFormItem.keyDigit = "";
      }
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
    min-height: 15rem;
    width: 48rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    // border-radius: 4px;
    padding: 1.25rem 0;
    margin-left: 2rem;
    // margin-right: 2rem;
    .divided {
      margin-top: 1.75rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding-top: 1rem;
    }
  }
}
</style>
