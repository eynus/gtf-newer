<template>
  <div class="table">
    <div class="row" v-for="item in datas">
      <span class="title" :title="item.name">{{ item.name }}</span>
      <span class="num">{{ item.value }}</span>
      <span class="unit">{{ item.unit }}</span>
    </div>
  </div>
</template>

<script>
/**
 * 预警一张图-展示表格
 */
export default {
  name: "Table",
  props: {
    datas: Array,
  }
}
</script>

<style lang="scss" scoped>
.table {
  font-size: 0.875rem;
  color: #999db2;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 1.5rem;
    padding-left: 3rem;
    line-height: 3rem;
    height: 3rem;
    &:hover {
      background: #ebf4ff;
    }
    .title {
      flex: 1;
      height: 100%;
      text-align: right;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .num {
      width: 4rem;
      margin-left: 8rem;
      font-weight: 800;
      color: #3c8fff;
    }
    .unit {
      width: 7rem;
      margin-left: 5rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
