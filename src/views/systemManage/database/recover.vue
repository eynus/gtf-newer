<template>
  <Modal
      v-model="modal"
      title="恢复备份"
      @on-ok="ok"
      @on-cancel="cancel">
    <p>备份文件名：{{ backupName }}</p>
    <p>备份说明：{{ backupExplain }}</p>
    <div>备份数据表：</div>
    <div>
      <Tag v-for="(item,index) in backupTableNames" :key="index">{{item}}</Tag>
    </div>
  </Modal>
</template>

<script>
  import { dbRecover } from '@/api/systemManage/user'
  export default {
    name: "DbRecover",
    data() {
      return {
        modal: false,
        backupName: '',
        backupExplain: '',
        backupTableNames: [],
        pkId: '',
      }
    },
    methods: {
      open(selection) {
        let { backupName, backupExplain, backupTableNames, pkId } = selection[0]
        this.modal = true
        this.backupName = backupName
        this.backupExplain = backupExplain
        this.backupTableNames = JSON.parse(backupTableNames)
        this.pkId = pkId
      },
      ok() {
        let { backupName, backupExplain, backupTableNames, pkId } = this
        let param = { backupName, backupExplain, backupTableNames, pkId }
        dbRecover(param).then(res => {
          if (res.data.code === 1000) {
            this.$Message.success("数据备份恢复成功！")
            this.drawer = false
            this.$emit('close')
          } else {
            this.$Message.error(res.data.message)
          }
        })
      },
      cancel() {
        this.modal = false
      }
    }
  }
</script>

<style scoped>

</style>
