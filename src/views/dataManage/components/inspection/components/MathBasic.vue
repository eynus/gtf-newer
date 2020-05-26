<template>
  <div>
    <div class="mt">
      <Form inline>
        <FormItem>
          <Button type="success">默认启用</Button>
        </FormItem>
        <!-- <FormItem>
          <Button type="info" @click="showModal">添加规则</Button>
        </FormItem>
        <FormItem>
          <Button type="warning">修改规则</Button>
        </FormItem>
        <FormItem>
          <Button type="error">删除规则</Button>
        </FormItem>-->
      </Form>
    </div>
    <Table border size="small" :columns="columnsPutIn" :data="dataPutIn" ref="selection">
      <template slot="operation" slot-scope="{row,index}">
        <a href="#">启用</a>
      </template>
    </Table>
    <Modal
      v-model="modalFlag"
      title="Common Modal dialog box title"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
export default {
  name: "mathbasic",
  data() {
    return {
      modalFlag: false,
      columnsPutIn: [
        {
          title: "选中",
          // type: "selection",
          key: "checkBox",
          align: "center",
          width: remToPx(10),
          render: (h, params) => {
            // console.log('render...',params)
            let _self = this;
            return h("div", [
              h("Checkbox", {
                props: {
                  value: params.row.checkBox
                },
                on: {
                  "on-change": e => {
                    e===true?params.row.checkBox=true:params.row.checkBox=false
                    console.log("on-change", e, params.row.checkBox);
                    // if (e == false) {
                    //   _self.disabled = true;
                    // }
                    if ( e === true) {
                      // _self.columnsPutIn.forEach((items, index) => {
                      //   items.checkBox=true
                      //   //先取消所有对象的勾选，checkBox设置为false
                      //   console.log(index, params.index);
                      //   _self.$set(items, "checkBox", false);
                      // });
                    }

                    // _self.$set( _self.columnsPutIn[params.index], "checkBox", event);
                    // _self.columnsPutIn[params.index].checkBox = e; //再将勾选的对象的checkBox设置为true
                  }
                }
              })
            ]);
          }
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
          status: "这是规则描述详情"
        },
        {
          status: "这是规则描述详情"
        },
        {
          status: "这是规则描述详情"
        }
      ]
    };
  },
  created() {},
  methods: {
    showModal() {
      this.modalFlag = true;
    },
    ok() {},
    cancel() {}
  }
};
</script>