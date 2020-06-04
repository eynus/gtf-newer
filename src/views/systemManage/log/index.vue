<template>
  <div class="h100">
    <Row style="height:100%">
      <i-col>
        <div class="pd">
          <div class="module-head">
            <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />
            <span class="ml">服务检索</span>
          </div>
          <Form
              v-if="log === 'log'"
              ref="formInline"
              :model="formInline"
              inline
              style="margin-top:.75rem"
              class="search-box smzx-search-box"
              label-position="left"
              :label-width="remToPx(6.25)"
              width="100%"
          >
            <Row>
              <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                <FormItem label="登录IP：" style="margin-right: 30px;">
                  <Input v-model.trim="formInline.loginIp" placeholder="请输入登录IP" clearable />
                </FormItem>
              </i-col>
              <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                <FormItem label="登录人姓名：">
                  <Input v-model.trim="formInline.loginRealName" placeholder="请输入登录人姓名" clearable />
                </FormItem>
              </i-col>
              <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                <FormItem label="登录设备：" style="width: 100%;">
                  <Select v-model="formInline.loginType" placeholder="请选择登录设备" clearable >
                    <Option v-for="item in logType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col :md="5" :xl="5" :xxl="5" class="form-col">
                <FormItem label="登录时间：">
                  <DatePicker v-model="date_" :value="formInline.date_" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="请选择登录时间范围"></DatePicker>
                </FormItem>
              </i-col>
              <i-col span="2" style="float: right;">
                <FormItem :label-width="remToPx(2)">
                  <Button type="primary" class="smzx-search-btn" @click="onSearch">查询</Button>
                </FormItem>
              </i-col>
            </Row>
          </Form>
          <Form
              v-else
              ref="formInline1"
              :model="formInline1"
              inline
              style="margin-top:.75rem"
              class="search-box smzx-search-box"
              label-position="left"
              :label-width="remToPx(6.25)"
              width="100%"
          >
            <Row>
              <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                <FormItem label="操作IP：">
                  <Input v-model.trim="formInline1.operationIp" placeholder="操作IP" clearable />
                </FormItem>
              </i-col>
              <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                <FormItem label="操作人：">
                  <Input v-model.trim="formInline1.operationUserRealName" placeholder="请输入操作人姓名" clearable />
                </FormItem>
              </i-col>
              <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                <FormItem label="操作类型：" style="width: 100%;">
                  <Select v-model="formInline1.operationType" placeholder="请选择操作类型" clearable >
                    <Option v-for="item in logOpt" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="2" style="float: right;">
                <FormItem :label-width="remToPx(2)">
                  <Button type="primary" class="smzx-search-btn" @click="onSearch">查询</Button>
                </FormItem>
              </i-col>
            </Row>
          </Form>
          <Row>
            <Col style="padding-bottom: 5px;">
              <RadioGroup v-model="log" @on-change="logChange">
                <Radio label="log">登录日志</Radio>
                <Radio label="opt">操作日志</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <div class="mt">
            <Table
                v-if="log === 'log'"
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
            <Table
                v-else
                :loading="tableLoading"
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
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
  import { remToPx } from "@/utils/common";
  import { lnLogList, optLogList } from "@/api/systemManage/user";
  import { logType, logOpt } from '../../../filters/system'
  import { nullStr } from '../../../utils/common'
  export default {
    name: 'log',
    data() {
      return {
        buttonSize: "large",
        tableLoading: false,
        log: 'log',
        columns: [
          {
            type: 'index',
            width: remToPx(5),
            align: 'center'
          },
          {
            title: "登陆人姓名",
            key: "loginRealName",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
          },
          {
            title: "登录IP",
            key: "loginIp",
            align: "center",
            tooltip: true,
            sortable: true
          },
          {
            title: "登录设备",
            key: "loginType",
            align: "center",
            tooltip: true,
            sortable: true,
            render: (h, params) => {
              return h('div', logType.handler(params.row.loginType))
            }
          },
          {
            title: "登录时间",
            key: "loginTime",
            align: "center",
            tooltip: true,
            sortable: true
          },
          {
            title: "创建时间",
            key: "createDate",
            align: "center",
            tooltip: true,
            sortable: true
          },
          {
            title: "更新时间",
            key: "updateDate",
            align: "center",
            tooltip: true,
            sortable: true
          }
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
            width: remToPx(18),
            tooltip: true,
            sortable: true
          }, {
            title: "操作地址",
            key: "operationUrl",
            align: "center",
            tooltip: true,
            sortable: true
          }, {
            title: "操作人",
            key: "operationUserRealName",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
          }, {
            title: "操作模块",
            key: "operationModular",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
          }, {
            title: "操作方法",
            key: "operationMethod",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
          },  {
            title: "操作类型",
            key: "operationType",
            align: "center",
            width: remToPx(8),
            tooltip: true,
            sortable: true,
            render: (h, params) => {
              return h('div', logOpt.handler(params.row.operationType))
            }
          }, {
            title: "耗时（毫秒）",
            key: "operationDuration",
            align: "center",
            width: remToPx(9),
            tooltip: true,
            sortable: true
          }, {
            title: "操作时间",
            key: "operationDate",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
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
          operationIp: null,
          operationType: null,
          operationUserRealName: null
        },
        date_: null,
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
      init() {
        this.logChange('log')
      },
      onSearch() {
        if (this.log === 'log') {
          let { date_ } = this
          if (date_.length) {
            this.formInline.loginTimeStr = date_[0]
            this.formInline.loginTimeEnd = date_[1]
          }
        }
        this.formInline = nullStr(this.formInline)
        this.formInline1 = nullStr(this.formInline1)
        this.logChange()
      },
      logChange(val) {
        if (val) {
          this.page.current = 1
        }
        val = this.log
        if (val === 'log') {
          this.getLogList()
        } else {
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
            ...this.formInline1
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
