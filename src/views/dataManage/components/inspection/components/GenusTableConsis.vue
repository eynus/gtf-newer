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
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
import { getZJListPageById } from "@/api/dataManage/inspection";
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
      page: {
        current: 1,
        total: 0,
        pageSize: 10
      }
    };
  },
  methods: {
    //切换页数
    changePage(index) {
      this.page.current = index;
      this.getZJListPageById();
    },
    getZJListPageById() {
      let postData = {
        pageNum: 1,
        pageSize: 10,
        queryTerms: {
          createdBy: "string",
          createdTime: "2020-05-27T05:51:46.081Z",
          pkId: 0,
          rdIdentify: "string",
          rulesCode: "string",
          rulesMlId: "string",
          rulesName: "string",
          unCheck: "string",
          unRead: "string",
          unUpdate: "string",
          updatedBy: "string",
          updatedTime: "2020-05-27T05:51:46.082Z",
          validity: "string"
        }
      };
      getZJListPageById(postData).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          console.log(data);
        }
      });
    }
  }
};
</script>
