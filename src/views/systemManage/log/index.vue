<template>
  <div class="h100 bg-white">
    <Row style="height:100%">
      <Col>
        <div ref="opt">
          <div class="g-button-wrapper">
            <selbtn :options="options" check="log" @trigger-change="logChange">日志类型</selbtn>
            <button @click="exportData" class="g-button">
              <Icon :type="$btn.export" />
              <span> 导出</span>
            </button>
          </div>
          <Query ref="query" :formArr="queryForm" @query="onSearch"></Query>
        </div>
        <div class="pd">
          <Table
              v-if="log === 'log'"
              :key="Math.random()"
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
          <Table
              v-else
              :loading="tableLoading"
              :height="tbhopt"
              border
              stripe
              size="small"
              :columns="columns1"
              :data="datas"
              ref="selection"
              @on-select="handleSelectRow"
              @on-select-cancel="handleCancelRow"
              @on-select-all="handleSelectRowAll"
              @on-select-all-cancel="handleCancelRowAll"
          >
          </Table>
        </div>
      </Col>
      <Page
          class="pagination"
          :total="page.total"
          show-total
          show-sizer
          show-elevator
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :current="page.current"
          :page-size="page.pageSize"
      ></Page>
    </Row>
  </div>
</template>
<script>
  import selbtn from '@/components/selbtn'
  import { remToPx, nullStr } from "@/utils/common";
  import { lnLogList, optLogList, elogData, eoptData } from "@/api/systemManage/user";
  import { logType, logOpt } from '../../../filters/system'
  import { ivtable } from "@/mixin/table";
  import Download from "@/utils/download";

  export default {
    name: 'log',
    components: {
      selbtn
    },
    mixins: [ivtable],
    data() {
      return {
        options: [
          {
            label: '登录日志',
            value: 'log'
          },
          {
            label: '操作日志',
            value: 'opt'
          }
        ],
        tableLoading: false,
        log: 'log',
        loginForm: [
          {
            type: 1,
            field: 'loginIp',
            title: '登录IP',
          }, {
            type: 1,
            field: 'loginRealName',
            title: '登录人姓名',
          }, {
            type: 2,
            field: 'loginType',
            title: '登录设备',
            data: logType.value
          }, {
            type: 4,
            field: 'date_',
            title: '登录时间',
          }
        ],
        optForm: [
          {
            type: 1,
            field: 'operationIp',
            title: '操作IP',
          }, {
            type: 1,
            field: 'operationUserRealName',
            title: '操作人',
          }, {
            type: 2,
            field: 'operationType',
            title: '操作类型',
            data: logOpt.value
          }, {
            type: 4,
            field: 'date_1',
            title: '操作时间',
          }
        ],
        queryForm: [

        ],
        columns: [
          {
            title: '序号',
            type: 'index',
            width: remToPx(5),
            align: 'center'
          },
          {
            title: "登录人姓名",
            key: "loginRealName",
            align: "center",
            width: remToPx(18),
          },
          {
            title: "登录IP",
            key: "loginIp",
            align: "center",
          },
          {
            title: "登录设备",
            key: "loginType",
            align: "center",
            render: (h, params) => {
              return h('div', logType.handler(params.row.loginType))
            }
          },
          {
            title: "登录时间",
            key: "loginTime",
            align: "center",
          },
        ],
        columns1: [
          {
            type: 'index',
            width: remToPx(5),
            align: 'center'
          }, {
            title: "操作IP",
            key: "operationIp",
            align: "center",
            width: remToPx(10),
          }, {
            title: "操作人",
            key: "operationUserRealName",
            align: "center",
            width: remToPx(10),
          }, {
            title: "操作地址",
            key: "operationUrl",
            align: "center",
          }, {
            title: "操作模块",
            key: "operationModular",
            align: "center",
            width: remToPx(18),
          }, {
            title: "操作方法",
            key: "operationMethod",
            align: "center",
            width: remToPx(10),
          },  {
            title: "操作类型",
            key: "operationType",
            align: "center",
            width: remToPx(8),
            render: (h, params) => {
              return h('div', logOpt.handler(params.row.operationType))
            }
          }, {
            title: "耗时（毫秒）",
            key: "operationDuration",
            align: "center",
            width: remToPx(10),
          }, {
            title: "操作时间",
            key: "operationDateStr",
            align: "center",
          }
        ],
        datas: [],
        roles: [],
        page: {
          current: 1,
          total: 0,
          pageSize: 10
        },
        formInline: {
          loginIp: null,
          loginRealName: null,
          loginTimeEnd: null,
          loginTimeStr: null,
          loginType: null
        },
        formInline1: {
          date_: null,
          operationIp: null,
          operationType: null,
          operationUserRealName: null,
          operationDateStr: null,
          operationDateEnd: null
        },
        date_: null,
        date_1: null,
      };
    },
    computed: {
      logType() {
        return logType.value
      },
      logOpt() {
        return logOpt.value
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      exportData() {
        const download = new Download()
        if (this.log === 'log') {
          elogData({}).then(res => {
            download.filename = decodeURI(res.headers['content-disposition'].split('=')[1])
            download.xlsx(res.data)
          })
        } else {
          eoptData({}).then(res => {
            download.filename = decodeURI(res.headers['content-disposition'].split('=')[1])
            download.xlsx(res.data)
          })
        }
      },
      init() {
        this.log = 'log'
        this.onSearch()
      },
      onSearch(data = '') {
        this.page.current = 1
        this.formInline = nullStr(data)
        let { date_, date_1 } = this.formInline
        if (this.log === 'log') {
          if (date_ && date_.length) {
            this.formInline.loginTimeStr = date_[0]
            this.formInline.loginTimeEnd = date_[1]
            delete this.formInline.date_
          }
        }
        if (this.log !== 'log') {
          if (date_1 && date_1.length) {
            this.formInline.operationDateStr = date_1[0]
            this.formInline.operationDateEnd = date_1[1]
            delete this.formInline.date_1
          }
        }
        this.logChange()
      },
      logChange(val) {
        if (val) {
          this.log = val
          this.$refs.query.cleardata()
          this.formInline = {}
          this.page.current = 1
        } else {
          val = this.log
        }
        if (val === 'log') {
          this.queryForm = this.loginForm
          this.getLogList()
        } else {
          this.queryForm = this.optForm
          this.getOptList()
        }
      },
      getLogList() {
        this.tableLoading = true
        let { current, pageSize } = this.page
        let param = {
          pageNum: current,
          pageSize: pageSize,
          queryTerms: {
            ...this.formInline
          }
        }
        lnLogList(param).then(res => {
          let { data, code } = res.data
          if (code === 1000) {
            this.datas = data.records
            this.page.total = data.total
          }
          this.tableLoading = false
        })
      },
      getOptList() {
        this.tableLoading = true
        let { current, pageSize } = this.page
        let param = {
          pageNum: current,
          pageSize: pageSize,
          queryTerms: {
            ...this.formInline
          }
        }
        optLogList(param).then(res => {
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
        this.logChange()
      },
      changePageSize(val) {
        this.page.pageSize = val
        this.logChange()
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
