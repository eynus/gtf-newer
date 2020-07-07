<template>
  <div class="selBtnBox">
    <div class="selBtn">
      <span class="clickBtn">
        <slot></slot>：
        {{ checked }}
      </span>
      <Icon type="ios-arrow-down" />
    </div>
    <ul class="option" @click="handleLiClick" v-if="options.length">
      <li v-for="item in options" :key="item.value">{{item.label}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'selbtn',
    props: {
      options: Array,
      check: String,
    },
    data () {
      return {
        checked: ''
      }
    },
    methods: {
      handleLiClick(e) {
        console.log(e)
        if (e.target.nodeName.toLowerCase() === 'li') {
          let label = e.target.innerHTML
          let option = this.options.find(item => item.label === label)
          this.checked = label
          this.$emit('trigger-change', option.value)
        }
      }
    },
    mounted() {
      if (this.check) {
        this.checked = this.options.find(item => item.value === this.check).label
      }
    }
  }
</script>

<style scoped lang="scss">
  .selBtnBox{
    display: inline-block;
    position: relative;
    .option{
      position: absolute;
      z-index: 1003;
      background: #fff;
      border: 1px solid #dedede;
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
      width: 90%;
      padding: 5px 0;
      color: #a1a5b8;
      left: 5%;
      display: none;
      li{
        padding: 0 5px;
        cursor: pointer;
        line-height: 25px;
        &:hover {
          color: #3c8fff;
          background: #cfe3ff;
        }
      }
    }
    &:hover{
      .option{
        display: block;
      }
    }
  }
  .selBtn{
    display: inline-block;
    .clickBtn{
      font-size: 14px;
      line-height: 14px;
      padding: 8px 4px 8px 8px;
      margin-left: 5px;
      border: 0;
      color: #a1a5b8;
      background: inherit;
      box-sizing: border-box;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    }
    .sel{
      font-size: 14px;
      padding: 8px 2px 8px 2px;
      border-radius: 2px;
      line-height: 14px;
      cursor: pointer;
      margin-left: 1px;
    }
    &:hover {
      .clickBtn{
        color: #3c8fff;
        background: #cfe3ff;
      }
      .sel{
        color: #3c8fff;
        background: #cfe3ff;
      }
    }
  }
</style>
