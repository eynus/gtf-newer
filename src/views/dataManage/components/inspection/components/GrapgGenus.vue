<template>
  <div>
    <div class="mt">
      <Form inline>
        <FormItem>
          <Button v-auth="['page_5_4_1']" type="success">默认启用</Button>
        </FormItem>
        <FormItem>
          <Button v-auth="['page_5_4_2']" type="info">添加规则</Button>
        </FormItem>
        <FormItem>
          <Button v-auth="['page_5_4_3']" type="warning">修改规则</Button>
        </FormItem>
        <FormItem>
          <Button v-auth="['page_5_4_4']" type="error">删除规则</Button>
        </FormItem>
      </Form>
    </div>
    <Table border size="small" :columns="columnsPutIn" :data="dataPutIn" ref="selection">
      <template slot="operation" slot-scope="{row,index}">
        <a href="#" class="text-blue">启用</a>
      </template>
    </Table>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
export default {
  name: "mathbasic",
  data() {
    return {
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
  methods: {}
};
</script>
