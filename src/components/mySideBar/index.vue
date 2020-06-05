<template>
  <Menu
    :active-name="activeMenuItem"
    theme="light"
    :width="`100%`"
    style="height:100%;width:100%"
    :class="menuitemClasses"
    @on-select="changeRoute"
  >
    <template v-for="(item,index ) in dataList">
      <MenuItem :name="item.key" class="menu-item mb" :key="`dml_${index}`" v-if="item.show">
        <Icon
          :custom="item.icon"
          :size="remToPx(1.75)"
          :color="activeMenuItem===`${item.key}`?'#3d62f6':'#8391B8'"
        />
        <div>{{item.name}}</div>
      </MenuItem>
    </template>
  </Menu>
</template>
<script>
export default {
  name: "sidebar",
  props: {
    dataList: Array
  },
  watch: {},
  computed: {
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  data() {
    return {
      activeMenuItem: ""
    };
  },
  created() {
      console.log(this.dataList);
      
    this.activeMenuItem = this.$route.name.toLocaleLowerCase();
  },
  methods: {
    changeRoute(data) {
      this.activeMenuItem = data;
      console.log(data, this.$route);

      if (data === "inspection") {
        this.$router.push("/data/inspection/mathBasic?id=1");
      } else {
        this.$router.push("/" + this.$route.path.split("/")[1] + "/" + data);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.menu-item {
  & + .menu-item {
    margin-top: 1.5rem;
  }
  text-align: center;
  color: #8391b8;
  padding: 10px 0;
  font-size: 0.875rem;
  div {
    margin-top: 6px;
  }
}
</style>
