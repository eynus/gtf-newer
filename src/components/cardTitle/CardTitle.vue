<template>
  <div class="card-title">
    <Icon v-if="icon" :custom="icon" size="16" color="#fff" />
    <span class="ml">{{title}}</span>
  </div>
</template>
<script>
export default {
  name: "cardtitle",
  components: {},
  props:{
      title:{
          type:String,
          default:'默认标题'
      },
      icon:{
          type:String,
          default:''
      },
      
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.card-title {
  text-align: center;
  background-color: $cardtitle-bg;
  width: 9.25rem;
  font-size: 1rem;
  line-height: 2rem;
  height: 2rem;
  color: #fff;
  // padding: 0 4px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
}
</style>