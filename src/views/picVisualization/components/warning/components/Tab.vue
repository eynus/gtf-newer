<template>
  <div class="tab" >
    <Tabs v-bind="$attrs" v-on="$listeners">
      <TabPane label="总览" icon="ios-aperture-outline">
        <slot name="table"></slot>
      </TabPane>
      <TabPane label="年份统计" icon="ios-calendar-outline">
        <slot name="charty"></slot>
      </TabPane>
      <TabPane label="行政区划统计" icon="ios-barcode-outline">
        <slot name="chartx"></slot>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  /**
   * 标签选项卡
   */
  export default {
    name: "Tab",
  }
</script>

<style lang="scss" scoped>
.tab {
  height: 100%;
  position: relative;
  ::v-deep .ivu-tabs {
    height: 100%;
  }
  ::v-deep .ivu-tabs-bar {
    margin-bottom: 1rem;
 }
 ::v-deep .ivu-tabs-content {
    height: 100%;
    > .ivu-tabs-tabpane:nth-child(2) {
      height: calc(100% - 52px);
    }
  }
 ::v-deep .ivu-tabs-tabpane {
    height: calc(100% - 11rem);
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
