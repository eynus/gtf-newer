<template>
  <Drawer class="drawer" v-bind="$attrs" v-on="$listeners"
          :width="width">
    <slot></slot>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" type="primary" @click="ok">提交</Button>
      <Button @click="cancel">重置</Button>
    </div>
  </Drawer>
</template>

<script>
  const size = [
    {
      label: 'max',
      value: 1000,
    }, {
      label: 'plus',
      value: 800,
    }, {
      label: 'normal',
      value: 600,
    }, {
      label: 'mini',
      value: 1000,
    }
  ]
  export default {
    name: "GDrawer",
    props: {
      size: String,
    },
    data() {
      return {
        width: 600,
      }
    },
    methods: {
      ok() {
        this.$emit('ok')
      },
      cancel() {
        this.$emit('cancel')
      },
      sizeChange() {
        let target = size.find(item => item.label === this.size)
        if (!target) {
          console.error('.....')
          return
        }
        this.width = target.value
      }
    },
    mounted() {
      this.sizeChange()
    }
  }
</script>

<style lang="scss" scoped>
.drawer {
  .drawer-footer {

  }
}
</style>
