<template>
  <div>
    <Row>
      <i-col span="6">
        <Tree :data="data1"></Tree>
      </i-col>
      <i-col span="18">
         <img src="../../../../assets/img/dataManage/query/map.png" alt="">
      </i-col>
    </Row>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      data1: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  computed: {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.card-container {
  // margin:4px;
  .card-title {
    background-color: rgba(0, 0, 0, 0.1);
    font-weight: bold;
  }
  .card-body {
    .card-left-item {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 2px;
      margin: 10px;
      padding: 6px;
      color: white;
      .card-left-item-title {
        font-size: 26px;

        font-weight: bold;
      }
      .card-left-item-total {
        font-size: 26px;
        font-weight: bold;
      }
    }
  }
}
</style>