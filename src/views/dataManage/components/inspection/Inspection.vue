<template>
  <div>
    <Row>
      <i-col span="4">
        <div class="pd">
          <Menu active-name="1">
            <MenuItem
              :name="item.key"
              v-for="(item,index) in siderMenuList"
              :key="`menu_${index}`"
            >{{item.name}}</MenuItem>
          </Menu>
        </div>
      </i-col>
      <i-col span="20">
        <div class="pd">
          <router-view></router-view>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
export default {
  name: "Home",
  data() {
    return {
      siderMenuList: [
        { name: "数学基础规范性", key: "1" },
        { name: "属性结构规范性", key: "2" },
        { name: "值域规范性", key: "3" },
        { name: "图形拓扑规范性", key: "4" },
        { name: "图形上图规范性", key: "5" },
        { name: "属内一致性", key: "6" },
        { name: "图属一致性", key: "7" },
        { name: "图图关联一致性", key: "8" },
        { name: "图图拓扑一致性", key: "9" },
        { name: "属表一致性", key: "10" },
        { name: "表内横向逻辑一致性", key: "11" },
        { name: "表内纵向逻辑一致性", key: "12" },
        { name: "表间逻辑一致性", key: "13" }
      ],
     
    };
  },
  computed: {},
  methods: {}
};
</script>
<style lang="scss" scoped>
</style>