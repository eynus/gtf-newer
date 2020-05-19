<template>
  <div>
    <Row>
      <i-col span="4">
        <div class="pd">
          <my-tree :gData="gData" @handleSelect="handleSelect"></my-tree>
        </div>
      </i-col>
      <i-col span="20">
        <div class="pd">
          <div class="module-head">
            <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />
            <span class="ml">服务检索</span>
          </div>

          <Form ref="formInline" inline class="mt ml">
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
            <Button type="primary">注册服务</Button>
          </div>
          <div class="mt">
            <div class="service-list-item" v-for="i in 3" :key="`${i}`">
              <Row :gutter="6" type="flex" align="center"  justify="center">
                <i-col span="3">
                  <div class="img-wrap"></div>
                </i-col>
                <i-col span="15">
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
      </i-col>
    </Row>
  </div>
</template>
<script>
import MyTree from "_c/myTree/MyTree.vue";
let gData = [];

gData = [
  {
    children: [
      {
        key: "基础绘测",
        scopedSlots: { title: "title" },
        title: "基础绘测",
        children: [
          {
            key: "基础地理",
            title: "基础地理",
            scopedSlots: { title: "title" }
          },
          { key: "影像图", title: "影像图", scopedSlots: { title: "title" } },
          { key: "地形图", title: "地形图", scopedSlots: { title: "title" } }
        ]
      },
      {
        key: "地质环境",
        scopedSlots: { title: "title" },
        title: "地质环境",
        children: [
          {
            key: "资源调查",
            title: "资源调查",
            scopedSlots: { title: "title" }
          },
          {
            key: "城乡建设",
            title: "城乡建设",
            scopedSlots: { title: "title" }
          },
          {
            key: "生态环境保护",
            title: "生态环境保护",
            scopedSlots: { title: "title" }
          }
        ]
      },
      {
        key: "历史文化保护",
        scopedSlots: { title: "title" },
        title: "历史文化保护",
        children: [
          {
            key: "资源感知",
            title: "资源感知",
            scopedSlots: { title: "title" }
          },
          {
            key: "管理数据",
            title: "管理数据",
            scopedSlots: { title: "title" }
          },
          {
            key: "社会经济数据",
            title: "社会经济数据",
            scopedSlots: { title: "title" }
          }
        ]
      }
    ],
    key: "现状数据",
    title: "现状数据",
    scopedSlots: { title: "title" }
  },
  {
    children: [
      {
        key: "0-1-0",
        scopedSlots: { title: "title" },
        title: "0-1-0",
        children: [
          { key: "0-1-0-0", title: "0-1-0-0", scopedSlots: { title: "title" } },
          { key: "0-1-0-1", title: "0-1-0-1", scopedSlots: { title: "title" } },
          { key: "0-1-0-2", title: "0-1-0-2", scopedSlots: { title: "title" } }
        ]
      },
      {
        key: "0-1-1",
        scopedSlots: { title: "title" },
        title: "0-1-1",
        children: [
          { key: "0-1-1-0", title: "0-1-1-0", scopedSlots: { title: "title" } },
          { key: "0-1-1-1", title: "0-1-1-1", scopedSlots: { title: "title" } },
          { key: "0-1-1-2", title: "0-1-1-2", scopedSlots: { title: "title" } }
        ]
      },
      {
        key: "0-1-2",
        scopedSlots: { title: "title" },
        title: "0-1-2",
        children: [
          { key: "0-1-2-0", title: "0-1-2-0", scopedSlots: { title: "title" } },
          { key: "0-1-2-1", title: "0-1-2-1", scopedSlots: { title: "title" } },
          { key: "0-1-2-2", title: "0-1-2-2", scopedSlots: { title: "title" } }
        ]
      }
    ],
    key: "规划数据",
    title: "规划数据",
    scopedSlots: { title: "title" }
  }
];

export default {
  name: "Home",
  data() {
    return {
      buttonSize: "large",
      gData
    };
  },
  components: { MyTree },
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
  background: url("../../../../assets/img/dataManage/query/map.png");
}
.service-list-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .item-title{
    font-weight: 700;
    font-size: 1.125rem;

  }
  .item-label{
    display: inline-block;
    width: 6rem;
  }
}
</style>