<template>
  <div>
    <div class="card-container">
      <div class="card-title">
           <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0"/>
       分类汇总
      </div>
      <div class="card-body">
        <Row>
          <i-col span="12">
            <Row type="flex">
              <i-col span="12" order="1" v-for="(item,index) in typesTotal" :key="`type_${index}`">
                <div
                  class="card-left-item"
                  :style="`{'backgroundColor':${item.bgColor},'color':'red'}`"
                >
                  <div class="card-left-item-title">
                    <Icon type="ios-navigate"></Icon>
                    {{item.name}}
                  </div>
                  <div>
                    <Row type="flex" align="bottom">
                      <i-col span="18">
                        <Row type="flex">
                          <i-col span="12">
                            <span>{{item.firstChilds}}个一级子类</span>
                          </i-col>
                          <i-col span="12">
                            <span>{{item.secondChilds}}个二级子类</span>
                          </i-col>
                        </Row>
                      </i-col>
                      <i-col span="6">
                        <span class="card-left-item-total">{{item.totalChilds}}</span>个
                      </i-col>
                    </Row>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">图表</i-col>
        </Row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
       <Icon custom="iconfont  icon-input" size="16" color="#2d8cf0" />入库历史
      </div>
      <div class="card-body">
        <div>查询条件</div>
        <Table border size="small" :columns="columnsPutIn" :data="dataPutIn"></Table>
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      typesTotal: [
        {
          name: "现状数据",
          firstChilds: 1,
          secondChilds: 2,
          totalChilds: 3,
          bgColor: "blue"
        },
        {
          name: "规划数据",
          firstChilds: 1,
          secondChilds: 21,
          totalChilds: 22,
          bgColor: "yellow"
        },
        {
          name: "管理数据",
          firstChilds: 1,
          secondChilds: 12,
          totalChilds: 13,
          bgColor: "green"
        },
        {
          name: "社会经济数据",
          firstChilds: 12,
          secondChilds: 12,
          totalChilds: 24,
          bgColor: "blue"
        }
      ],
      columnsPutIn: [
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        }
      ],
      dataPutIn: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ]
    };
  },
  computed: {
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.card-container {
  // margin:4px;
  .card-title {
    background-color: rgba(0, 0, 0, 0.1);
    font-weight: bold;
    
    line-height: 1.75;
    color:rgb(81,81,81);
    padding: 0 4px;
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