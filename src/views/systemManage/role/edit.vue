<template>
  <div>
    <Drawer
        :title="title"
        v-model="drawer"
        width="550"
        :styles="styles"
        @on-visible-change="visiable"
    >
      <Form :model="formData" :rules="rules" ref="form"  label-position="left" :label-width="100">
        <Row>
          <Col class-name="col-item">
            <FormItem label="角色名称" prop="roleName">
              <Input v-model.trim="formData.roleName" type="text" placeholder="请填写角色名称" />
            </FormItem>
          </Col>
          <Col class-name="col-item">
            <FormItem label="备注" prop="roleRemarks">
              <Input v-model.trim="formData.roleRemarks" type="text" placeholder="请填写备注" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" type="primary" @click="onSubmit">提交</Button>
        <Button @click="resetForm">重置</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
  import { roleInsert, roleEdit } from '@/api/systemManage/user'
  export default {
    name: 'RoleEdit',
    props: {
      roles: Array,
      default() {
        return []
      }
    },
    data () {
      return {
        drawer: false,
        type: 'i',
        title: '',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        formData: {

        },
        rules: {
          roleName: [
            { required: true, message: '请填写角色名称！', trigger: 'blur' }
          ],
          roleRemarks: [
            { required: true, message: '请填写角色备注！', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      insert() {
        this.title = '新建角色'
        this.type = 'i'
        this.drawer = true
      },
      edit(selection) {
        this.title = '修改角色'
        this.type = 'e'
        this.drawer = true
        this.formData = {...selection[0]}
      },
      visiable() {
        // 修改不保存状态，新建保存状态
        if (!this.drawer && this.type === 'e') {
          this.resetForm()
        }
      },
      resetForm() {
        this.$refs['form'].resetFields()
        this.formData = {}
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let param = {
              roleName: this.formData.roleName,
              roleRemarks: this.formData.roleRemarks
            }
            if (this.type === 'i') {
              roleInsert(param).then(res => {
                if (res.data.code === 1000) {
                  this.$Message.success("添加成功！")
                  this.drawer = false
                  this.$emit('close')
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            } else {
              param['pkId'] = this.formData.pkId
              roleEdit(param).then(res => {
                if (res.data.code === 1000) {
                  this.$Message.success("修改成功！")
                  this.drawer = false
                  this.$emit('close')
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            }
          }
        })
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
