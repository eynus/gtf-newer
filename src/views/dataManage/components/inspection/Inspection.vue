<template>
  <div class="h100 inspection">
    <Row style="height:100%;">
      <Col span="4" style="overflow:hidden; height: 100%;" class="bg-white">
        <div class="mg h100" style="overflow: auto;">
          <Menu :active-name="activeName" @on-select="onSelect" class="h100">
            <MenuItem
                :name="item.key"
                v-for="(item,index) in siderMenuList"
                :key="`menu_${index}`"
            >{{item.name}}</MenuItem>
          </Menu>
        </div>
      </Col>
      <Col span="20 bg-white h100">
        <div class="pd h100">
          <router-view ></router-view>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import {getzjML} from "@/api/dataManage/inspection";

  export default {
  name: "Home",
  data() {
    return {
      activeName:'mathBasic',
      siderMenuList: [
        { name: "数学基础规范性", key: "mathBasic" ,rules_code:"203"},
        { name: "属性结构规范性", key: "propStruct",rules_code:"204" },
        { name: "值域规范性", key: "valRange",rules_code:"205" },
        { name: "图形拓扑规范性", key: "graphTopo",rules_code:"206"  },
        { name: "图形上图规范性", key: "graphAbove",rules_code:"20701"  },
        { name: "属内一致性", key: "propIn",rules_code:"205"  },
        { name: "图属一致性", key: "grapgGenus" ,rules_code:"205" },
        { name: "图图关联一致性", key: "graphCorr",rules_code:"205"  },
        { name: "图图拓扑一致性", key: "graphTopoConsis",rules_code:"205"  },
        { name: "属表一致性", key: "genusTableConsis",rules_code:"205"  },
        { name: "表内横向逻辑一致性", key: "tableOrienConsis" ,rules_code:"205" },
        { name: "表内纵向逻辑一致性", key: "tablePortConsis",rules_code:"205"  },
        { name: "表间逻辑一致性", key: "tableInterConsis",rules_code:"205"  },
        { name: "表格结构规范性", key: "tableStruct",rules_code:"401"  }
      ]
    };
  },
  computed: {},
  created(){
    let pathArr = this.$route.path.split('/')
    this.activeName = pathArr[pathArr.length-1]//this.$route.query.id
    this.getzjML()
  },
  methods: {
    onSelect(name) {
      let item=this.siderMenuList.find((item)=>item.key===name)
      this.$router.push({path:`/data/inspection/${name}`,query:{id:item.pkId,rules_code:item.rules_code}})
    },
    getzjML(){
      getzjML().then(res=>{
        let {code,data} = res.data
        if(code===1000){
          this.siderMenuList.forEach((item,index)=>{
            let result = data.find(it => it.rulesName===item.name)
            if (result) {
              item.pkId = result.pkId
            }
          })
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
  .inspection {
    overflow: hidden;
    ::v-deep .inspection-table {
      margin-top: 10px;
    }
    /* 去除menu组件自带1px边框*/
    ::v-deep .ivu-menu {
      width: 90% !important;
      &:after {
        width: 0;
      }
    }
  }
</style>
