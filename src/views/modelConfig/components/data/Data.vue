<template>
  <div class="h100 bg-white">
    <card-title icon="iconfont  icon-type" title="指标数据查看"></card-title>
    <div class="pd">
      <div class="search-box position-r">
        <div class="top flex flex-sb">
          <div class="top-left">
            <span class="top-left-label">地区：</span>
            <span class="mr-lg text-blue top-left-value">{{selectedAreaName}}</span>
            <span class="top-left-label">指标分类：</span>
            <span class="mr-lg text-blue top-left-value">{{selectedTypeName}}</span>
          </div>
          <div class="top-right flex">
            <Button class @click="showUploadModal">上传</Button>

            <Button type="primary" class="ml">
              <a :href="exportUrlTpl" target="_blank">导出模板</a>
            </Button>
            <Button type="primary" class="ml">
              <a :href="exportUrlTb" target="_blank">导出表格</a>
            </Button>
            <Button class="ml" @click="handleShowSearchBox">{{showSearchBox?'收起筛选条件':"显示筛选条件"}}</Button>
          </div>
        </div>
        <div class="bottom" v-if="showSearchBox">
          <div class="area-card card">
            <div class="card-label">地区：</div>
            <div class="card-list flex">
              <div
                class="card-list-item cursor-pointer"
                v-for="(item,index) in areaList"
                :key="`area_${index}`"
                :class="{'card-list-item-active':item.id===selectedAreaId}"
                @click="handleChangeArea(item.id)"
              >{{item.name}}</div>
            </div>
          </div>
          <div class="type-card card">
            <div class="card-label">指标分类：</div>
            <div class="card-list flex">
              <div
                class="card-list-item cursor-pointer"
                v-for="(item,index) in typeList"
                :class="{'card-list-item-active':item.id===selectedTypeId}"
                :key="`type_${index}`"
                @click="handleChangeType(item.id)"
              >{{item.name}}</div>
            </div>
          </div>
          <div class="btn-card text-right">
            <Button type="primary" class="btn-margin mr-lg" @click="handleSearch">查询</Button>
          </div>
        </div>
      </div>

      <div class="mt">
        <Table
          :loading="tableLoading"
          border
          size="small"
          :columns="columnsPutIn"
          :data="dataPutIn"
          ref="selection"
          @on-select="handleSelectRow"
          @on-select-cancel="handleCancelRow"
          @on-select-all="handleSelectRowAll"
          @on-select-all-cancel="handleCancelRowAll"
        ></Table>
      </div>
    </div>

    <Modal v-model="modalFlag" class-name="vertical-center-modal" title="上传" :width="remToPx(30)">
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
        <Button @click="cancel">取消</Button>
      </div>
      <Form ref="modalForm" :model="modalForm" :label-width="remToPx(12)" :rules="ruleInline">
        <FormItem label="指标分类：" prop="type">
          <Select v-model="modalForm.type" style="width:10.25rem">
            <Option
              :value="item.id"
              v-for="(item,index) in typeList"
              :key="`typemodal_${index}`"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="上传文件：" prop="file">
          <div class="flex">
            <Upload
              :action="'lsp-model/api/model/importData'"
              :before-upload="handleBeforeUpload"
              :format="['xls', 'xlsx']"
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :show-upload-list="true"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-format-error="handleFormatError"
              ref="upload"
            >
              <i-button type="primary">上传</i-button>
            </Upload>
            <span class="ml">{{modalFileName}}</span>
          </div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
import Storage from "@/utils/storage";
import { getList, getByLevel, importData } from "@/api/modelConfig/data";
export default {
  name: "plan",
  data() {
    return {
      modalFileName: "",
      modalForm: { type: "", file: "" },
      ruleInline: {
        type: [
          {
            required: true,
            message: "指标类型不能为空.",
            trigger: "change",
            type: "number"
          }
        ],
        file: [
          {
            required: true,
            message: "附件不能为空",
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("附件不能为空"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      modalFlag: false,
      tableLoading: false,
      selectedRowIds: [],
      showSearchBox: false,
      selectedAreaId: 0,
      selectedAreaName: "昭通市",
      selectedTypeId: 1,
      selectedTypeName: "",
      areaList: [],
      typeList: [],
      columnsPutIn: [],

      dataPutIn: []
    };
  },
  components: {},
  computed: {
    exportUrlTpl() {
      return `lsp-model/api/model/downTemplate`;
    },
    exportUrlTb() {
      return `lsp-model/api/model/export?pkId=${this.selectedTypeId}&zbsjXzqhName=${this.selectedAreaName}`;
    }
  },
  created() {
    this.areaList = Storage.getArea().map(item => ({
      name: item.placeName,
      id: item.pkId
    }));
    // this.selectedAreaId = "";
    // this.selectedAreaName = "";
    this.selectedAreaId = this.areaList[0].id;
    this.selectedAreaName = this.areaList[0].name;
    this.getByLevel();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    // 上传按钮
    handleBeforeUpload(file) {
      console.log(file);
      this.modalFileName = file.name;
      this.modalForm.file = file;
      let fileSize = file.size / 1024 / 1024;
      if (fileSize > 100) {
        this.$Message.warning({
          title: "文件大小超限",
          desc: "文件 " + file.name + " 太大，上传文件大小不能超过100M."
        });
        return false;
      }
      this.$refs.modalForm.validateField("file", res => {}); // 重新校验
      return false;
    },
    handleUpload() {
      let formData = new FormData();
      formData.append("pkId", this.modalForm.type);
      // for (var i = 0; i < this.picFiles.length; i++) {
      formData.append("file", this.modalForm.file); // 文件对象
      // imgArr.push(this.picFiles[i].src)
      // }
      importData(formData).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.modalFlag = false;
          this.$Message.info("上传成功。");
          this.getList();
        }
      });
    },
    handleSuccess() {
      this.$Message.info("上传成功。");
      this.getList();
    },
    handleError(e) {
      this.$Message.warning(e);
    },
    handleFormatError() {
      this.$Message.warning("文件格式错误，请上传xls、xlsx格式的文件");
      return false;
    },
    // 查詢按鈕
    handleSearch() {
      this.showSearchBox = false;
      this.getList();
    },
    // 获取所属类型
    getByLevel() {
      getByLevel().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.typeList = data.map(item => ({
            id: item.pkId,
            name: item.zbflName
          }));
          this.selectedTypeId = this.typeList[0].id;
          this.selectedTypeName = this.typeList[0].name;
          this.getList();
        }
      });
    },
    // 获取数据列表
    getList() {
      this.tableLoading = true;
      getList({
        pkId: this.selectedTypeId,
        zbsjXzqhName: this.selectedAreaName
      }).then(res => {
        this.dataPutIn = [];
        const { data, code } = res.data;
        if (code === 1000) {
          this.tableLoading = false;
          let column = [];
          for (let key in data) {
            let dataItem = { year: key };
            column = [
              {
                title: "序号",
                type: "index",
                align: "center",
                width: remToPx(4)
              },
              {
                title: "年份",
                key: "year",
                align: "center",
                width: remToPx(8)
              },
              {
                title: "地区",
                key: "zbsjXzqhName",
                align: "center",
                width: remToPx(8)
              }
            ];
            // 重新设置column

            if (column.length < data[key].length + 3) {
              column = [
                {
                  title: "序号",
                  type: "index",
                  align: "center",
                  width: remToPx(4)
                },
                {
                  title: "年份",
                  key: "year",
                  align: "center",
                  width: remToPx(8)
                },
                {
                  title: "地区",
                  key: "zbsjXzqhName",
                  align: "center",
                  width: remToPx(8)
                }
              ];

              data[key].forEach(it => {
                column.push({
                  title: it.zbmxName,
                  key: it.zbmxName,
                  align: "center"
                });
              });
            }
            data[key].forEach(it => {
              dataItem[it.zbmxName] = it.zbsjData;
              dataItem["zbsjXzqhName"] = it.zbsjXzqhName;
            });
            // console.log(dataItem,column);

            this.dataPutIn.push(dataItem);
          }
          this.columnsPutIn = column;
        }
      });
    },
    handleChangeArea(id) {
      if (id === this.selectedAreaId) {
        // 取消选择
        this.selectedAreaId = 0;
        this.selectedAreaName = "昭通市";
      } else {
        this.selectedAreaId = id;
        this.selectedAreaName = this.areaList.find(item => item.id === id).name;
      }
    },
    handleChangeType(id) {
      this.selectedTypeId = id;
      this.selectedTypeName = this.typeList.find(item => item.id === id).name;
    },
    // 显示筛选条件
    handleShowSearchBox() {
      this.showSearchBox = !this.showSearchBox;
    },
    // 选择某一行
    handleSelectRow(selection, row) {
      this.selectedRowIds.push(row.id + "");
    },
    handleSelectRowAll(selection) {
      this.selectedRowIds = selection.map((item, index) => item.id + "");
    },
    handleCancelRow(selection, row) {
      for (let i = 0; i < this.selectedRowIds.length; i++) {
        if (this.selectedRowIds[i] === row.id + "") {
          this.selectedRowIds.splice(i, 1);
        }
      }
    },
    handleCancelRowAll(selection) {
      this.selectedRowIds = [];
    },
    showUploadModal() {
      this.modalFlag = true;
    },
    // modal框确定按钮
    ok() {
      this.$refs["modalForm"].validate(valid => {
        if (valid) {
          this.handleUpload();
        }
      });
    },
    // modal取消按钮
    cancel() {
      this.modalFlag = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.top-left {
  &-value {
    display: inline-block;
    width: 10rem;
  }
}
.top-right {
  a {
    color: #fff;
  }
}
.search-box {
  padding: 1rem;
  border-bottom: 1px solid $text-normal;
  .bottom {
    position: absolute;
    left: 0;
    top: 3rem;
    width: 100%;
    // height: 20rem;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 2rem;
    .card {
      margin: 2rem;
      color: rgba(0, 0, 0, 0.8);
      display: flex;
      .card-label {
        font-weight: bold;
        width: 6rem;
        padding: 0.25rem 0.5rem;
      }
      .card-list {
        .card-list-item {
          color: rgba(255, 255, 255, 0.8);
          padding: 0.25rem 0.5rem;
          margin: 0 1rem;
          &-active {
            background-color: $text-blue;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>