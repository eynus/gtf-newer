<template>
  <div>
    <div class="module-head">
      <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />
      <span class="ml">服务检索</span>
    </div>

    <Form ref="formInline" inline class="mt ">
      <FormItem prop="name">
        <Input style placeholder="请输入服务名称关键字" />
      </FormItem>
      <FormItem>
        <Button type="primary">查询</Button>
      </FormItem>
    </Form>
    <div class="flex flex-sb">
      <ButtonGroup>
        <Button type="primary">
          资源名称
          <Icon type="md-arrow-up" />
        </Button>
        <Button type="primary">
          更新日期
          <Icon type="md-arrow-down" />
        </Button>
      </ButtonGroup>
      <Button type="primary" to="/data/service/register">注册服务</Button>
    </div>
    <div class="mt">
      <div class="service-list-item" v-for="i in 3" :key="`${i}`">
        <Row :gutter="6" type="flex"  justify="center">
          <i-col span="3">
            <div class="img-wrap"></div>
          </i-col>
          <i-col span="15" class="text-darkgrey">
            <div class="item-title">2019年昭通影像</div>
            <Row>
              <i-col span="8">
                <span class="item-label">专题类型：</span>
                <span class="item-value">遥感测绘</span>
              </i-col>
              <i-col span="8">
                <span class="item-label">专题类型：</span>
                <span class="item-value">遥感测绘</span>
              </i-col>
              <i-col span="8">
                <span class="item-label">专题类型：</span>
                <span class="item-value">遥感测绘</span>
              </i-col>
              <i-col span="8">
                <span class="item-label">专题类型：</span>
                <span class="item-value">遥感测绘</span>
              </i-col>
            </Row>
          </i-col>
          <i-col span="6">
            <Button type="primary" shape="circle">启动</Button>
            <Button type="primary" shape="circle" class="ml">停止</Button>
            <Button type="primary" shape="circle" class="ml">删除</Button>
          </i-col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
// import MyTree from "_c/myTree/MyTree.vue";
export default {
  name: "Home",
  data() {
    return {
      buttonSize: "large",
      
    };
  },
//   components: { MyTree },
  computed: {},
  methods: {
    handleSelect(e) {
      console.log(e);
    }
  }
};
</script>
<style lang="scss" scoped>
.img-wrap {
  width: 5rem;
  height: 5rem;
  background: url("../../../../../assets/img/dataManage/query/map.png");
}
.service-list-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .item-title {
    font-weight: 700;
    font-size: 1.125rem;
  }
  .item-label {
    display: inline-block;
    width: 6rem;
  }
}
</style>