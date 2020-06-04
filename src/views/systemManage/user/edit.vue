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
            <FormItem label="用户名" prop="userName">
              <Input v-model.trim="formData.userName" placeholder="请填写真实姓名" />
            </FormItem>
          </Col>
          <Col class-name="col-item">
            <FormItem label="真实姓名" prop="realName">
              <Input v-model.trim="formData.realName" placeholder="请填写用户名" />
            </FormItem>
          </Col>
          <Col class-name="col-item">
            <FormItem label="角色" prop="roleId">
              <Select v-model="formData.roleId" placeholder="请选择角色">
                <Option v-for="item in roles"
                        :key="item.pkId"
                        :value="item.pkId"
                >{{ item.roleName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col class-name="col-item" v-show="false">
            <FormItem label="密码" prop="password">
              <Input v-model.trim="formData.password" type="password" placeholder="请输入密码" />
            </FormItem>
          </Col>
          <Col class-name="col-item">
            <FormItem label="电话号码" prop="userPhone">
              <Input v-model.trim="formData.userPhone" placeholder="请填写电话号码" />
            </FormItem>
          </Col>
          <Col class-name="col-item">
            <FormItem label="邮箱" prop="userEmail">
              <Input v-model.trim="formData.userEmail" placeholder="请填写邮箱" />
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
  import { userInsert, userEdit, userDetail } from '@/api/systemManage/user'
  export default {
    name: 'UserEdit',
    props: {
      roles: Array,
      default() {
        return []
      }
    },
    data () {
      const validatePhone = (rule, value, callback) => {
        if (/^1[0-9]{10}$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确格式的手机号码'));
        }
      }

      const validateEmail = (rule, value, callback) => {
        if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确格式的邮箱'));
        }
      }

      const validateZh = (rule, value, callback) => {
        if (/^[\u4E00-\u9FA5]+$/.test(value)) {
          callback()
        } else {
          callback(new Error('真实姓名需要为中文汉字'))
        }
      }

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
          userName: '',
          realName: '',
          userPhone: '',
          userEmail: '',
          roleId: '',
          password: ''
        },
        rules: {
          userName: [
            { required: true, message: '请填写用户名！', trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '请填写真实姓名！', trigger: 'blur' },
            { validator: validateZh, message: '真实姓名必须为中文汉字', trigger: 'blur'}
          ],
          userPhone: [
            { required: true, message: '请填写电话号码！', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          userEmail: [
            { required: true, message: '请填写邮箱！', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          roleId: [
            { required: true, type: 'number', message: '请选择角色！', trigger: 'change' }
          ],
          // password: [
          //   { required: true, message: '请填写密码！', trigger: 'blur' }
          // ]
        }
      }
    },
    methods: {
      insert() {
        this.title = '新建用户'
        this.type = 'i'
        this.drawer = true
        this.formData['password'] = '000000'
      },
      edit(selection) {
        this.title = '修改用户'
        this.drawer = true
        this.type = 'e'
        this.$refs['form'].resetFields()
        this.formData = {
          ...selection[0]
        }
        this.formData.password = '000000'
        this.formData.roleId = Number(this.formData.roleId)
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
            let { userName, realName, userPhone, userEmail, roleId } = this.formData

            let param  = { userName, realName, userPhone, userEmail, roleId, password: '000000' }
            if (this.type === 'i') {
              userInsert(param).then(res => {
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
              userEdit(param).then(res => {
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
