<template>
  <div>
    <Modal
      v-model="visible"
      class-name="custom-modal"
      @on-ok="ok"
      @on-cancel="cancel"
      :styles="{top: top+'px'}"
      footer-hide
      :mask="masktag"
      :width="customWidth"
      :transfer="true"
      :mask-closable="maskClosable"
      :transition-names="transitionNames"
    >
      <h2 class="del-modal-text text-center">确认{{title}}？</h2>
      <div class="flex flex-center mt-lg">
        <Button class="del-modal-btn" @click="cancel">取消</Button>
        <Button class="del-modal-btn" type="primary" @click="ok">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

export default {
  name: 'myModal',
  components: {},
  data () {
    return {
      visible: this.show,
      footerhide: this.footerHide
    }
  },
  props: {
    masktag: {
      type: Boolean,
      default: true
    },
    show: Boolean,
    footerHide: {
      type: Boolean,
      default: true
    },
    customWidth: {
      type: Number,
      default: 300
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    top: {
      type: Number,
      default: 250
    },
    transitionNames: {
      type: Array,
      default: () => {
        return ['ease', 'fade']
      }
    },
    title: {
      type: String,
      default: '删除'
    }
  },
  watch: {
    show (newVal, oldVal) {
      this.visible = newVal
      this.$emit('showModel', this.visible)
    },
    customWidth (newVal, oldVal) {}
  },
  computed: {},
  mounted () {},
  methods: {
    ok () {
      this.$emit('ok')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
  .custom-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0 !important;
    }
  }
  .ivu-modal-body {
    .del-modal-text {
      margin: 20px 0;
      font-size: 20px;
    }
  }
  .del-modal-btn.ivu-btn {
    width: 80px;
    font-size: 16px;
    &:nth-of-type(1) {
      margin-right: 40px;
    }
  }
</style>