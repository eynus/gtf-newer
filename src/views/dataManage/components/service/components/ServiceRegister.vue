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
          <Button type="primary" @click="insertServer">发布</Button>
        </FormItem>
      </div>
    </Form>

    <Table
      border
      size="small"
      :columns="columnsPutIn"
      :data="dataPutIn"
      ref="selection"
      @on-select="handleSelectRow"
      @on-select-cancel="handleCancelRow"
      @on-select-all="handleSelectRowAll"
      @on-select-all-cancel="handleCancelRowAll"
    >
      <template slot="path" slot-scope="{row}">
        <a href="#">{{row.dataPath}}</a>
      </template>
      <template slot="status" slot-scope="{row}">
        <div href="#"  :style="`color:${row.status==='0'?'#2d8cf0':'#FF7421'}`">{{row.statusName}}</div>
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
import { getSJListPage } from "@/api/dataManage/overview";
export default {
  name: "Home",
  data() {
    return {
      selectedRowIds: [],
      statusList: [
        { name: "已发布", id: "0" },
        { name: "未发布", id: "1" }
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
          title: "状态",
          slot: "status",
          align: "center",
          width: remToPx(20)
        },
        {
          title: "数据路径",
          slot: "path",
          align: "center"
        }
      ],
      dataPutIn: [],
      page: {
        current: 1,
        total: 0,
        pageSize: 10
      }
    };
  },
  computed: {},
  created() {
    this.getSJListPage();
  },
  methods: {
    returnTo() {
      this.$router.push("/data/service");
    },
    //切换页数
    changePage(index) {
      this.page.current = index;
      this.getSJListPage();
    },
    //获取查询列表
    getSJListPage() {
      getSJListPage({
        createdBy: "", //this.formInline.uploader,
        dataPath: "", //this.formInline.path.join("/")
        dataType: "", //this.formInline.type,
        endTime: "", //this.formInline.date[1],
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        startTime: "" //this.formInline.date[0]
      }).then(res => {
        const { data, code, total } = res.data;
        if (code === 1000) {
          if (data.list.length) {
            //查詢结果不为空
            this.page.total = data.total;
            //赋值dataPutIn
            this.dataPutIn = data.list.map((item, index) => ({
              ...item,
              uploader: item.realName,
              // type: this.typeList.find((it, id) => it.id === item.dataType)
              //   .name,
              time: item.createdTime,
              id: item.pkId,
              statusName: this.statusList.find(it => it.id === item.status).name,
               _disabled: item.status === "0" ? true : false
            }));
          } else {
            // 置空
            this.dataPutIn = [];
          }
          this.selectedRowIds = [];
        }
      });
    },
    insertServer() {
      insertServer({ ids: this.selectedRowIds.join(",") }).then(res => {
        let { data, code } = res.data;
        if (code === 1000) {
          this.getSJListPage();
        }
      });
    },
    // 选择当前行
    handleSelectRow(selection, row) {
      this.selectedRowIds.push(row.id + "");
    },
    // 全选
    handleSelectRowAll(selection) {
      this.selectedRowIds = selection.map((item, index) => item.id);
    },
    // 取消选择当前行
    handleCancelRow(selection, row) {
      for (let i = 0; i < this.selectedRowIds.length; i++) {
        if (this.selectedRowIds[i] === row.id + "") {
          this.selectedRowIds.splice(i, 1);
        }
      }
    },
    // 全选取消
    handleCancelRowAll(selection) {
      this.selectedRowIds = [];
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