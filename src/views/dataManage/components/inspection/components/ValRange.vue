<template>
  <div>
    <div class="mt flex flex-sb">
      <div>
        <Form inline>
          <FormItem>
            <Button type="success" @click="handleStartRule">默认启用</Button>
          </FormItem>
          <FormItem>
            <Button type="info" @click="handleAddRule">添加规则</Button>
          </FormItem>
          <FormItem>
            <Button type="warning" @click="handleUpdateRule">修改规则</Button>
          </FormItem>
          <FormItem>
            <Button type="error" @click="handleDeleteRule">删除规则</Button>
          </FormItem>
        </Form>
      </div>
      <div>
        <Form :label-width="remToPx(6.25)" inline>
          <FormItem label="规则使用对象：">
            <Input v-model="queryRulesFitObj" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleQuery">查询</Button>
          </FormItem>
        </Form>
      </div>
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
      title="值域规范性规则添加"
      :width="remToPx(45)"
    >
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确定</Button>
      </div>
      <div class="modal-item">
        <div class="title mb">规则适用对象</div>
        <div>
          <Cascader :data="dataPaths" v-model="modalForm.path" @on-change="handlePathChange"></Cascader>
        </div>
      </div>
      <div class="modal-item">
        <div class="title mt mb">规则描述</div>
        <div>
          <Input v-model="modalForm.ruleDesc" disabled />
        </div>
      </div>
      <div class="modal-item mt position-r">
        <div class="title">规则定义</div>
        <div class="mb text-right">
          <Button type="primary" :size="'small'" @click="handleModalAddRule">新建规则项</Button>
          <!-- <Form inline>
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
          </Form>-->
        </div>
        <div class="overflow-hidden pd rule-define-wrap">
          <div
            class="rule-define-row flex flex-sb mt-lg mb"
            v-for="(item,index) in modalForm.ruleDefineData"
            :key="`data_${index}`"
          >
            <div>
              <Select
                v-model="item.selectedValFirst"
                style="width:8rem"
                @on-change="handleValRangeFirstChange"
              >
                <Option
                  :value="item1.domainName"
                  v-for="(item1,index1) in valRangeFirstArr"
                  :key="`vrf_${index1}`"
                >{{item1.domainName}}</Option>
              </Select>
              <Select v-model="item.selectedValSecond" style="width:6rem" class="ml">
                <Option
                  :value="item2.code"
                  v-for="(item2,index2) in valRangeSecondArr"
                  :key="`vfs_${index2}`"
                >{{item2.codeDes}}</Option>
              </Select>
              <Select v-model="item.selectedValRelation" style="width:6rem" class="ml">
                <Option
                  :value="item3.code"
                  v-for="(item3,index3) in valRangeRelationArr"
                  :key="`vfr_${index3}`"
                >{{item3.codeDes}}</Option>
              </Select>
            </div>
            <div>
              <Icon :size="remToPx(1.25)" type="md-create" />
              <Icon :size="remToPx(1.25)" type="md-trash" class="ml mr cursor-pointer" @click="handleAskDeleteDefine(item.id)"/>
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
  getValRangeRuleCodeList
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
  name: "valRange",
  mixins: [InspectionMixins],
  components: { MyDelete },
  data() {
    return {
      activeRowId:0,
      valRangeRelationArr: [
        { codeDes: "并且", code: "1" },
        { codeDes: "或者", code: "0" }
      ],
      // selectedValFirst: "1",
      // selectedValSecond: "1",
      // selectedValRelation: "1",
      valRangeFirstArr: [],
      valRangeSecondArr: [],
      valRangeRuleCodeList: [],

      activeRow: {},
      activeKeyRow: {},
      delModalKeyFlag: false,
      positionLeft: 0,
      modalFlag: false,
      isKeyFormUpdate: false,

      dataPaths: [],

      selectedKeyRowIds: [],
      ruleDefineDataDemo: {
        selectedValFirst: "1",
        selectedValSecond: "1",
        selectedValRelation: "1"
      },
      modalForm: {
        path: [""],
        ruleDesc: "ceshi",
        ruleDefineData: [
          {
            id: 1,
            selectedValFirst: "1",
            selectedValSecond: "1",
            selectedValRelation: "1"
          }
        ],
        // updateKeyBtnDisabled: false,
        // addKeyBtnDisabled: false,
        // deleteKeyBtnDisabled: false,
        pathChildNodeId: "",

        dataPropDefine: []
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
          title: "规则适用对象",
          key: "rulesFitObj",
          align: "center"
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
    this.getValRangeRuleCodeList();
  },
  methods: {
    // 点击删除icon
    handleAskDeleteDefine(id){
      this.activeRowId = id
      this.delModalKeyFlag=true
    },
    // 新建规则
    handleModalAddRule() {
      this.modalForm.ruleDefineData.push(
        Object.assign({
          id: this.modalForm.ruleDefineData.length + 1,
          ...this.ruleDefineDataDemo
        })
      );
    },
    // 查询
    handleQuery() {
      this.page.current = 1;
      this.getZJListPageById();
    },
    // 二级联动
    handleValRangeFirstChange(e, b) {
      this.valRangeSecondArr = this.valRangeRuleCodeList.find(
        item => item.domainName === this.selectedValFirst
      ).children;
      this.selectedValSecond = this.valRangeSecondArr[0].code;
    },
    // 获取属性域代码表
    getValRangeRuleCodeList() {
      getValRangeRuleCodeList().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.valRangeRuleCodeList = data;
          this.valRangeFirstArr = this.valRangeRuleCodeList;
          this.valRangeSecondArr =
            this.valRangeRuleCodeList.length &&
            this.valRangeRuleCodeList[0].children;

          // 设置默认选中项
          this.ruleDefineDataDemo = {
            selectedValFirst: this.valRangeFirstArr[0].domainName,
            selectedValSecond: this.valRangeSecondArr[0].code,
            selectedValRelation: "1"
          };

          this.$set(this.modalForm, "ruleDefineData", [{
            id: 1,
            ...this.ruleDefineDataDemo
          }]);
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
          this.$set(this.modalForm, "pathChildNodeId", this.activeRow.id);
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
    // // modal-置灰按钮
    // handleDisableBtn() {
    //   this.$set(this.modalForm, "updateKeyBtnDisabled", true);
    //   this.$set(this.modalForm, "addKeyBtnDisabled", true);
    //   this.$set(this.modalForm, "deleteKeyBtnDisabled", true);
    // },
    // // modal-高亮按钮
    // handleEnableBtn() {
    //   this.$set(this.modalForm, "updateKeyBtnDisabled", false);
    //   this.$set(this.modalForm, "addKeyBtnDisabled", false);
    //   this.$set(this.modalForm, "deleteKeyBtnDisabled", false);
    // },
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
      this.modalForm.ruleDefineData = this.modalForm.ruleDefineData.filter(
        item => this.activeRowId!==item.id
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
      } else if (!this.modalForm.ruleDefineData.length) {
        this.$Message.info("请添加规则定义");
        return;
      } else {
        let newData = {
          dataPropDefine: this.modalForm.ruleDefineData,
          path: this.modalForm.path,
          ruleDesc:this.modalForm.ruleDesc
        };
        // 请求addRules接口
        let postData = {
          createdBy: this.activeRow.createdBy,
          createdTime: "",
          dataName: this.activeRow.dataName,
          dsPkid: String(this.modalForm.pathChildNodeId),
          pkId: this.activeRow.id,
          rdIdentify: JSON.stringify(newData),
          rulesCode: this.activeRow.rulesCode,
          rulesMlId: this.$route.query.id,
          rulesName: this.activeRow.rulesName,
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
      margin-right: 0.375rem;
    }
  }
  .rule-define-wrap {
    height: 12.5rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .rule-define-row {
    padding-bottom: 0.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>