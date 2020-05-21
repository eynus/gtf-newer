<template>
  <div>
    <div class="mt">
      <Form inline>
        <FormItem>
          <Button type="success">默认启用</Button>
        </FormItem>
        <FormItem>
          <Button type="info" @click="showModal">添加规则</Button>
        </FormItem>
        <FormItem>
          <Button type="warning">修改规则</Button>
        </FormItem>
        <FormItem>
          <Button type="error">删除规则</Button>
        </FormItem>
      </Form>
    </div>
    <Table border size="small" :columns="columnsPutIn" :data="dataPutIn" ref="selection">
      <template slot="operation" slot-scope="{row,index}">
        <a href="#">启用</a>
      </template>
    </Table>
    <Modal
      v-model="modalFlag"
      class-name="vertical-center-modal"
      title="值域规范性规则添加"
      @on-ok="ok"
      @on-cancel="cancel"
      :width="remToPx(45)"
    >
      <div class="modal-item">
        <div class="title mb">规则适用对象</div>
        <div>
          <Cascader :data="dataPaths" v-model="formInline.path" @on-change="handlePathChange"></Cascader>
        </div>
      </div>
      <div class="modal-item">
        <div class="title mb">规则描述</div>
        <div>
          <Input v-model.trim="formInline.obj" placeholder="请输入" clearable />
        </div>
      </div>
      <div class="modal-item mt">
        <div class="title">规则定义</div>
        <div class="mt">
          <Form inline>
            <FormItem>
              <Button type="info">添加字段</Button>
            </FormItem>
            <FormItem>
              <Button type="warning">修改字段</Button>
            </FormItem>
            <FormItem>
              <Button type="error">删除字段</Button>
            </FormItem>
          </Form>
        </div>
        <div>
          <Table
            border
            size="small"
            :columns="columnsPropDefine"
            :data="dataPropDefine"
            ref="selection"
          ></Table>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
import { getPaths } from "@/api/dataManage/overview";
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
  name: "mathbasic",
  data() {
    return {
      modalFlag: false,
      dataPaths: [],
      formInline: {
        obj: "",
        obj2: "",
        path: [""]
      },
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
          align: "center"
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
      ],
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
    };
  },
  created() {
    this.getPaths();
  },
  methods: {
    showModal() {
      this.modalFlag = true;
    },
    //选中路径变化
    handlePathChange(a, b) {
      this.formInline.path = a;
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
    ok() {},
    cancel() {}
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
}
</style>