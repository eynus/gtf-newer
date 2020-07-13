<template>
  <div>
    <div ref="opt" class="mt">
      <div class="g-button-wrapper">
        <button v-auth="['page_5_4_1']" class="g-button" @click="handleStartRule">
          <Icon :type="$btn.play" /> 启用</button>
        <button v-auth="['page_5_4_5']" class="g-button" @click="handleStopRule">
          <Icon :type="$btn.stop" /> 停止</button>
        <button v-auth="['page_5_4_2']" class="g-button" @click="handleAddRule">
          <Icon :type="$btn.create" /> 新建</button>
        <button v-auth="['page_5_4_3']" class="g-button" @click="handleUpdateRule">
          <Icon :type="$btn.edit" /> 修改</button>
        <button v-auth="['page_5_4_4']" class="g-button" @click="handleDeleteRule">
          <Icon :type="$btn.del" /> 删除</button>
      </div>
    </div>
    <Table
      class="inspection-table"
      border
      stripe
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
        <span>{{row.ruleStatus}}</span>
      </template>
    </Table>
    <Page
        class="pagination"
      :total="page.total"
      show-total
      show-sizer
      show-elevator
      :current="page.current"
      :page-size="page.pageSize"
      @on-change="changePage"
      @on-page-size-change="changePageSize"
    ></Page>
    <Drawer
      v-model="modalFlag"
      class-name="vertical-center-modal"
      title="值域规范性规则"
      :width="800"
    >
      <div class="modal-item">
        <div class="title mb">规则适用对象</div>
        <div>
          <Cascader
            :disabled="isRuleUpdate"
            :data="dataPaths"
            v-model="modalForm.path"
            @on-change="handlePathChange"
          ></Cascader>
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
            <div class="rule-control-wrap w100">
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
                    style="width:10rem"
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
                    style="width:8rem"
                    class="ml"
                  >
                    <Option
                      :value="item2.code"
                      v-for="(item2,index2) in item.keyList"
                      :key="`vfs_${index2}`"
                    >{{item2.namecode}}</Option>
                  </Select>
                  <!-- 名称 -->
                  <template v-if="item.selectedValFirst===1">
                    <Select
                      v-model="item.controlChangedDetail.TypeOperator"
                      style="width:8rem"
                      class="ml"
                    >
                      <Option
                        :value="item3.id"
                        v-for="(item3,index3) in keyRangeRelListDemo"
                        :key="`vfr_${index3}`"
                      >{{item3.name}}</Option>
                    </Select>
                    <InputNumber :min="0" v-model="item.controlChangedDetail.Range" class="ml" style="width:8rem"></InputNumber>
                  </template>
                  <!-- 面积 -->
                  <template v-else-if="item.selectedValFirst===2">
                    <Select
                      v-model="item.controlChangedDetail.TypeOperator"
                      style="width:8rem"
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
                  <template v-else-if="item.selectedValFirst===3">
                    <Select
                      v-model="item.controlChangedDetail.TypeOperator"
                      style="width:8rem"
                      class="ml"
                      @on-change="handleTypeOperatorChange"
                    >
                      <Option
                        :value="item3.id"
                        v-for="(item3,index3) in keyCodeRangeListDemo"
                        :key="`vfr_${index3}`"
                      >{{item3.name}}</Option>
                    </Select>
                    <template v-if="item.controlChangedDetail.TypeOperator===1">
                      <Select
                        v-model="item.controlChangedDetail.CodeListID"
                        style="width:8rem"
                        class="ml"
                        @on-change="handleCodeListIDChange"
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
                        style="width:8rem"
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
      <div class="drawer-footer">
        <Button style="margin-right: 8px" type="primary" @click="ok">提交</Button>
        <Button @click="cancel">关闭</Button>
      </div>
    </Drawer>
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
      keyListDemo: [],
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
        { id: "is not", name: "不能为空" },
        { id: "is", name: "必须为空" }
      ],
      //三级分类-代码范围约束
      keyCodeRangeListDemo: [
        { id: 1, name: "取值对应代码表" },
        { id: 2, name: "取值范围自定义" }
      ],
      //四级分类-取值对应代码表-代码范围约束对应的代码表
      keyCRFromTableListDemo: [{ id: 1, name: "" }],
      valRangeType: ["Float", "Int"],
      codeRangeType: ["Char", "VarChar"],
      isNullType: ["VarChar", "Char", "Float", "Int", "Date"],
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
          title: "必须应用规则",
          slot: "ruleStatusSlot",
          align: "center",
          width: remToPx(10)
        }
      ],
      tableData: []
    };
  },
  watch: {
    modalForm: {
      handler(newName, oldName) {
        // 重新生成concat

        this.$set(this.modalForm, "ruleDesc", this.concatRuleDescWhenChange());
      },
      deep: true
    }
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
          types: this.valRangeType,
          controlChangedDetail: {
            TypeOperator: ">",
            Range: "0",
            CodeListName: "",
            CodeListID: "",
            StartIndex: "",
            EndIndex: ""
          },
          keyList: []
        }
      ],

      ruleDefineExpression: [],
      pathChildNodeId: "",
      dataPropDefine: []
    };
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
            newData.rdIdentify = JSON.parse(item.rdIdentify) || {
              rulesFitObj: ""
            };
            newData.rulesFitObj = newData.path[newData.path.length - 1];
            // newData.rulesName = this.concatRuleDesc(
            //   newData.rdIdentify,
            //   newData.rulesFitObj
            // );
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
    concatRuleDescWhenChange() {
      // console.log(this.modalForm.ruleDefineData);

      if (!this.modalForm.path[0]) {
        return "";
      }
      let relationArr = this.modalForm.ruleDefineExpression;

      let arr = this.modalForm.ruleDefineData.map((item, index) => {
        let control = item.controlChangedDetail;
        let range = "";
        let codeName = "";
        let TypeOperatorName;
        let selectedKeyNameCode =
          (item.keyList.find(it => it.code === item.selectedValSecond) &&
            item.keyList.find(it => it.code === item.selectedValSecond)
              .namecode) ||
          "";
        if (item.selectedValFirst === 1) {
          //数值范围约束
          range = control.Range;
          TypeOperatorName = this.keyRangeRelListDemo.find(
            it => it.id === control.TypeOperator
          )&&this.keyRangeRelListDemo.find(
            it => it.id === control.TypeOperator
          ).name;
        } else if (item.selectedValFirst === 2) {
          //空值约束

          TypeOperatorName =
            (this.keyNullListDemo.find(it => it.id === control.TypeOperator) &&
              this.keyNullListDemo.find(it => it.id === control.TypeOperator)
                .name) ||
            "";
        } else if (item.selectedValFirst === 3) {
          //代码范围约束

          TypeOperatorName =
            (this.keyCodeRangeListDemo.find(
              it => it.id === control.TypeOperator
            ) &&
              this.keyCodeRangeListDemo.find(
                it => it.id === control.TypeOperator
              ).name) ||
            "";
          if (control.CodeListID) {
            //取值对应代码表
            codeName = control.CodeListName;
            return index === 0
              ? selectedKeyNameCode +
                  "字段取值在" +
                  range +
                  codeName +
                  "代码表有对应项"
              : ` ${relationArr[index - 1].value === "and" ? "且" : "或"}` +
                  selectedKeyNameCode +
                  "字段取值在" +
                  range +
                  codeName +
                  "代码表有对应项";
          } else {
            //取值范围自定义
            codeName = "(" + control.Range + ")";
            return index === 0
              ? selectedKeyNameCode + "字段取值在" + range + codeName + "范围内"
              : ` ${relationArr[index - 1].value === "and" ? "且" : "或"}` +
                  selectedKeyNameCode +
                  "字段取值在" +
                  range +
                  codeName +
                  "范围内";
          }
        }

        return index === 0
          ? selectedKeyNameCode + TypeOperatorName + range + codeName
          : ` ${relationArr[index - 1].value === "and" ? "且" : "或"}` +
              selectedKeyNameCode +
              TypeOperatorName +
              range +
              codeName;
      });

      return `${this.modalForm.path[this.modalForm.path.length - 1]}中 ` + arr;
    },
    concatRuleDesc(rdIdentify, path) {
      // console.log(rdIdentify);

      let relationArr = rdIdentify.Expression.split(" ");
      //  let selectedKeyNameCode = item.keyList.find(it=>it.code===item.selectedValSecond).namecode
      let arr = rdIdentify.Conditions.map((item, index) => {
        let range = "";
        let codeName = "";
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
          // range = item.Range;
          TypeOperatorName = this.keyCodeRangeListDemo.find(
            it => it.id === item.TypeOperator
          ).name;
          codeName = item.CodeListName;
        }
        return index === 0
          ? item.FieldName + TypeOperatorName + range + codeName
          : ` ${relationArr[2 * index - 1] === "and" ? "且" : "或"}` +
              item.FieldName +
              TypeOperatorName +
              range +
              codeName;
      });
      return `${path}中 ` + arr;
    },
    handleTypeOperatorChange(e) {
      let item = this.modalForm.ruleDefineData.find(
        item => item.id === this.activeRuleItemId
      );
      // if (e === 2) {
        item.controlChangedDetail = {
          TypeOperator: e,
          Range: "",
          CodeListName: "",
          CodeListID: e===1?-1:'',
          StartIndex: "",
          EndIndex: ""
        };
      // }
    },
    // 添加规则
    handleAddRule() {
      this.clearFormItem();

      this.isRuleUpdate = false;
      this.modalFlag = true;
    },
    // 点击删除icon
    handleAskDeleteDefine(id) {
      this.activeRuleItemId = id;
      this.delModalKeyFlag = true;
    },
    // 新建规则
    handleModalAddRule() {
      this.activeRuleItemId = this.modalForm.ruleDefineData.length + 1;
      if (this.modalForm.ruleDefineData.length) {
        this.modalForm.ruleDefineExpression.push({ value: "and" });
      }
      this.modalForm.ruleDefineData.push({
        id: this.modalForm.ruleDefineData.length + 1,
        selectedValFirst: 1,
        selectedValSecond: "未知",
        // selectedValRelation: "",
        activated: true,
        // valRangeSecondArr: [],
        types: this.valRangeType,
        keyList: this.keyListDemo.filter(it =>
          this.valRangeType.includes(it.type)
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
            this.keyListDemo.filter(it => this.valRangeType.includes(it.type))
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
            this.keyListDemo.filter(it => this.isNullType.includes(it.type))
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
            this.keyListDemo.filter(it => this.codeRangeType.includes(it.type))
          );
          break;
        default:
          break;
      }
    },
    // 找到对应代码表中文名字
    handleCodeListIDChange(e) {
      // console.log(e, this.activeRuleItemId);
      let targetIdx = this.modalForm.ruleDefineData.findIndex(
        item => item.id === this.activeRuleItemId
      );
      // item.controlChangedDetail.Range
      let target = this.keyCRFromTableListDemo.find(item => item.id === e);
      // let name = target.name;
      // console.log(target.range);
      this.$set(
        this.modalForm.ruleDefineData[targetIdx]["controlChangedDetail"],
        "CodeListName",
        target.name
      );
      this.$set(
        this.modalForm.ruleDefineData[targetIdx]["controlChangedDetail"],
        "Range",
        target.range
      );
    },
    // 获取字段代码表
    getVRRKeyListById() {
      getVRRKeyListById({ pkId: this.modalForm.pathChildNodeId }).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.keyListDemo = data.map(item => ({
            id: item.pkId,
            name: item.fieldName,
            code: item.fieldCode,
            namecode: item.fieldName + "(" + item.fieldCode + ")",
            type: item.fieldType
          }));
          this.modalForm.ruleDefineData = this.modalForm.ruleDefineData.map(
            item => {
              let list = this.keyListDemo.filter(it =>
                item.types.includes(it.type)
              );
              return {
                ...item,
                keyList: list,
                // 设置第一个item的selecedSecond
                selectedValSecond: (list[0] && list[0].code) || ""
              };
            }
          );
          //
          // if( this.modalForm.ruleDefineData)
          // console.log(this.modalForm.ruleDefineData);
        }
      });
    },
    // 获取代码范围代码表
    getValRangeRuleCodeList() {
      getValRangeRuleCodeList().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.keyCRFromTableListDemo = data.map(item => ({
            range: item.children.map(it => it.code).join(","),
            // range: "(" + item.children.map(it => it.code).join(",") + ")",
            id: item.pkId,
            name: item.domainName
          }));
        }
      });
    },
    // 点击修改重新请求keylist 赋值ruleDefineData
    getVRRKeyListWhenModify(id) {
      getVRRKeyListById({ pkId: id }).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.keyListDemo = data.map(item => ({
            id: item.pkId,
            name: item.fieldName,
            code: item.fieldCode,
            namecode: item.fieldName + "(" + item.fieldCode + ")",
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
              let typeoperator;
              let rangeExceptBrace = item.Range;
              switch (item.ConType) {
                case "代码范围约束":
                  if (item.CodeListID) {
                    // 取值对应代码表
                    typeoperator = 1;
                  } else {
                    typeoperator = 2;
                  }
                  // console.log(
                  //   "处理前的rangeExceptBrace",
                  //   item.Range.replace(/(^\()|(\))$/g, "").split(",")
                  // );
                  rangeExceptBrace = item.Range.replace(
                    /(^\()|(\))$/g,
                    ""
                  ).replace(/\'/g, "");
                  // console.log("处理后的rangeExceptBrace", rangeExceptBrace);

                  // console.log(
                  //   "rangeExceptBrace",
                  //   rangeExceptBrace,
                  //   "item",
                  //   item
                  // );
                  break;
                // case '数值范围约束':
                //   typeoperator = item.TypeOperator
                //   break;
                // case '空值约束':break;
                default:
                  typeoperator = item.TypeOperator;
                  break;
              }
              return {
                id: index + 1,
                selectedValFirst: ID,
                selectedValSecond: item.FieldName,
                types: types,
                controlChangedDetail: {
                  ...item,
                  Range: rangeExceptBrace,
                  TypeOperator: typeoperator
                },
                keyList: this.keyListDemo.filter(it => types.includes(it.type))
              };
            })
          );
          // console.log(this.modalForm.ruleDefineData,'ruleDefineData');

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
          // console.log(this.modalForm.ruleDefineData, this.activeRow.rdIdentify);
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
          // this.$set(this.modalForm, "ruleDesc", this.activeRow.rulesName); //描述
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
      this.modalForm = {
        rulesFitObj: "",
        path: [""],
        ruleDesc: "",
        ruleDescArr: [],
        ruleDefineData: [
          {
            id: 1,
            selectedValFirst: 1,
            selectedValSecond: "未知",
            types: this.valRangeType,
            controlChangedDetail: {
              TypeOperator: ">",
              Range: "0",
              CodeListName: "",
              CodeListID: "",
              StartIndex: "",
              EndIndex: ""
            },
            keyList: []
          }
        ],

        ruleDefineExpression: [],
        pathChildNodeId: "",
        dataPropDefine: []
      };
      this.$set(this.modalForm, "path", []);
      this.$set(this.modalForm, "ruleDesc", "");
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
          Conditions: this.modalForm.ruleDefineData.map((item, index) => {
            // if (item.selectedValFirst === 3) {
            // console.log(
            //   "(" +
            //     item.controlChangedDetail.Range.split(",")
            //       .map(i => "'" + i + "'")
            //       .join(",") +
            //     ")"
            // );
            // }
            return {
              ConType:
                item.selectedValFirst === 1
                  ? "数值范围约束"
                  : item.selectedValFirst === 2
                  ? "空值约束"
                  : "代码范围约束",
              FieldName: item.selectedValSecond,
              TypeOperator:
                item.selectedValFirst === 3
                  ? "in"
                  : item.controlChangedDetail.TypeOperator,
              Range:
                item.selectedValFirst === 3
                  ? "(" +
                    item.controlChangedDetail.Range.split(",")
                      .map(i => "'" + i + "'")
                      .join(",") +
                    ")"
                  : item.controlChangedDetail.Range,
              CodeListName: item.controlChangedDetail.CodeListName,
              CodeListID: item.controlChangedDetail.CodeListID,
              StartIndex: "",
              EndIndex: ""
            };
          }),

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
          // 修改规则

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
          // 添加规则

          addRules(postData).then(res => {
            const { data, code, message } = res.data;
            if (code === 1000) {
              this.$Message.info("添加成功");
              this.getZJListPageById();
              this.modalFlag = false;
              this.clearFormItem();
            } else if (code === 2001) {
              this.$Message.warning(message);
            } else {
              this.$Message.warning("服务异常，请稍后再试。");
            }
          });
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
.drawer-footer{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: center;
  background: #fff;
}
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
    width: 100%;
    margin-bottom: 3.25rem;
    // padding: 0.5rem;
    height: 3.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
}
.rule-express-wrap,
.rule-control-wrap {
  position: absolute;
  left: 0;
  top: 0;
}
.rule-express-wrap {
  height: 3.25rem;
  line-height: 3.25rem;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  .rule-express {
    // padding-left: 0.5rem;
    margin: 3.25rem 0;
  }
}
::v-deep .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  text-align: center;
}
::v-deep .ivu-input {
  text-align: center;
}
</style>
