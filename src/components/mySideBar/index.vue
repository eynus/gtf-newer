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
      <MenuItem :name="item.key" class="menu-item mb" :key="`dml_${index}`" v-auth="[item.id]">
        <Icon
          :custom="item.icon"
          :size="remToPx(1.75)"
          :color="activeMenuItem===`${item.key}`?'#0083ff':'#8391B8'"
        />

        <!-- <div
          v-else
        >
          <img :src="activeMenuItem===`${item.key}`?item.iconActiveUrl:item.iconUrl" alt="">
          <div  class="menu-item-filter"
          :style="{background:`url(${item.iconUrl}) no-repeat center`}"></div>
        </div>  -->

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
    this.activeMenuItem = this.$route.path.split("/")[2];
  },
  methods: {
    changeRoute(data) {
      this.activeMenuItem = data;
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
// ::v-deep .ivu-menu-item-selected .menu-item-filter {
//   margin-left: -999px;
//   filter: drop-shadow(#3d62f6 999px 0);
// }
.menu-item {
  overflow: hidden;
  // img{
  //   display: inline-block;
  //   height: 1.75rem;
    // width:2rem;
    // margin-left:-900px;
    // filter: drop-shadow(#3d62f6 900px 0);
  // }
  // .menu-item-filter {
  //   width: 100%;
  //   height: 38px;
  // }
  // &:hover > &-filter {
  //   margin-left: -999px;
  //   filter: drop-shadow(#3d62f6 999px 0);
  // }
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
