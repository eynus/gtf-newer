<template>
  <div class="h100 bg-white position-r">
    <div ref="opt">
      <div class="g-button-wrapper">
        <button v-auth="['page_4_4_1']" @click="insert" class="g-button">
          <Icon :type="$btn.create" />
          <span> 新建</span>
        </button>
      </div>
    </div>
    <div class="pd">
      <Table
          :loading="tableLoading"
          :height="tbhopt"
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
    </div>
    <Page
        class="pagination"
        :total="page.total"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        show-total
        show-sizer
        show-elevator
        :current="page.current"
        :page-size="page.pageSize"
    ></Page>
    <!--    新建备份-->
    <edit ref="edit" :roles="roles" @close="getList"></edit>
    <!--    新建备份-->
    <!--    恢复备份-->
    <recover ref="recover" @close="getList"></recover>
    <!--    恢复备份-->
  </div>
</template>
<script>
  import Breadcrumb from '@/components/breadcrumb'
  import { remToPx } from "@/utils/common";
  import { dbList } from "@/api/systemManage/user";
  import edit from './edit'
  import recover from './recover'
  import { dbback, dbbackModule } from '../../../filters/system'
  import { nullStr } from '../../../utils/common'
  import { ivtable } from '@/mixin/table'
  export default {
    name: 'database',
    components: {
      Breadcrumb,
      edit,
      recover
    },
    mixins: [ivtable],
    data() {
      return {
        tableLoading: false,
        delModalFlag: false,
        selections: [],
        columns: [
          {
            title: "选中",
            type: "selection",
            key: "pkId",
            align: "center",
            width: remToPx(5),
            fixed: 'left',
          },
          {
            title: '序号',
            type: 'index',
            width: remToPx(5),
            align: 'center',
            fixed: 'left'
          },
          {
            title: "备份文件名称",
            key: "backupName",
            align: "center",
            width: remToPx(18),
            fixed: 'left',
          },
          {
            title: "备份模块",
            key: "backupModule",
            align: "center",
            width: remToPx(18),
            render: (h, params) => {
              return h('div', dbbackModule.handler(params.row.backupModule))
            }
          },
          {
            title: "备份类型 ",
            key: "backupType",
            align: "center",
            width: remToPx(18),
            render: (h, params) => {
              return h('div', dbback.handler(params.row.backupType))
            }
          },
          {
            title: "备份说明 ",
            key: "backupExplain",
            align: "center",
            width: remToPx(18),
          },
          {
            title: "备份时间 ",
            key: "backupTime",
            align: "center",
            minWidth: remToPx(18),
            tooltip: true,
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
          ...this.formInline,
          pageNum: current,
          pageSize: pageSize
        }
        dbList(param).then(res => {
          let { data, code } = res.data
          if (code === 1000) {
            this.datas = data.records
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
