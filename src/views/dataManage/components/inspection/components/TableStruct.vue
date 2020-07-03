<template>
  <div>
<!--    <div class="mt">-->
<!--      <Form inline>-->
<!--        <FormItem>-->
<!--          <Button v-auth="['page_5_4_1']" type="success">默认启用</Button>-->
<!--        </FormItem>-->
<!--        <FormItem>-->
<!--          <Button @click="openModal" v-auth="['page_5_4_2']" type="info">添加规则</Button>-->
<!--        </FormItem>-->
<!--        <FormItem>-->
<!--          <Button @click="editModal" v-auth="['page_5_4_3']" type="warning">修改规则</Button>-->
<!--        </FormItem>-->
<!--        <FormItem>-->
<!--          <Button v-auth="['page_5_4_4']" type="error">删除规则</Button>-->
<!--        </FormItem>-->
<!--      </Form>-->
<!--    </div>-->
<!--    <Table border size="small" :columns="columnsPutIn" :data="dataPutIn" ref="selection">-->
<!--      <template slot="operation" slot-scope="{row,index}">-->
<!--        <a href="#" class="text-blue">启用</a>-->
<!--      </template>-->
<!--    </Table>-->
    <div class="table-header">
      <Table :columns="column" border></Table>
    </div>
    <Modal
        v-model="modalFlag"
        class-name="vertical-center-modal"
        title="表格结构规范性规则添加"
        :width="remToPx(50)">
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
        <Button @click="cancel">取消</Button>
      </div>
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
        <div class="mt">
          <Form inline>
            <FormItem>
              <Button @click="addKey" type="info" :disabled="keyBtn.add">添加字段</Button>
            </FormItem>
            <FormItem>
              <Button @click="editKey" type="warning" :disabled="keyBtn.update">修改字段</Button>
            </FormItem>
            <FormItem>
              <Button type="error" :disabled="keyBtn.del">删除字段</Button>
            </FormItem>
          </Form>
        </div>
        <div class="overflow-hidden-x zt-scroll-y">
          <div
              class="flex flex-nowrap transition"
              :style="{ width: `${remToPx(98)}px`,'margin-left':`${positionLeft}px `}"
          >
            <div>
              <Table
                  border
                  size="small"
                  :columns="tableCol"
                  :data="modalForm.dataPropDefine"
                  ref="selection"
                  :width="remToPx(48)"
                  @on-select="handleSelect"
                  @on-select-all="handleSelectAll"
              >

              </Table>
            </div>
            <div class="right-box">
              <Row>
                <Form
                    :model="modalForm"
                    ref="modalForm"
                    :rules="modalFormRule"
                    :label-width="remToPx(10)"
                    inline
                >
                  <Col span="12">
                    <FormItem label="字段名称：" prop="keyName">
                      <Input v-model.trim="modalForm.keyName" />
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="字段长度：" prop="keyCode">
                      <Input v-model.number="modalForm.keyCode" />
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="字段类型：" prop="keyType">
                      <Select v-model="modalForm.keyType" style="width:10.25rem">
                        <Option value="Char">Char</Option>
                        <Option value="VarChar">VarChar</Option>
                        <Option value="Int">Int</Option>
                        <Option value="Float">Float</Option>
                        <Option value="Date">Date</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="字段长度：" prop="keyLength">
                      <Input v-model.trim="modalForm.keyLength" />
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="数据起始行：" prop="dataStart">
                      <Input v-model="modalForm.dataStart" />
                    </FormItem>
                  </Col>
                </Form>
              </Row>
              <div class="text-right divided mr-lg">
                <Button type="primary" @click="keySubmit">提交</Button>
                <Button style="margin-left: 8px" @click="keyCancel">取消</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import json from "@/views/dataManage/components/inspection/json";
  import { remToPx } from "@/utils/common";
  import {addRules, getVRRKeyListById, updateRules} from "@/api/dataManage/inspection";
  import { getPaths } from "@/api/dataManage/overview";
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
    name: "TableStruct",
    data() {
      return {
        column: [
          {
            title: 'name',
            align: 'center',
            firstRow: 1,
            lastRow: 0,
            children: []
          }
        ],
        selection: [],
        modalFlag: false,
        modalForm: {
          path: [],
          keyName: '',
          keyCode: '',
          keyType: '',
          keyLength: '',
          dataStart: '',
        },
        modalFormRule: {

        },
        isRuleUpdate: false,
        dataPaths: [],
        positionLeft: 0,
        keyBtn: {
          add: false,
          update: false,
          del: false,
        },
        tableCol: [
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
            title: "数据起始行",
            key: "DecimalLength",
            align: "center"
          }
        ],
        columnsPutIn: [
          {
            title: "选中",
            type: "selection",
            key: "time",
            align: "center",
            width: remToPx(10)
          },
          {
            title: "规则描述",
            key: "status",
            // align: "center"
          },
          {
            title: "默认启用",
            slot: "operation",
            align: "center",
            width: remToPx(10)
          }
        ],
        dataPutIn: [
          {
            status: "未发布",
            dataPath: "/.//"
          },
          {
            status: "未发布",
            dataPath: "/.//"
          },
          {
            status: "未发布",
            dataPath: "/.//"
          }
        ]
      };
    },
    methods: {
      openModal() {
        this.modalFlag = true
        this.opt = 'add'
      },
      editModal() {
        if (this.selection.length !== 1) {

        }
      },
      keySubmit() {

      },
      keyCancel() {
        this.positionLeft = 0;
        this.handleEnableBtn();
        this.$refs['modalForm'].resetFields()
      },
      editKey() {

      },
      addKey() {
        let pxNumber = this.remToPx(50);
        this.positionLeft = -pxNumber;
        this.handleDisableBtn();
      },
      handleDisableBtn() {
        this.keyBtn.add = true
        this.keyBtn.update = true
        this.keyBtn.del = true
      },
      handleEnableBtn() {
        this.keyBtn.add = false
        this.keyBtn.update = false
        this.keyBtn.del = false
      },
      handlePathChange(a, b) {
        this.modalForm.path = a;
        this.modalForm.pathChildNodeId = b[b.length - 1].pkId;
        this.getVRRKeyListById();
      },
      getPaths() {
        getPaths().then(res => {
          const { data, code } = res.data;
          if (code === 1000) {
            let raw = (data && data.data) || []
            this.dataPaths = handleRawData(raw)
          }
        });
      },
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
      ok() {
        // if (!this.modalForm.path[0]) {
        //   this.$Message.info("请选择规则适用对象");
        //   return;
        // } else if (!this.modalForm.dataPropDefine.length) {
        //   this.$Message.info("请添加字段");
        //   return;
        // } else {
        //   // console.log("??2", this.modalForm, this.modalForm.dataPropDefine);
        //   // let newData = this.modalForm.dataPropDefine
        //   let rulesNameConcat = `${
        //     this.modalForm.path[this.modalForm.path.length - 1]
        //   }属性结构符合要求，包括数量、名称、类型、长度、小数位数均符合要求`;
        //   // 请求addRules接口
        //   let postData = {
        //     createdBy: this.activeRow.createdBy,
        //     createdTime: "",
        //     dataName: this.activeRow.dataName,
        //     dsPkid: String(this.modalForm.pathChildNodeId),
        //     pkId: this.activeRow.id,
        //     dataPath: this.modalForm.path.join(","),
        //     rdIdentify: JSON.stringify(this.modalForm.dataPropDefine),
        //     rulesCode: this.activeRow.rulesCode,
        //     rulesMlId: this.$route.query.id,
        //     rulesName: rulesNameConcat, //自己拼接
        //     unCheck: this.activeRow.unCheck,
        //     unRead: this.activeRow.unRead,
        //     unUpdate: this.activeRow.unUpdate,
        //     updatedBy: this.activeRow.updatedBy,
        //     updatedTime: this.activeRow.updatedTime,
        //     validity: this.activeRow.validity
        //   };
        //   if (this.isRuleUpdate) {
        //     updateRules(postData).then(res => {
        //       const { data, code } = res.data;
        //       if (code === 1000) {
        //         this.$Message.info("修改成功");
        //         this.getZJListPageById();
        //       } else {
        //         this.$Message.info("服务异常，请稍后再试。");
        //       }
        //     });
        //     this.modalFlag = false;
        //     this.clearFormItem();
        //     this.clearPathAndKeys();
        //     this.selectedRowIds = [];
        //   } else {
        //     if (this.canISelect) {
        //       addRules(postData).then(res => {
        //         const { data, code, message } = res.data;
        //         if (code === 1000) {
        //           this.$Message.info("添加成功");
        //           this.getZJListPageById();
        //           this.modalFlag = false;
        //           this.clearFormItem();
        //           this.clearPathAndKeys();
        //           this.selectedRowIds = [];
        //         } else if (code === 2001) {
        //           this.$Message.warning(message);
        //         } else {
        //           this.$Message.info("服务异常，请稍后再试。");
        //         }
        //       });
        //     } else {
        //       this.$Message.warning("该适用对象规则已存在，不能重复添加。");
        //     }
        //   }
        // }
      },
      // modal取消按钮
      cancel() {
        this.modalFlag = false;
        this.clearForm();
      },
      clearForm() {

      },
      handleSelect(val) {
        console.log(val)
      },
      handleSelectAll(val) {
        console.log(val)
      },
      handleJson(json, arr) {
        let i = 0, length = json.length
        let firstRow = 1
        if (length === 0) {
          return []
        }
        for (; i < length; i++) {
          if (json[i] && json[i].firstRow === firstRow) {
            let { firstRow, firstColumn, lastColumn } = json[i]
            let obj = {
              title: json[i].value,
              align: 'center',
              firstRow,
              firstColumn,
              lastColumn,
              children: []
            }
            arr.push(obj)
            json.splice(i ,1)
            i--
            length = json.length
          }
        }
        for(let k = 0; k < arr.length; k++) {
          for(let j = 0; j < length; j++) {
            // 判断上下两个单元格是否含有关系
            if (json[j].firstRow === arr[k].firstRow + 1 && json[j].firstColumn >= arr[k].firstColumn && json[j].lastColumn <= arr[k].lastColumn) {
              json[j]['title'] = json[j].value
              json[j]['align'] = 'center'
              json[j]['minWidth'] = 80
              if (!arr[k]['children']) {
                arr[k]['children'] = []
              }
              arr[k]['children'].push(json[j])
              json.splice(j, 1)
              j--
              length = json.length
            }
          }
          if (length !== 0 && arr[k].children) {
            this.handleJson(json, arr[k].children)
          }
        }
        return arr
      }
    },
    mounted() {
      this.getPaths()
      let arr = this.handleJson(json, [])
      this.column = arr
      let data = [
        [
          {
            title: '123',
            col: 0,
            row: 3
          }
        ]
      ]
    }
  };
</script>

<style lang="scss" scoped>
  .table-header {
    ::v-deep
    .ivu-table-header {
      overflow-x: auto;
    }
  }
</style>
