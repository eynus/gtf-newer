<template>
  <div>
    <Drawer
        :title="title"
        v-model="modalFlag"
        width="1000"
        :styles="styles"
        @on-visible-change="visiable">
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
      <div class="modal-item mt position-r">
        <div class="title">属性结构定义</div>
        <div class="mt" style="margin-bottom: 10px;">
          <div class="g-button-wrapper">
            <button v-auth="['page_5_4_1']" class="g-button" @click="handleAddKey" :disabled="modalForm.updateKeyBtnDisabled">
              <Icon :type="$btn.create" /> 添加字段</button>
            <button v-auth="['page_5_4_5']" class="g-button" @click="handleUpdateKey" :disabled="modalForm.updateKeyBtnDisabled">
              <Icon :type="$btn.edit" /> 修改字段</button>
            <button v-auth="['page_5_4_2']" class="g-button" @click="handleDeleteKey" :disabled="modalForm.deleteKeyBtnDisabled">
              <Icon :type="$btn.del" /> 删除字段</button>
            <button v-auth="['page_5_4_3']" class="g-button" @click="handleKeySubmit" v-show="modalForm.deleteKeyBtnDisabled">
              <Icon :type="$btn.edit" /> 保存</button>
            <button v-auth="['page_5_4_4']" class="g-button" @click="handleKeyQuit" v-show="modalForm.deleteKeyBtnDisabled">
              <Icon :type="$btn.del" /> 取消</button>
          </div>
        </div>
        <div class="overflow-hidden-x zt-scroll-y">
          <div>
            <Table
                border
                stripe
                size="small"
                width="100%"
                :columns="modalForm.columnsPropDefine"
                :data="modalForm.dataPropDefine"
                ref="selection"
                @on-select="handleSelectKeyRow"
                @on-select-cancel="handleCancelKeyRow"
                @on-select-all="handleSelectKeyRowAll"
                @on-select-all-cancel="handleCancelKeyRowAll"
            >
              <template slot-scope="{ row, index }" slot="FieldName">
                <Input type="text" data-vv-name="FieldName" v-validate.persist="'required'" v-model.trim="modalKeyFormItem.FieldName" v-if="editIndex === index" />
                <span v-else>{{ row.FieldName }}</span>
                <span class="validate" v-if="editIndex === index">
                  {{ errors.first('FieldName') }}
                </span>
              </template>
              <template slot-scope="{ row, index }" slot="FieldCode">
                <Input type="text" data-vv-name="FieldCode" v-validate.persist="'required|alpha'" v-model="modalKeyFormItem.FieldCode" v-if="editIndex === index" />
                <span v-else>{{ row.FieldCode }}</span>
                <span class="validate" v-if="editIndex === index">
                  {{ errors.first('FieldCode') }}
                </span>
              </template>
              <template slot-scope="{ row, index }" slot="FieldType">
                <Select :transfer="true" data-vv-name="FieldType" v-validate.persist="'required'" v-model="modalKeyFormItem.FieldType" v-if="editIndex === index" @on-change="handleKeyTypechange">
                  <Option value="Char">Char</Option>
                  <Option value="VarChar">VarChar</Option>
                  <Option value="Int">Int</Option>
                  <Option value="Float">Float</Option>
                  <Option value="Date">Date</Option>
                </Select>
                <span v-else>{{ row.FieldType }}</span>
                <span class="validate" v-if="editIndex === index">
                  {{ errors.first('FieldType') }}
                </span>
              </template>
              <template slot-scope="{ row, index }" slot="FieldLength">
                <Input type="text" data-vv-name="FieldLength" v-validate.persist="'required|numeric|min:0'"  v-model.trim="modalKeyFormItem.FieldLength" v-if="editIndex === index" />
                <span v-else>{{ row.FieldLength }}</span>
                <span class="validate" v-if="editIndex === index">
                  {{ errors.first('FieldLength') }}
                </span>
              </template>
              <template slot-scope="{ row, index }" slot="DecimalLength">
                <InputNumber :min="1" data-vv-name="DecimalLength" v-validate.persist="'numeric|min:0'" v-model.number="modalKeyFormItem.DecimalLength"  v-if="editIndex === index && modalKeyFormItem.FieldType === 'Float'"></InputNumber>
                <span v-else>{{ row.DecimalLength }}</span>
                <span class="validate" v-if="editIndex === index">
                  {{ errors.first('DecimalLength') }}
                </span>
              </template>
            </Table>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" type="primary" @click="ok">提交</Button>
        <Button @click="cancel">关闭</Button>
      </div>
    </Drawer>
    <my-delete :show="delModalKeyFlag" @ok="confirmDelKey" @cancel="quitDelKey"></my-delete>
  </div>
</template>

<script>
  import '@/utils/veevalidate'
  import {addRules, getVRRKeyListById, updateRules} from "@/api/dataManage/inspection";
  import {remToPx} from "@/utils/common";
  import MyDelete from '@/components/delete'
  const validate = {
    custom: {
      FieldName: {
        required: () => '字段名称不能为空',
      },
      FieldCode: {
        required: () => '字段代码不能为空',
        alpha: () => '字段代码必须为英文字符',
      },
      FieldLength: {
        required: () => '字段长度不能为空',
        numeric: () => '字段长度必须为数字值',
        min: () => '字段长度不能小于0'
      },
      FieldType: {
        required: () => '字段类型不能为空',
      },
      DecimalLength: {
        numeric: () => '小数位数必须为数字值',
        min: () => '小数位数不能小于0'
      }
    },
  };
  export default {
    name: "PropStructEdit",
    components: { MyDelete },
    props: {
      dataPaths: Array, // 规则适用对象
    },
    data() {
      return {
        title: '',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        modalFlag: false,
        isRuleUpdate: false,
        editIndex: null,
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
              slot: 'FieldName',
              align: "center",
              width: remToPx(10)
            },
            {
              title: "字段代码",
              key: "FieldCode",
              slot: 'FieldCode',
              align: "center"
            },
            {
              title: "字段类型",
              key: "FieldType",
              slot: 'FieldType',
              align: "center"
            },
            {
              title: "字段长度",
              key: "FieldLength",
              slot: 'FieldLength',
              align: "center"
            },
            {
              title: "小数位数",
              key: "DecimalLength",
              slot: 'DecimalLength',
              align: "center"
            }
          ],
          dataPropDefine: []
        },
        modalKeyFormItem: {
          // FieldName: "",
          // FieldType: "",
          // FieldCode: "",
          // FieldLength: "",
          // DecimalLength: ""
        },
        delModalKeyFlag: false,
        positionLeft: 0,
        isKeyFormUpdate: false,
        selectedKeyRowIds: []
      }
    },
    methods: {
      insert() {
        this.modalFlag = true
        this.isRuleUpdate = false
        this.title = '新建属性结构规范性规则'
      },
      edit(selection) {
        selection = JSON.parse(JSON.stringify(selection))
        this.modalFlag = true
        this.isRuleUpdate = true
        this.title = '修改属性结构规范性规则'
        this.$set(this.modalForm, "pathChildNodeId", selection.dsPkid)
        this.$set(this.modalForm, 'dataPropDefine', selection.rdIdentify)
        this.$set(this.modalForm, "path", selection.path)
        this.activeRow = selection
        this.editIndex = null
        this.handleEnableBtn()
      },
      // 修改不保存状态，新建保存状态
      visiable() {
        if (!this.modalFlag && this.isRuleUpdate) {
          this.clearFormItem();
          this.clearPathAndKeys();
          this.selectedRowIds = [];
          this.editIndex = null
          this.handleEnableBtn()
        }
      },
      // modal框确定按钮
      ok() {
        if (!this.modalForm.path[0]) {
          this.$Message.info("请选择规则适用对象")
          return
        }
        if (!this.modalForm.dataPropDefine.length) {
          this.$Message.info("请添加字段")
          return
        }
        if (this.modalForm.addKeyBtnDisabled) {
          this.$Message.info("当前处于编辑状态，不可提交")
          return
        }

        let rulesNameConcat = `${this.modalForm.path[this.modalForm.path.length - 1]}属性结构符合要求，包括数量、名称、类型、长度、小数位数均符合要求`
          // 请求addRules接口
        // delete this.modalForm.dataPropDefine.id // id 是前端标识，不传递给后端
        // this.modalForm.dataPropDefine.forEach(item => {
        //   delete item.id
        // })
        let postData = {
          rulesCode: this.$route.query.rules_code,
          dsPkid: String(this.modalForm.pathChildNodeId),
          dataPath: this.modalForm.path.join(","),
          rdIdentify: JSON.stringify(this.modalForm.dataPropDefine),
          rulesMlId: this.$route.query.id,
          rulesName: rulesNameConcat, //自己拼接
        }
        if (this.isRuleUpdate) {
          postData["pkId"] = this.activeRow.pkId
          updateRules(postData).then(res => {
            const { data, code } = res.data;
            if (code === 1000) {
              this.$Message.info("修改成功");
              this.$emit('close');
              this.modalFlag = false;
              this.clearFormItem();
              this.clearPathAndKeys();
              this.selectedRowIds = [];
            } else {
              this.$Message.info("服务异常，请稍后再试。");
            }
          });

        } else {
          if (this.canISelect) {
            addRules(postData).then(res => {
              const { data, code, message } = res.data;
              if (code === 1000) {
                this.$Message.info("添加成功");
                this.$emit('close')
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
      },
      // modal取消按钮
      cancel() {
        this.modalFlag = false
        this.clearFormItem();
        this.clearPathAndKeys();
        this.editIndex = null
      },
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
      //获取数据路径列表
      handlePathChange(a, b) {
        //  console.log("??2", this.modalForm, this.modalForm.dataPropDefine,b);
        this.modalForm.path = a;
        this.modalForm.pathChildNodeId = b[b.length - 1].pkId;
        this.getVRRKeyListById();
      },
      // 添加字段
      handleAddKey() {
        this.isKeyFormUpdate = false;
        let data = {
          id: this.modalForm.dataPropDefine.length + 1,
          FieldName: null,
          FieldType: null,
          FieldCode: null,
          FieldLength: null,
          DecimalLength: null
        }
        this.modalForm.dataPropDefine.push(data)
        this.editIndex = this.modalForm.dataPropDefine.length - 1
        this.handleDisableBtn()
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
            this.handleDisableBtn()
            // 赋值
            let selection = this.modalForm.dataPropDefine.find(item => item.id == this.selectedKeyRowIds[0])
            this.modalKeyFormItem = {
              id: selection.id,
              ...selection
            }
            this.editIndex = selection.id -1
            this.isKeyFormUpdate = true
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
        this.$set(this.modalForm, "dataPropDefine", [])
        this.$set(this.modalForm, "path", [])
      },
      // 清空规则
      clearFormItem() {
        this.modalKeyFormItem = {}
      },
      // 添加修改字段-提交
      handleKeySubmit() {
        this.$validator.validateAll().then((result) => {
          if (!result) {
            return false
          }
          this.handleEnableBtn()
          if (this.isKeyFormUpdate) {
            // 修改到表格中
            let { id } = this.modalKeyFormItem
            this.$set(this.modalForm.dataPropDefine, id -1, {...this.modalKeyFormItem}) //响应式改变数据
            this.$Message.info("修改成功！")
          } else {
            // 新增到表格中
            this.selectedKeyRowIds = []
            this.modalForm.dataPropDefine.pop()
            this.modalForm.dataPropDefine.push({
              id: this.modalForm.dataPropDefine.length + 1,
              ...this.modalKeyFormItem
            })
            this.$Message.info("添加成功！")
          }
          this.editIndex = null
          this.selectedKeyRowIds = []
          this.modalKeyFormItem = {}
          this.$validator.reset()
        })
      },
      // 添加/修改字段-取消
      handleKeyQuit() {
        this.$validator.pause()
        this.$nextTick(() => {
          this.$validator.resume()
          this.$validator.reset() // 清空表单校验状态
          this.editIndex = null
          this.modalKeyFormItem = {}
          this.$refs.selection.selectAll(false)
          this.handleEnableBtn()
          if(!this.isKeyFormUpdate) {
            this.modalForm.dataPropDefine.pop()
          }
          this.selectedKeyRowIds = []
        })

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
      handleKeyTypechange(e) {
        // console.log(e);
        if (e !== "Float") {
          this.modalKeyFormItem.DecimalLength = ""
        }
      },
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
    },
    mounted() {
      this.$validator.localize('zh_CN', validate)
    }
  }
</script>

<style lang="scss" scoped>
  .validate {
    color: red;
  }
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
