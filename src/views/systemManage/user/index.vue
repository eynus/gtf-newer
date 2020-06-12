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
                  <FormItem label="用户名：">
                    <Input v-model.trim="formInline.userName" placeholder="请输入用户名" clearable />
                  </FormItem>
                </i-col>
                <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                  <FormItem label="角色名：">
                    <Input v-model.trim="formInline.roleName" placeholder="请输入角色名" clearable />
                  </FormItem>
                </i-col>
                <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                  <FormItem label="真实姓名：">
                    <Input v-model.trim="formInline.realName" placeholder="请输入真实姓名" clearable />
                  </FormItem>
                </i-col>
                <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                  <FormItem label="电话号码：">
                    <Input v-model.trim="formInline.userPhone" placeholder="请输入电话号码" clearable />
                  </FormItem>
                </i-col>
                <i-col span="2" style="float: right;">
                  <FormItem :label-width="remToPx(2)" >
                    <Button type="primary" class="smzx-search-btn" @click="onSearch">查询</Button>
                  </FormItem>
                </i-col>
              </Row>
            <Row>
              <i-col :md="4" :xl="4" :xxl="4" class="form-col">
                <FormItem label="邮箱：">
                  <Input v-model.trim="formInline.userEmail" placeholder="请输入邮箱" clearable />
                </FormItem>
              </i-col>
            </Row>
          </Form>
          <Button v-auth="['page_4_1_1']" type="primary" @click="insert" class="btn-margin">新建</Button>
          <Button v-auth="['page_4_1_2']" type="primary" @click="edit" class="btn-margin">修改</Button>
          <Button v-auth="['page_4_1_3']" type="primary" @click="del" class="btn-margin">删除</Button>
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
              <template slot="status" slot-scope="{row}">
                <div href="#" :style="`color:${row.serviceStatus==='0'?'#2d8cf0':'#f00'}`">{{row.status}}</div>
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
          <my-delete :show="delModalFlag" @ok="confirmDel" @cancel="delModalFlag=false"></my-delete>
        </div>
      </i-col>
    </Row>
<!--    用户信息编辑-->
    <uedit ref="uedit" :roles="roles" :areas="areas" @close="getList"></uedit>
<!--    用户信息编辑-->
  </div>
</template>
<script>
  import { remToPx } from "@/utils/common";
  import { userList, roles, userDel } from "@/api/systemManage/user";
  import { areaList } from '@/api/common'
  import edit from './edit'
  import MyDelete from '../../../components/delete'
  import { nullStr } from "../../../utils/common";
  export default {
    name: 'user',
    components: {
      uedit: edit,
      MyDelete
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
            title: '序号',
            type: 'index',
            width: remToPx(5),
            align: 'center'
          },
          {
            title: "用户名",
            key: "userName",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
          },
          {
            title: "角色名",
            key: "roleName",
            align: "center",
            width: remToPx(10),
            tooltip: true,
            sortable: true
          },
          {
            title: "真实姓名",
            key: "realName",
            align: "center",
            width: remToPx(10),
            tooltip: true,
            sortable: true
          },
          {
            title: "所属行政区划",
            key: "placeName",
            align: "center",
            width: remToPx(11),
            tooltip: true,
            sortable: true
          },
          {
            title: "电话号码",
            key: "userPhone",
            align: "center",
            width: remToPx(16),
            tooltip: true,
            sortable: true
          },
          {
            title: "邮箱",
            key: "userEmail",
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
        datas: [],
        roles: [],
        areas: [],
        page: {
          current: 1,
          total: 0,
          pageSize: 10
        },
        formInline: {
          userEmail: null,
          roleName: null,
          userName: null,
          userPhone: null,
          realName: null,
        }
      };
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getList()
        this.getRole()
        this.getArea()
      },
      onSearch() {
        this.formInline = nullStr(this.formInline)
        this.getList()
      },
      insert() {
        this.$refs.uedit.insert(this.selections)
      },
      edit() {
        let msg = this.msg('修改')
        if (msg) {
          this.$Message.warning(msg)
        } else {
          this.$refs.uedit.edit(this.selections)
        }
      },
      del() {
        let msg = this.msg('删除')
        if (msg) {
          this.$Message.warning(msg)
        } else {
          this.delModalFlag = true
        }
      },
      confirmDel() {
        userDel({pkId: this.selections[0].pkId}).then(res => {
          if (res.data.code === 1000) {
            this.$Message.success('删除成功！')
            this.getList()
          } else {
            this.$Message.error('删除失败！')
          }
          this.delModalFlag = false
        })
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
      getArea() {
        areaList().then(res => {
          if (res.data.code === 1000) {
            this.areas = res.data.data
          }
        })
      },
      getRole() {
        roles({}).then(res => {
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
          pageNum: current,
          pageSize: pageSize,
          queryTerms: {
            ...this.formInline
          }
        }
        userList(param).then(res => {
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
      handleSelectRow(selection, row) {
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
