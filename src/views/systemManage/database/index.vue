<template>
  <div class="h100">
    <Row style="height:100%">
      <i-col>
        <div class="pd">
<!--          <div class="module-head">-->
<!--            <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />-->
<!--            <span class="ml">服务检索</span>-->
<!--          </div>-->
<!--          <Form-->
<!--              ref="formInline"-->
<!--              :model="formInline"-->
<!--              inline-->
<!--              style="margin-top:.75rem"-->
<!--              class="search-box smzx-search-box"-->
<!--              label-position="right"-->
<!--              :label-width="remToPx(6.25)"-->
<!--              width="100%"-->
<!--          >-->
<!--            <Row>-->
<!--              <i-col :md="4" :xl="4" :xxl="4">-->
<!--                <FormItem label="备份文件名称 ：">-->
<!--                  <Input v-model.trim="formInline.backupName" placeholder="请输入角色名" clearable />-->
<!--                </FormItem>-->
<!--              </i-col>-->
<!--              <i-col :md="4" :xl="4" :xxl="4">-->
<!--                <FormItem label="备份说明：">-->
<!--                  <Input v-model.trim="formInline.backupExplain" placeholder="请输入备注" clearable />-->
<!--                </FormItem>-->
<!--              </i-col>-->
<!--              <i-col span="2">-->
<!--                <FormItem :label-width="remToPx(2)">-->
<!--                  <Button type="primary" class="smzx-search-btn" @click="onSearch">查询</Button>-->
<!--                </FormItem>-->
<!--              </i-col>-->
<!--            </Row>-->
<!--          </Form>-->
          <Button type="primary" @click="insert" class="btn-margin">新建备份</Button>
          <Button type="primary" @click="recover" class="btn-margin">恢复备份</Button>
          <div class="mt">
            <Table
                :loading="tableLoading"
                border
                stripe
                size="small"
                :columns="columns"
                :data="datas"
                ref="selection"
                @on-select="handleSelectRow"
                @on-select-cancel="handleCancelRow"
                @on-select-all="handleSelectRowAll"
                @on-select-all-cancel="handleCancelRowAll"
            >
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
<!--          <my-delete :show="delModalFlag" @ok="confirmDel" @cancel="delModalFlag=false"></my-delete>-->
        </div>
      </i-col>
    </Row>
    <!--    新建备份-->
    <edit ref="edit" :roles="roles" @close="getList"></edit>
    <!--    新建备份-->
    <!--    恢复备份-->
    <recover ref="recover" @close="getList"></recover>
    <!--    恢复备份-->
  </div>
</template>
<script>
  import { remToPx } from "@/utils/common";
  import { dbList } from "@/api/systemManage/user";
  import edit from './edit'
  import recover from './recover'
  import { dbback } from '../../../filters/system'
  import { nullStr } from '../../../utils/common'
  export default {
    name: 'database',
    components: {
      edit,
      recover
    },
    data() {
      return {
        buttonSize: "large",
        tableLoading: false,
        delModalFlag: false,
        selections: [],
        columns: [
          {
            title: "选中",
            type: "selection",
            key: "pkId",
            align: "center",
            width: remToPx(5)
          },
          {
            type: 'index',
            width: remToPx(5),
            align: 'center'
          },
          {
            title: "备份文件名称",
            key: "backupName",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
          },
          {
            title: "备份说明 ",
            key: "backupExplain",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
          },
          {
            title: "备份表名 ",
            key: "backupTableNames",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
          },
          {
            title: "备份类型 ",
            key: "backupIsWhole",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true,
            render: (h, params) => {
              return h('div', dbback.handler(params.row.backupIsWhole))
            }
          },
          {
            title: "备份时间 ",
            key: "backupTime",
            align: "center",
            tooltip: true,
            sortable: true
          },
        ],
        datas: [],
        roles: [],
        page: {
          current: 1,
          total: 0,
          pageSize: 10
        },
        formInline: {}
      };
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getList()
      },
      onSearch() {
        this.formInline = nullStr(this.formInline)
        this.getList()
      },
      insert() {
        this.$refs.edit.insert()
      },
      recover() {
        let msg = this.msg('恢复')
        if (msg) {
          this.$Message.warning(msg)
        } else {
          this.$refs.recover.open(this.selections)
        }
      },
      msg(tip = '操作') {
        let msg = null
        if (!this.selections.length) {
          msg = '请选择一条数据！'
        }
        if (this.selections.length > 1) {
          msg = '每次只能'+ tip +'一条数据！'
        }
        return msg
      },
      getRole() {
        roleList({}).then(res => {
          let { data, code } = res.data
          if (code === 1000) {
            this.roles = data
          }
        })
      },
      getList() {
        this.selections = []
        this.tableLoading = true
        let { current, pageSize } = this.page
        let param = {
          ...this.formInline
        }
        dbList(param).then(res => {
          let { data, code } = res.data
          if (code === 1000) {
            this.datas = data
            this.page.total = data.total
          }
          this.tableLoading = false
        })
      },
      //切换页数
      changePage(index) {
        this.page.current = index
        this.getList()
      },
      // 选择某一行
      handleSelectRow(selection) {
        this.selections = selection
      },
      handleSelectRowAll(selection) {
        this.selections = selection
      },
      handleCancelRow(selection, row) {
        this.selections = selection
      },
      handleCancelRowAll(selection) {
        this.selections = []
      }
    }
  };
</script>
<style lang="scss" scoped>
  .btn-margin {
    margin-right: 1rem;
  }
  .form-col {
    margin-right: 30px;
  }
</style>
