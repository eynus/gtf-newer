<template>
  <div>
    <Drawer
      title="权限分配"
      v-model="drawer"
      width="550"
      :styles="styles"
      @on-visible-change="resetForm"
  >
    <Form :model="formData" :rules="rules" ref="form"  label-position="left" :label-width="100">
      <Row>
        <Col class-name="col-item">
          <FormItem label="角色名称" prop="roleName">
            <div>{{ roleName }}</div>
          </FormItem>
        </Col>
        <Col class-name="col-item">
          <FormItem label="权限分配" prop="resourcesIds">
            <Input v-model="formData.resourcesIds"  v-show="false" />
            <Tree
                show-checkbox
                multiple
                check-strictly
                children-key="childs"
                :data="resource"
                :render="renderContent"
                @on-check-change="resourceCheck">
            </Tree>
<!--            <a-tree-->
<!--                checkable-->
<!--                checkStrictly-->
<!--                v-model="resourcesIds"-->
<!--                :tree-data="resource"-->
<!--                :replaceFields="treeFields"-->
<!--                @check="resourceCheck"-->
<!--            >-->
<!--            </a-tree>-->
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" type="primary" @click="onSubmit">提交</Button>
      <Button @click="close">关闭</Button>
    </div>
  </Drawer>
  </div>
</template>

<script>
  import { resources, resourceByRid, resourceToUser } from '@/api/systemManage/user'
  const handleData = (data) => {
    let val = []
    data.forEach(item => {
      val.push(item.pkId)
      if (item.childs.length) {
        let result = handleData(item.childs)
        val = val.concat(result)
      }
    })
    return val
  }
  export default {
    name: "allot",
    data() {
      return {
        drawer: false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        roleName: '',
        formData: {
          resourcesIds: '',
          roleId: '',
        },
        rules: {
          resourcesIds: [
            { required: true, message: '请选择角色权限！' }
          ],
        },
        resourcesIds: [],
        realIds: [],
        treeFields: {
          children:'childs',
          title:'resName',
          key:'pkId'
        },
        resource: [], // 资源tree
      }
    },
    methods: {
      open(selection) {
        this.drawer = true
        this.formData.roleId = selection[0].pkId
        this.roleName = selection[0].roleName
        this.getRList()
      },
      close() {
        this.drawer = false
        this.resetForm()
      },
      resetForm() {
        this.$refs['form'].resetFields()
      },
      resourceCheck(v, e) {
        console.log(v)
        if (v.length) {
          this.formData.resourcesIds = 1
          this.resourcesIds = v.map(item => item.pkId)
        } else {
          this.formData.resourcesIds = ''
        }
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let param = {
              resourcesIds: this.resourcesIds,
              roleId: this.formData.roleId
            }
            resourceToUser(param).then(res => {
              if (res.data.code === 1000) {
                this.$Message.success('权限分配成功，退出重新登录后生效！')
                this.drawer = false
                this.$emit('close')
              } else {
                this.$Message.error(res.data.message)
              }
            })
          }
        })
      },
      renderContent (h, { root, node, data }) {
        return h('span', {
          props: {
            label: node.nodeKey
          },
          style: {
            width: '100%'
          }
        }, data.resName)
      },

      getList() {
        resources().then(res => {
          if (res.data.code === 1000) {
            let result = this.handleData(res.data.data)
            this.resource = result
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      getRList() {
        resourceByRid({ pkId: this.formData.roleId}).then(res => {
          if (res.data.code === 1000) {
            let data = res.data.data
            data = data ? handleData(data) : []
            this.resourcesIds = data
            this.formData.resourcesIds = data.length ? 1 : null
            this.getList()
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      handleData(data) {
        data.forEach(item => {
          item['checked'] =  this.resourcesIds.indexOf(item.pkId) !== -1 ? true : false
          if (item.childs.length) {
            item.childs = this.handleData(item.childs)
          }
        })
        return data
      }
    }
  }
</script>

<style scoped lang="scss">
  .drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: center;
    background: #fff;
  }
  .col-item {
    padding: 5px 20px;
  }
</style>
