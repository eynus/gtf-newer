<template>
  <Layout class="h100 pd-lg container">
      <Row type="flex" justify="space-between" style="margin: 0">
        <Col span="4" class="bg-white chart" v-for="item in radios" :key="item.value">
          <AreaPie :func="area[item.value]" :town="town">{{item.label}}面积占全市面积比重</AreaPie>
        </Col>
        <Col span="7" class="bg-white chart">
          <AreaLineBar :func="func">区县面积同开发区域面积对比</AreaLineBar>
        </Col>
      </Row>
      <Content class="content">
        <arcMap :funcname="funcname" @mapCreated="mapCreated"></arcMap>
        <div class="tool">
          <CheckboxGroup v-model="radio" vertical @on-change="radioChange">
            <Checkbox :label="item.value" v-for="item in radios" :key="item.value">
              <Icon type="social-apple"></Icon>
              <span>{{item.label}}</span>
            </Checkbox>
          </CheckboxGroup>
        </div>
      </Content>
  </Layout>
</template>
<script>
import arcMap from './map'
import AreaPie from "./charts/AreaPie"
import AreaLineBar from "./charts/AreaLineBar"
import Storage from "@/utils/storage";
import { funcList } from "@/api/pic/situation"
export default {
  name: "situation",
  data() {
    return{
      radio: [0 , 1, 2, 3],
      radios: [
        {
          label: '优化开发区域',
          value: 0
        },
        {
          label: '重点开发区域',
          value: 1
        },
        {
          label: '限制开发区域',
          value: 2
        },
        {
          label: '禁止开发区域',
          value: 3
        }
      ],
      area: [
        {
          value: 0,
          label: '优化面积',
          key: 0
        },
        {
          value: 0,
          label: '重点面积',
          key: 1
        },
        {
          value: 0,
          label: '限制面积',
          key: 2
        },
        {
          value: 0,
          label: '禁止面积',
          key: 3
        }
      ],
      funcname: [],
      town: {},
      func: [],
    }
  },
  components: {
    arcMap,
    AreaPie,
    AreaLineBar
  },
  mounted() {
    this.init()
  },
  methods: {
    radioChange() {
      let funcname = []
      this.radios.map(item => {
        this.radio.forEach(radio => {
          if (item.value === radio) {
            funcname.push(item)
          }
        })
      })
      this.funcname = funcname
    },
    getTown() {
      this.town = Storage.getArea()[0]
    },
    mapCreated() {
      this.radioChange()
    },
    getFuncList() {
      funcList({}).then(res => {
        if (res.data.code === 1000) {
          this.func = res.data.data
          let city = this.func.filter(item => item.code == 1)
          city.forEach(item => {
            switch (item.functionType) {
              case '优化开发区域':
                this.area[0].value = parseInt(item.sumArea)
                break
              case '重点开发区域':
                this.area[1].value = parseInt(item.sumArea)
                break
              case '限制开发区域':
                this.area[2].value = parseInt(item.sumArea)
                break
              case '禁止开发区域':
                this.area[3].value = parseInt(item.sumArea)
                break
            }
          })
        }
      })
    },
    init() {
      this.getTown()
      this.getFuncList()
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  .chart {
    height: 12.3rem;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
  }
  .content {
    position: relative;
    .tool {
      position: absolute;
      top: 2rem;
      right: 30px;
      padding: 0.8rem;
      background: #fff;
      ::v-deep .ivu-checkbox-group-item {
        display: block;
        padding: 0.2rem;
      }
    }
  }
}
</style>
