<template>
  <div>
    <div class="mt flex flex-sb">
      <div>
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
      <div>
        <Form :label-width="200" inline>
          <FormItem label="规则适用对象：">
            <Input v-model="queryRulesFitObj" clearable />
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
      title="值域规范性规则添加"
      :width="remToPx(50)"
    >
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
        <Button @click="cancel">取消</Button>
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
        </div>
        <div class="zt-scroll-y pd rule-define-wrap">
          <div class="position-r">
            <!-- 约束 -->
            <div class="rule-control-wrap">
              <div
                class="rule-define-row flex flex-sb"
                v-for="(item,index) in modalForm.ruleDefineData"
                :key="`data_${index}`"
                @click="setActiveRowId(item.id)"
              >
                <div>
                  <!-- 一级 -->
                  <Select
                    v-model="item.selectedValFirst"
                    style="width:8rem"
                    @on-change="handleValRangeFirstChange"
                  >
                    <Option
                      :value="item1.id"
                      v-for="(item1,index1) in controlListDemo"
                      :key="`vrf_${index1}`"
                    >{{item1.name}}</Option>
                  </Select>
                  <!-- 二级 -->
                  <Select
                    v-model="item.selectedValSecond"
                    @on-change="handleValRangeSecondChange"
                    style="width:6rem"
                    class="ml"
                  >
                    <Option
                      :value="item2.name"
                      v-for="(item2,index2) in item.keyList"
                      :key="`vfs_${index2}`"
                    >{{item2.name}}</Option>
                  </Select>
                  <!-- 名称 -->
                  <template v-if="item.selectedValFirst===1">
                    <Select
                      v-model="item.controlChangedDetail.TypeOperator"
                      style="width:6rem"
                      class="ml"
                    >
                      <Option
                        :value="item3.id"
                        v-for="(item3,index3) in keyRangeRelListDemo"
                        :key="`vfr_${index3}`"
                      >{{item3.name}}</Option>
                    </Select>
                    <Input
                      class="ml"
                      v-model="item.controlChangedDetail.Range"
                      style="width:100px"
                      clearable
                    />
                  </template>
                  <!-- 面积 -->
                  <template v-else-if="item.selectedValFirst===2">
                    <Select
                      v-model="item.controlChangedDetail.TypeOperator"
                      style="width:6rem"
                      class="ml"
                    >
                      <Option
                        :value="item3.id"
                        v-for="(item3,index3) in keyNullListDemo"
                        :key="`vfr_${index3}`"
                      >{{item3.name}}</Option>
                    </Select>
                  </template>
                  <!-- 代码范围 -->
                  <template v-if="item.selectedValFirst===3">
                    <Select
                      v-model="item.controlChangedDetail.TypeOperator"
                      style="width:6rem"
                      class="ml"
                    >
                      <Option
                        :value="item3.id"
                        v-for="(item3,index3) in keyCodeRangeListDemo"
                        :key="`vfr_${index3}`"
                      >{{item3.name}}</Option>
                    </Select>
                    <template v-if="item.controlChangedDetail.TypeOperator===1">
                      <Select
                        v-model="item.controlChangedDetail.range"
                        style="width:6rem"
                        class="ml"
                      >
                        <Option
                          :value="item3.id"
                          v-for="(item3,index3) in keyCRFromTableListDemo"
                          :key="`vfr_${index3}`"
                        >{{item3.name}}</Option>
                      </Select>
                    </template>
                    <template v-else>
                      <Input
                        class="ml"
                        style="width:100px"
                        v-model="item.controlChangedDetail.Range"
                        clearable
                      />
                    </template>
                  </template>
                </div>
                <div>
                  <Icon
                    :size="remToPx(1.25)"
                    type="md-trash"
                    class="ml mr cursor-pointer"
                    @click="handleAskDeleteDefine(item.id)"
                  />
                </div>
              </div>
            </div>
            <!-- 关系 -->
            <div class="rule-express-wrap">
              <div
                v-for="(express,index) in modalForm.ruleDefineExpression"
                :key="`express_${index}_${express.value}`"
                class="rule-express"
              >
                <Select v-model="express.value" style="width:6rem" class="rule-express-item">
                  <Option value="and">并且</Option>
                  <Option value="or">或者</Option>
                </Select>
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
  getValRangeRuleCodeList,
  getZJListPageById,
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
  name: "valRange",
  mixins: [InspectionMixins],
  components: { MyDelete },
  data() {
    return {
      activeRuleItemId: 0,
      // 一级分类
      controlListDemo: [
        { id: 1, name: "数值范围约束" },
        { id: 2, name: "空值约束" },
        { id: 3, name: "代码范围约束" }
      ],
      // 二级分类
      keyListDemo: [{ id: 1, name: "" }],
      // 三级分类-数值约束
      keyRangeRelListDemo: [
        { id: "=", name: "等于" },
        { id: "!=", name: "不等于" },
        { id: ">", name: "大于" },
        { id: "<", name: "小于" },
        { id: ">=", name: "大于等于" },
        { id: "<=", name: "小于等于" }
      ],

      // 三级分类-空值约束
      keyNullListDemo: [
        { id: "not null", name: "不能为空" },
        { id: "be null", name: "必须为空" }
      ],
      //三级分类-代码范围约束
      keyCodeRangeListDemo: [
        { id: 1, name: "取值对应代码表" },
        { id: 2, name: "取值范围自定义" }
      ],
      //四级分类-取值对应代码表-代码范围约束对应的代码表
      keyCRFromTableListDemo: [{ id: 1, name: "" }],
      valRangeType: ["Float", "Int"],
      isNullType: ["Char", "VarChar"],
      codeRangeType: ["VarChar", "Char", "Float", "Int", "Date"],
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
        // selectedValRelation: "",
        activated: true
      },
      modalForm: {
        rulesFitObj: "",
        path: [""],
        ruleDesc: "",
        ruleDescArr: [],
        ruleDefineData: [],
        ruleDefineExpression: [],
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
    this.getValRangeRuleCodeList();

    this.activeRow.rulesCode = this.$route.query.rules_code;
    this.modalForm = {
      rulesFitObj: "",
      path: [""],
      ruleDesc: "",
      ruleDescArr: [],
      ruleDefineData: [
        {
          id: 1,
          selectedValFirst: 1,
          selectedValSecond: 2,
          // selectedValRelation: "",
          activated: true,

          // valRangeSecondArr: [],
          types: ["Float", "Int"],
          controlChangedDetail: {
            TypeOperator: ">",
            Range: "0",
            CodeListName: "",
            CodeListID: "",
            StartIndex: "",
            EndIndex: ""
          },
          keyList: [{ id: 2, name: "222" }]
        }
      ],

      ruleDefineExpression: [],
      pathChildNodeId: "",
      dataPropDefine: []
    };
    console.log(this.modalForm.ruleDefineExpression);
  },
  methods: {
    // 请求list
    getZJListPageById() {
      let postData = {
        dataName: this.queryRulesFitObj,
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        queryTerms: {
          createdBy: "",
          createdTime: "",
          pkId: 0,
          rdIdentify: "",
          rulesCode: "",
          rulesMlId: this.$route.query.id,
          rulesName: "",
          unCheck: "",
          unRead: "",
          unUpdate: "",
          updatedBy: "",
          updatedTime: "",
          validity: ""
        }
      };
      getZJListPageById(postData).then(res => {
        this.tableData = [];
        this.selectedRowIds = [];
        this.startedArr = [];
        this.unstartedArr = [];
        const { data, code } = res.data;
        if (code === 1000) {
          this.page.total = data.total;
          data.list.forEach(item => {
            let newData = {
              ...item,
              id: item.pkId,
              ruleStatus: item.unCheck === "0" ? "启用" : "未启用",
              ruleStatusCode: item.unCheck,
              path: (item.dataPath && item.dataPath.split(",")) || [],
              rdIdentify: JSON.parse(item.rdIdentify)
            };

            // 值域规范性处理
            // if (this.$route.query.id == 3) {
            newData.rdIdentify = JSON.parse(item.rdIdentify) || {
              rulesFitObj: ""
            };
            newData.rulesFitObj = newData.path[newData.path.length - 1];
            newData.rulesName = this.concatRuleDesc(
              newData.rdIdentify,
              newData.rulesFitObj
            );
            // }
            this.tableData.push(newData);
            if (item.unCheck === "0") {
              this.startedArr.push(item.pkId + "");
            } else {
              this.unstartedArr.push(item.pkId + "");
            }
          });
        }
      });
    },
    concatRuleDesc(rdIdentify, path) {
      let relationArr = rdIdentify.Expression.split(" ");
      let arr = rdIdentify.Conditions.map((item, index) => {
        let range = "";
        let TypeOperatorName;
        if (item.ConType === "数值范围约束") {
          range = item.Range;
          TypeOperatorName = this.keyRangeRelListDemo.find(
            it => it.id === item.TypeOperator
          ).name;
        }

        if (item.ConType === "空值约束") {
          TypeOperatorName = this.keyNullListDemo.find(
            it => it.id === item.TypeOperator
          ).name;
        }
        if (item.ConType === "代码范围约束") {
          range = item.Range;
          TypeOperatorName = this.keyCodeRangeListDemo.find(
            it => it.id === item.TypeOperator
          ).name;
        }
        return index === 0
          ? item.FieldName + TypeOperatorName + range
          : ` ${relationArr[2 * index - 1]}` +
              item.FieldName +
              TypeOperatorName +
              range;
      });
      return `${path}中 ` + arr;
    },
    // 添加规则
    handleAddRule() {
      // this.clearFormItem();

      this.isRuleUpdate = false;
      this.modalFlag = true;
    },
    // 重新生成arr和规则描述
    handleRefreshRuleDesc() {
      // console.log(this.modalForm.ruleDefineData, this.activeRuleItemId);
      // // 拼接字符串
      // this.$set(this.modalForm, "ruleDescArr", []);
      // this.modalForm.ruleDefineData.forEach((item, index) => {
      //   if (index > 0) {
      //     this.modalForm.ruleDescArr.push(
      //       item.selectedValRelation === "1" ? "并且" : "或者"
      //     );
      //   }
      //   let target = this.valRangeRuleCodeList.find(
      //     i => i.domainName === item.selectedValFirst
      //   ).children;
      //   let desc = target.find(it => it.code === item.selectedValSecond)
      //     .codeDes;
      //   this.modalForm.ruleDescArr.push(item.selectedValFirst + desc);
      // });
      // this.$set(
      //   this.modalForm,
      //   "ruleDesc",
      //   this.modalForm.ruleDescArr.join("")
      // );
    },
    // // 编辑规则定义
    // handleEditRuleDefine(id) {
    //   this.modalForm.ruleDefineData = this.modalForm.ruleDefineData.map(
    //     item => ({
    //       ...item,
    //       activated: item.id !== id ? false : true
    //     })
    //   );
    //   this.activeRuleItemId = id;
    // },
    // // 保存规则定义
    // handleSaveRuleDefine(id) {
    //   let targetIdx = this.modalForm.ruleDefineData.findIndex(
    //     item => item.id === id
    //   );
    //   this.$set(this.modalForm.ruleDefineData[targetIdx], "activated", false);

    //   this.activeRuleItemId = id;
    //   this.handleRefreshRuleDesc();
    // },
    // 点击删除icon
    handleAskDeleteDefine(id) {
      this.activeRuleItemId = id;
      this.delModalKeyFlag = true;
    },
    // 新建规则
    handleModalAddRule() {
      this.activeRuleItemId = this.modalForm.ruleDefineData.length + 1;
      this.modalForm.ruleDefineData.push({
        id: this.modalForm.ruleDefineData.length + 1,
        selectedValFirst: 1,
        selectedValSecond: 2,
        // selectedValRelation: "",
        activated: true,
        // valRangeSecondArr: [],
        types: ["Float", "Int"],
        keyList: this.keyListDemo.filter(it =>
          ["Float", "Int"].includes(it.type)
        ),
        controlChangedDetail: {
          TypeOperator: ">",
          Range: "0",
          CodeListName: "",
          CodeListID: "",
          StartIndex: "",
          EndIndex: ""
        }
      });
      this.modalForm.ruleDefineExpression.push({ value: "and" });
      this.handleRefreshRuleDesc();
    },
    // 查询
    handleQuery() {
      this.page.current = 1;
      this.getZJListPageById();
    },
    handleValRangeSecondChange(e, b) {},
    setActiveRowId(id) {
      this.activeRuleItemId = id;
    },
    // 二级联动
    handleValRangeFirstChange(e, b) {
      let targetIdx = this.modalForm.ruleDefineData.findIndex(
        item => item.id === this.activeRuleItemId
      );
      switch (e) {
        case 1: //数值范围约束
          this.$set(
            this.modalForm.ruleDefineData[targetIdx],
            "controlChangedDetail",
            {
              TypeOperator: "equal",
              Range: "0",
              CodeListName: "",
              CodeListID: "",
              StartIndex: "",
              EndIndex: ""
            }
          );
          this.$set(
            this.modalForm.ruleDefineData[targetIdx],
            "types",
            this.valRangeType
          );
          this.$set(
            this.modalForm.ruleDefineData[targetIdx],
            "keyList",
            this.keyListDemo.filter(it => ["Float", "Int"].includes(it.type))
          );
          break;
        case 2: //空值约束
          this.$set(
            this.modalForm.ruleDefineData[targetIdx],
            "controlChangedDetail",
            {
              TypeOperator: "is not",
              Range: "null",
              CodeListName: "",
              CodeListID: "",
              StartIndex: "",
              EndIndex: ""
            }
          );
          this.$set(
            this.modalForm.ruleDefineData[targetIdx],
            "types",
            this.isNullType
          );
          this.$set(
            this.modalForm.ruleDefineData[targetIdx],
            "keyList",
            this.keyListDemo.filter(it => ["VarChar", "Char"].includes(it.type))
          );
          break;
        case 3:
          this.$set(
            this.modalForm.ruleDefineData[targetIdx],
            "controlChangedDetail",
            {
              TypeOperator: "1",
              Range: "",
              CodeListName: "",
              CodeListID: "",
              StartIndex: "",
              EndIndex: ""
            }
          );
          this.$set(
            this.modalForm.ruleDefineData[targetIdx],
            "types",
            this.codeRangeType
          );
          this.$set(
            this.modalForm.ruleDefineData[targetIdx],
            "keyList",
            this.keyListDemo.filter(it =>
              ["VarChar", "Char", "Float", "Int", "Date"].includes(it.type)
            )
          );
          break;
        default:
          break;
      }

      // let temp = this.valRangeRuleCodeList.find(
      //   item =>
      //     item.domainName ===
      //     this.modalForm.ruleDefineData[targetIdx].selectedValFirst //相应选择项
      // ).children;
      // this.$set(
      //   this.modalForm.ruleDefineData[targetIdx],
      //   "valRangeSecondArr",
      //   temp
      // );
      // this.$set(
      //   this.modalForm.ruleDefineData[targetIdx],
      //   "selectedValSecond",
      //   temp[0].code
      // ); //第二项默认项
      // console.log(this.modalForm, temp);
    },
    // 获取字段代码表
    getVRRKeyListById() {
      getVRRKeyListById({ pkId: this.modalForm.pathChildNodeId }).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.keyListDemo = data.map(item => ({
            id: item.pkId,
            name: item.fieldName,
            type: item.fieldType
          }));
          this.modalForm.ruleDefineData = this.modalForm.ruleDefineData.map(
            item => ({
              ...item,
              keyList: this.keyListDemo.filter(it =>
                item.types.includes(it.type)
              )
            })
          );
          console.log(this.modalForm.ruleDefineData);
        }
      });
    },
    // 获取代码范围代码表
    getValRangeRuleCodeList() {
      getValRangeRuleCodeList().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.keyCRFromTableListDemo = data.map(item => ({
            id: item.pkId,
            name: item.domainName
          }));
        }
      });
    },
    // 点击修改重新请求keylist
    getVRRKeyListWhenModify(id) {
      getVRRKeyListById({ pkId: id }).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.keyListDemo = data.map(item => ({
            id: item.pkId,
            name: item.fieldName,
            type: item.fieldType
          }));

          this.$set(
            this.modalForm,
            "ruleDefineData",
            this.activeRow.rdIdentify.Conditions.map((item, index) => {
              let ID = this.controlListDemo.find(it => it.name === item.ConType)
                .id;
              let types =
                ID === 1
                  ? this.valRangeType
                  : ID === 2
                  ? this.isNullType
                  : this.codeRangeType;

              return {
                id: index + 1,
                selectedValFirst: ID,
                selectedValSecond: item.FieldName,
                types: types,
                controlChangedDetail: item,
                keyList: this.keyListDemo.filter(it => types.includes(it.type))
              };
            })
          );
          let relationArr = this.activeRow.rdIdentify.Expression.split(" ");
          let arr = [];
          if (relationArr.length > 1) {
            relationArr.forEach((it, idx) => {
              if (idx % 2) {
                arr.push({ value: it });
              }
            });
          }
          this.$set(this.modalForm, "ruleDefineExpression", arr);
          console.log(this.modalForm.ruleDefineData, this.activeRow.rdIdentify);
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
          this.$set(this.modalForm, "ruleDesc", this.activeRow.rulesName); //描述
          this.$set(this.modalForm, "path", this.activeRow.path); //规则路径对应
          this.getVRRKeyListWhenModify(this.activeRow.dsPkid);
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
        }
      });
    },

    // 确认删除字段
    confirmDelKey() {
      this.modalForm.ruleDefineData = this.modalForm.ruleDefineData.filter(
        item => this.activeRuleItemId !== item.id
      );
      this.modalForm.ruleDefineExpression.splice(-1);
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
          Conditions: this.modalForm.ruleDefineData.map((item, index) => ({
            ConType:
              item.selectedValFirst === 1
                ? "数值范围约束"
                : item.selectedValFirst === 2
                ? "空值约束"
                : "代码范围约束",
            FieldName: item.selectedValSecond,
            TypeOperator: item.controlChangedDetail.TypeOperator,
            Range: item.controlChangedDetail.Range,
            CodeListName: "",
            CodeListID: "",
            StartIndex: "",
            EndIndex: ""
          })),

          Expression: this.modalForm.ruleDefineData
            .map((item, index) =>
              index === 0
                ? `{${index}}`
                : ` ${
                    this.modalForm.ruleDefineExpression[index - 1].value
                  } {${index}}`
            )
            .join("") //"{0} and {1} and {2}"
        };
        // let newData = {
        //   ruleDefineData: this.modalForm.ruleDefineData,
        //   path: this.modalForm.path,
        //   ruleDesc: this.modalForm.ruleDesc,
        //   rulesFitObj: this.modalForm.rulesFitObj
        // };

        // 请求addRules接口
        let postData = {
          createdBy: this.activeRow.createdBy,
          createdTime: "",
          dataName: this.activeRow.dataName,
          dsPkid: String(this.modalForm.pathChildNodeId),
          pkId: this.activeRow.id,
          dataPath: this.modalForm.path.join(","),
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
          console.log("postData", postData);

          console.log(
            "this.modalForm.ruleDefineData",
            this.modalForm.ruleDefineData
          );

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
          console.log("postData", postData);
          console.log("newData", newData);
          console.log(
            "this.modalForm.ruleDefineData",
            this.modalForm.ruleDefineData
          );
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
    height: 18rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .rule-define-row {
    margin-bottom: 3rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
}
.rule-express-wrap,
.rule-control-wrap {
  position: absolute;
  left: 0;
  top: 0;
}
.rule-express {
  margin: 2.8rem 0;
}
</style>
