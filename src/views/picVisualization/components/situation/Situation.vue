<template>
  <Layout class="h100 pd-lg container">
      <Row type="flex" justify="space-between" style="margin: 0">
        <Col span="4" class="bg-white chart" v-for="item in radios" :key="item.value">
          <AreaPie :data="area[item.value]" :town="town">{{item.label}}面积占全市面积比重</AreaPie>
        </Col>
        <Col span="7" class="bg-white chart">
          <AreaLineBar>区县面积同开发区域面积对比</AreaLineBar>
        </Col>
      </Row>
      <Content class="content">
        <arcMap></arcMap>
        <div class="tool">
          <RadioGroup v-model="radio" vertical @on-change="radioChange">
            <Radio :label="item.value" v-for="item in radios" :key="item.value">
              <Icon type="social-apple"></Icon>
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
        </div>
      </Content>
  </Layout>
</template>
<script>
import arcMap from './map'
import AreaPie from "./charts/AreaPie"
import AreaLineBar from "./charts/AreaLineBar"
import Storage from "@/utils/storage";
export default {
  name: "situation",
  data() {
    return{
      radio: 0,
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
      town: {},
    }
  },
  components: {
    arcMap,
    AreaPie,
    AreaLineBar
  },
  mounted() {
    this.init()
    setTimeout(() => {
      this.area.forEach(item => {
        item.value = Math.floor(Math.random()*(0 - 20000) + 20000);
      })
    }, 2000)
  },
  methods: {
    radioChange() {
      console.log(this.radio)
    },
    getTown() {
      this.town = Storage.getArea()[0]
    },
    init() {
      this.getTown()
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
      border: 1px solid #000;
      background: #fff;
    }
  }
}
</style>
