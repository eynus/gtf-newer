<template>
  <div class="h100 bg-white">
    <Row style="height:100%">
      <Col>
        <div ref="opt">
          <div class="g-button-wrapper">
            <button v-auth="['page_4_1_1']" @click="insert" class="g-button">
              <Icon :type="$btn.create" />
              <span> 新建</span>
            </button>
            <button v-auth="['page_4_1_2']" @click="edit" class="g-button">
              <Icon :type="$btn.edit" />
              <span> 修改</span>
            </button>
            <button v-auth="['page_4_1_3']" @click="del" class="g-button">
              <Icon :type="$btn.del" />
              <span> 删除</span>
            </button>
            <button v-auth="['page_4_2_4']" @click="allot" class="g-button">
              <Icon type="ios-hand-outline" />
              <span> 权限分配</span>
            </button>
          </div>
          <Query :formArr="queryForm" @query="onSearch"></Query>
          <my-delete :show="delModalFlag" @ok="confirmDel" @cancel="delModalFlag=false"></my-delete>
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
            <template slot="status" slot-scope="{row}">
              <div href="#" :style="`color:${row.serviceStatus==='0'?'#2d8cf0':'#f00'}`">{{row.status}}</div>
            </template>
          </Table>
        </div>
      </Col>
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
  import Breadcrumb from '@/components/breadcrumb'
  import edit from './edit'
  import allot from './allot'
  import MyDelete from '../../../components/delete'
  import { nullStr } from '../../../utils/common'
  import { ivtable } from "@/mixin/table"

  export default {
    name: 'role',
    components: {
      Breadcrumb,
      uedit: edit,
      allot,
      MyDelete
    },
    mixins: [ivtable],
    data() {
      return {
        buttonSize: "large",
        tableLoading: false,
        delModalFlag: false,
        tbheight: window.innerHeight - 300,
        selections: [],
        queryForm: [
         {
            type: 1,
            field: 'roleName',
            title: '角色名',
          }, {
            type: 1,
            field: 'roleRemarks',
            title: '备注',
          }
        ],

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
          },
          {
            title: "备注",
            key: "roleRemarks",
            align: "center",
          },
          {
            title: "创建时间",
            key: "createDate",
            align: "center",
          },
          {
            title: "更新时间",
            key: "updateDate",
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
      onSearch(data) {
        this.formInline = nullStr(data)
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
      changePageSize(val) {
        this.page.pageSize = val
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
