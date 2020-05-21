<template>
  <div>
    <div class="module-head">
      <div class="flex flex-sb">
        <div>
          <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />
          <span class="ml">服务注册</span>
        </div>

        <div class="mr cursor-pointer" @click="returnTo">
          <Icon type="md-arrow-back" color="#2d8cf0" />
          <span class="text-blue">返回</span>
        </div>
      </div>
    </div>

    <Form ref="formInline" inline class="mt">
      <div class="flex flex-sb">
        <div>
          <FormItem prop="name">
            <Input style placeholder="请输入服务名称关键字" />
          </FormItem>
          <FormItem>
            <Button type="primary">查询</Button>
          </FormItem>
        </div>
        <FormItem>
          <Button type="primary">发布</Button>
        </FormItem>
      </div>
    </Form>

    <Table border size="small" :columns="columnsPutIn" :data="dataPutIn" ref="selection">
      <template slot="path" slot-scope="{row,index}">
        <a href="#">{{row.dataPath}}</a>
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
import { insertServer } from "@/api/dataManage/service";
export default {
  name: "Home",
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
          title: "状态",
          key: "status",
          align: "center",
          width: remToPx(20)
        },
        {
          title: "数据路径",
          slot: "path",
          align: "center"
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
        pageSize: 6
      }
    };
  },
  computed: {},
  created(){
    this.insertServer()
  },
  methods: {
    returnTo() {
      this.$router.push("/data/service");
    },
    //切换页数
    changePage(index) {
      this.page.current = index;
      this.getListPage();
    },
    getListPage() {},
    insertServer() {
      insertServer().then(res => {
        let { data, code } = res.data;
        if (code === 1000) {
          console.log('data',data);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.img-wrap {
  width: 5rem;
  height: 5rem;
  background: url("../../../../../assets/img/dataManage/query/map.png");
}
.service-list-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .item-title {
    font-weight: 700;
    font-size: 1.125rem;
  }
  .item-label {
    display: inline-block;
    width: 6rem;
  }
}
</style>