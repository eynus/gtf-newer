<template>
  <div>
    <Drawer
        title="新建数据备份"
        v-model="drawer"
        width="550"
        :styles="styles"
        @on-visible-change="visiable"
    >
      <Form :model="formData" :rules="rules" ref="form"  label-position="left" :label-width="100">
        <Row>
          <Col class-name="col-item">
            <FormItem label="备份文件名" prop="backupName">
              <Input v-model.trim="formData.backupName" type="text" placeholder="请填写备份文件名" />
            </FormItem>
          </Col>
          <Col class-name="col-item">
            <FormItem label="备份说明" prop="backupExplain">
              <Input v-model.trim="formData.backupExplain" type="text" placeholder="请填写备份说明" />
            </FormItem>
          </Col>
          <Col class-name="col-item">
            <Row>
              <FormItem label="备份数据表" prop="backupTableNames">
                <Select v-model="formData.backupTableNames" v-show="false"></Select>
                <div>{{ formData.backupTableNames.join(' ')}}</div>
              </FormItem>

            </Row>
          </Col>

        </Row>
      </Form>
      <Form :label-width="0" inline>
        <FormItem style="width: 80%;">
          <Input v-model.trim="tablename" type="text" placeholder="请填写备份数据表"  style="width: 100%;"/>
        </FormItem>
        <FormItem style="width: 15%;">
          <Button @click="addTbname" style="width: 100%;">添加</Button>
        </FormItem>
      </Form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" type="primary" @click="onSubmit">提交</Button>
        <Button @click="resetForm">重置</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
  import { dbExecute } from '@/api/systemManage/user'
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
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        formData: {
          backupTableNames: []
        },
        tablename: '',
        rules: {
          backupName: [
            { required: true, message: '请填写备份文件名！', trigger: 'blur' }
          ],
          backupExplain: [
            { required: true, message: '请填写备份说明！', trigger: 'blur' }
          ],
          backupTableNames: [
            { required: true, type: 'array', message: '请填写表名称！', trigger: 'change' }
          ],
        }
      }
    },
    methods: {
      addTbname() {
        this.formData.backupTableNames.push(this.tablename)
        this.tablename = ''
      },
      insert() {
        this.drawer = true
      },
      visiable() {
        // 修改不保存状态，新建保存状态
        if (!this.drawer && this.type === 'e') {
          this.resetForm()
        }
      },
      resetForm() {
        this.$refs['form'].resetFields()
        this.formData = {
          backupTableNames: [],
          backupName: '',
          backupExplain: ''
        }
        this.tablename = ''
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let param = {
              ...this.formData
            }
            dbExecute(param).then(res => {
              if (res.data.code === 1000) {
                this.$Message.success("数据备份成功！")
                this.$emit('close')
                this.drawer = false
              } else {
                this.$Message.error(res.data.message)
              }
            })
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
