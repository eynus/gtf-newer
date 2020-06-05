<template>
  <div>
    <div class="mt flex flex-sb">
      <div>
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
      <div>
        <Form :label-width="200" inline>
          <FormItem label="规则适用对象：">
            <Input v-model="queryRulesFitObj" clearable/>
          </FormItem>
          <FormItem :label-width="remToPx(2)">
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
                :disabled="!item.activated"
              >
                <Option
                  :value="item1.domainName"
                  v-for="(item1,index1) in valRangeFirstArr"
                  :key="`vrf_${index1}`"
                >{{item1.domainName}}</Option>
              </Select>
              <Select
                v-model="item.selectedValSecond"
                @on-change="handleValRangeSecondChange"
                style="width:6rem"
                class="ml"
                :disabled="!item.activated"
              >
                <Option
                  :value="item2.code"
                  v-for="(item2,index2) in item.valRangeSecondArr"
                  :key="`vfs_${index2}`"
                >{{item2.codeDes}}</Option>
              </Select>
              <Select
                v-model="item.selectedValRelation"
                style="width:6rem"
                class="ml"
                :disabled="!item.activated"
              >
                <Option
                  :value="item3.code"
                  v-for="(item3,index3) in valRangeRelationArr"
                  :key="`vfr_${index3}`"
                >{{item3.codeDes}}</Option>
              </Select>
            </div>
            <div>
              <Icon
                :size="remToPx(1.25)"
                class="cursor-pointer"
                type="md-checkmark-circle"
                v-if="item.activated"
                @click="handleSaveRuleDefine(item.id)"
              />
              <Icon
                :size="remToPx(1.25)"
                class="cursor-pointer"
                type="md-create"
                v-else
                @click="handleEditRuleDefine(item.id)"
              />
              <Icon
                :size="remToPx(1.25)"
                type="md-trash"
                class="ml mr cursor-pointer"
                @click="handleAskDeleteDefine(item.id)"
              />
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
      activeRuleItemId: 0,
      valRangeRelationArr: [
        { codeDes: "并且", code: "1" },
        { codeDes: "或者", code: "0" }
      ],
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
        selectedValFirst: "",
        selectedValSecond: "",
        selectedValRelation: "",
        activated: true
      },
      modalForm: {
        rulesFitObj: "",
        path: [""],
        ruleDesc: "",
        ruleDescArr: [],
        ruleDefineData: [],
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
          align: "center",
          width: remToPx(18)
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
    // 添加规则
    handleAddRule() {
      this.clearFormItem();

      this.isRuleUpdate = false;
      this.modalFlag = true;
    },
    // 重新生成arr和规则描述
    handleRefreshRuleDesc() {
      console.log(this.modalForm.ruleDefineData, this.activeRuleItemId);

      // 拼接字符串
      this.$set(this.modalForm, "ruleDescArr", []);
      this.modalForm.ruleDefineData.forEach((item, index) => {
        if (index > 0) {
          this.modalForm.ruleDescArr.push(
            item.selectedValRelation === "1" ? "并且" : "或者"
          );
        }

        let target = this.valRangeRuleCodeList.find(
          i => i.domainName === item.selectedValFirst
        ).children;
        let desc = target.find(it => it.code === item.selectedValSecond)
          .codeDes;

        this.modalForm.ruleDescArr.push(item.selectedValFirst + desc);
      });
      this.$set(
        this.modalForm,
        "ruleDesc",
        this.modalForm.ruleDescArr.join("")
      );
      // }
    },
    // 编辑规则定义
    handleEditRuleDefine(id) {
      this.modalForm.ruleDefineData = this.modalForm.ruleDefineData.map(
        item => ({
          ...item,
          activated: item.id !== id ? false : true
        })
      );
      this.activeRuleItemId = id;
    },
    // 保存规则定义
    handleSaveRuleDefine(id) {
      let targetIdx = this.modalForm.ruleDefineData.findIndex(
        item => item.id === id
      );
      this.$set(this.modalForm.ruleDefineData[targetIdx], "activated", false);

      this.activeRuleItemId = id;
      this.handleRefreshRuleDesc();
    },
    // 点击删除icon
    handleAskDeleteDefine(id) {
      this.activeRuleItemId = id;
      this.delModalKeyFlag = true;
    },
    // 新建规则
    handleModalAddRule() {
      this.activeRuleItemId = this.modalForm.ruleDefineData.length + 1;
      this.modalForm.ruleDefineData.push(
        Object.assign({
          id: this.modalForm.ruleDefineData.length + 1,
          ...this.ruleDefineDataDemo,
          //第二个optionList
          valRangeSecondArr:
            this.valRangeRuleCodeList.length &&
            this.valRangeRuleCodeList[0].children,
          activated: false
        })
      );
      this.handleRefreshRuleDesc();
    },
    // 查询
    handleQuery() {
      this.page.current = 1;
      this.getZJListPageById();
    },
    handleValRangeSecondChange(e, b) {},
    // 二级联动
    handleValRangeFirstChange(e, b) {
      // 找到改的哪一行：id
      let targetIdx = this.modalForm.ruleDefineData.findIndex(
        item => item.id === this.activeRuleItemId
      );
      let temp = this.valRangeRuleCodeList.find(
        item =>
          item.domainName ===
          this.modalForm.ruleDefineData[targetIdx].selectedValFirst //相应选择项
      ).children;
      // console.log(
      //   this.modalForm.ruleDefineData[targetIdx].selectedValFirst,
      //   this.modalForm.ruleDefineData[targetIdx].selectedValSecond
      // );

      this.$set(
        this.modalForm.ruleDefineData[targetIdx],
        "valRangeSecondArr",
        temp
      );
      this.$set(
        this.modalForm.ruleDefineData[targetIdx],
        "selectedValSecond",
        temp[0].code
      ); //第二项默认项
      // console.log(this.modalForm, temp);
    },
    // 获取属性域代码表
    getValRangeRuleCodeList() {
      getValRangeRuleCodeList().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.valRangeRuleCodeList = data;
          //第一个optionList是公用的
          this.valRangeFirstArr = this.valRangeRuleCodeList;
          //第二个optionList
          this.valRangeSecondArr =
            this.valRangeRuleCodeList.length &&
            this.valRangeRuleCodeList[0].children;

          // 设置默认选中项
          this.ruleDefineDataDemo = {
            selectedValFirst: this.valRangeFirstArr[0].domainName,
            selectedValSecond: this.valRangeSecondArr[0].code,
            selectedValRelation: "1"
          };
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
          this.modalForm = {
            ...this.modalForm,
            ...this.activeRow.rdIdentify
          };
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


    // 清空规则
    clearFormItem() {
      this.$set(this.modalForm, "path", []);
      this.modalForm = {
        rulesFitObj: "",
        path: [""],
        ruleDesc: "",
        ruleDescArr: [],
        ruleDefineData: [],
        pathChildNodeId: "",
        dataPropDefine: []
      };
    },
    //选中路径变化
    handlePathChange(a, b) {
      this.modalForm.path = a;
      this.modalForm.rulesFitObj = b[b.length - 1].label;
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

    // 确认删除字段
    confirmDelKey() {
      this.modalForm.ruleDefineData = this.modalForm.ruleDefineData.filter(
        item => this.activeRuleItemId !== item.id
      );

      this.$Message.info("删除成功！");
      this.handleRefreshRuleDesc();
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
          ruleDefineData: this.modalForm.ruleDefineData,
          path: this.modalForm.path,
          ruleDesc: this.modalForm.ruleDesc,
          rulesFitObj: this.modalForm.rulesFitObj
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
          rulesName: this.modalForm.ruleDesc,
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
        }
      }
    },
    // modal取消按钮
    cancel() {
      this.modalFlag = false;
      this.clearFormItem();
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
