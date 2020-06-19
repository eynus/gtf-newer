<template>
  <div class="h100">
    <Row style="height:100%">
      <Col>
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
              <Col :md="4" :xl="4" :xxl="4" class="form-col">
                <FormItem label="角色名：">
                  <Input v-model.trim="formInline.roleName" placeholder="请输入角色名" clearable />
                </FormItem>
              </Col>
              <Col :md="4" :xl="4" :xxl="4" class="form-col">
                <FormItem label="备注：">
                  <Input v-model.trim="formInline.roleRemarks" placeholder="请输入备注" clearable />
                </FormItem>
              </Col>
              <Col span="2" style="float: right;">
                <FormItem :label-width="remToPx(2)">
                  <Button type="primary" class="smzx-search-btn" @click="onSearch">查询</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Button v-auth="['page_4_2_1']" type="primary" @click="insert" class="btn-margin">新建</Button>
          <Button v-auth="['page_4_2_2']" type="primary" @click="edit" class="btn-margin">修改</Button>
          <Button v-auth="['page_4_2_3']" type="primary" @click="del" class="btn-margin">删除</Button>
          <Button v-auth="['page_4_2_4']" type="primary" @click="allot" class="btn-margin">权限分配</Button>
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
      </Col>
    </Row>
    <!--    角色编辑-->
    <uedit ref="uedit" :roles="roles" @close="getList"></uedit>
    <!--    角色编辑-->
    <!-- 权限分配 -->
    <allot ref="allot" @close="getList"></allot>
    <!-- 权限分配 -->
  </div>
</template>
<script>
  import { remToPx } from "@/utils/common";
  import { roleList, roleDel } from "@/api/systemManage/user";
  import edit from './edit'
  import allot from './allot'
  import MyDelete from '../../../components/delete'
  import { nullStr } from '../../../utils/common'
  export default {
    name: 'role',
    components: {
      uedit: edit,
      allot,
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
            title: "角色名",
            key: "roleName",
            align: "center",
            width: remToPx(18),
            tooltip: true,
            sortable: true
          },
          {
            title: "备注",
            key: "roleRemarks",
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
        page: {
          current: 1,
          total: 0,
          pageSize: 10
        },
        formInline: {
          roleName: "",
          roleRemarks: "",
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
      allot() {
        let msg = this.msg('操作')
        if (msg) {
          this.$Message.warning(msg)
        } else {
          this.$refs.allot.open(this.selections)
        }
      },
      confirmDel() {
        roleDel({pkId: this.selections[0].pkId}).then(res => {
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
          pageNum: current,
          pageSize: pageSize,
          queryTerms: {
            ...this.formInline
          }
        }
        roleList(param).then(res => {
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
