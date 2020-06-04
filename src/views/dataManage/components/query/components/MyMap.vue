<template>
  <div id="mapbox" v-on:keyup.122 = "fullClose" v-on:keyup.27 = "fullClose">
    <div id="viewDiv"></div>
    <!-- 地图的工具框 -->
    <ButtonGroup id="toolbar" vertical style="display: flex;flex-direction: column">
      <Tooltip content="距离测量" placement="right">
        <Button :type="type=='distance'?'primary':'default'" @click="clickToolbar('distance')" style="padding:5px 5px 0px">
          <img src="@/assets/map_images/length.png" alt="" style="width: 20px;height: 20px;">
        </Button>
      </Tooltip>
      <Tooltip content="测量面积" placement="right">
        <Button :type="type=='area'?'primary':'default'" @click="clickToolbar('area')" style="padding:5px 5px 0px">
          <img src="@/assets/map_images/area.png" alt="" style="width: 20px;height: 20px;">
        </Button>
      </Tooltip>
    </ButtonGroup>
    <!-- 卷帘工具条 -->
    <div id="curtainBtn">
      <button @click.stop="curtainStateToggle" :class="{ active : curtainStatus }" title="卷帘">
        <i class="iconfont">&#xe676;</i>
      </button>
    </div>
    <!-- 卷帘工具条 -->
    <div id="lengend">
      <ul>
        <li><span style="border-color:rgb(219, 64, 82);"></span>新增</li>
        <li><span style="border-color:rgb(255, 255, 0);"></span>规模扩大</li>
        <li><span style="border-color:rgb(4, 170, 88);"></span>消失</li>
      </ul>
<!--      <img src="../../../assets/map_images/lengend1.png" alt="" style="width: 115px;">-->
    </div>
  </div>
</template>

<script>
import arcgisPackage from '@/utils/arcgisTools'
import config from '@/config/mapConfig'
import { tdtlayer, tdtyNoteslayer, tdtclayer, tdtcNoteslayer } from '@/utils/layers'
import Basemapthumbnail from '@/assets/map_images/Basemapthumbnail.png'
import Basemapthumbnail1 from '@/assets/map_images/Basemapthumbnail1.png'

// 样式渲染器，添加到FeatureLayer时候用的
let symbolAdd = {
  type: 'simple-fill',
  color: [219, 64, 82, 0],
  style: 'solid',
  outline: {
    color: [219, 64, 82],
    width: 1.5
  }
}
// 样式渲染器，添加到FeatureLayer时候用的
let symbolScale = {
  type: 'simple-fill', // 自动生成新的simpleFillSymbol
  color: [255, 128, 0, 0],
  outline: {
    // 自动生成新的SimpleLineSymbol
    color: [255, 255, 0],
    width: 1.5
  }
}
// 样式渲染器，添加到FeatureLayer时候用的
let symbolSub = {
  type: 'simple-fill',
  color: [4, 170, 88, 0],
  style: 'solid',
  outline: {
    color: [4, 170, 88],
    width: 1.5
  }
}
// 样式渲染器，添加到FeatureLayer时候用的
let symbolLigth = {
  type: 'simple-fill',
  color: [180, 0, 0, 0.4],
  style: 'solid',
  outline: {
    color: [255, 128, 0],
    width: 1.5
  }
}
export default {
  name: 'OnePiece',
  data () {
    return {
      map: null, // 地图实例
      view: null, // 地图视图实例
      type: '',
      addLayer: {}, // 增加的斑块图层
      subLayer: {}, // 减少的斑块图层
      scaleLayer: {}, // 规模扩大的斑块图层
      oldLayer: {}, // 卷帘的斑块图层
      newLayer: {}, // 卷帘的斑块图层
      lightLayer: {}, // 高亮的斑块图层
      // 工具开关
      curtainStatus: false,
      // 卷帘工具底图下拉打开状态
      curbackListStatus: false,
      arr1: []
    }
  },
  props: ['boxstate'],
  methods: {
    /**
     * @Description: 初始化“一张图”数据中心的地图
     * @author 张淼
     * @date 2019/4/16
     */
    async createMap () {
      // 导入需要的arcgis模块
      let MapView = await arcgisPackage.MapView
      let Map = await arcgisPackage.Map
      let Basemap = await arcgisPackage.Basemap
      let BasemapToggle = await arcgisPackage.BasemapToggle
      let Fullscreen = await arcgisPackage.Fullscreen
      let GraphicsLayer = await arcgisPackage.GraphicsLayer

      // 天地图影像地图
      let tdtylayer = await tdtlayer().then(res => {
        return res
      })
      // 天地图矢量地图
      let tdtylayer1 = await tdtclayer().then(res => {
        return res
      })
      // 天地图的矢量标注图层
      let tdtylayer2 = await tdtcNoteslayer().then(res => {
        return res
      })
      // 天地图影像标注图层
      let tdtylayer3 = await tdtyNoteslayer().then(res => {
        return res
      })

      let customBasemap = new Basemap({
        baseLayers: [tdtylayer1, tdtylayer2],
        title: '矢量地图',
        id: 'myBasemap',
        thumbnailUrl: Basemapthumbnail
      })
      let customBasemap1 = new Basemap({
        baseLayers: [tdtylayer, tdtylayer3],
        title: '影像地图',
        id: 'myBasemap1',
        thumbnailUrl: Basemapthumbnail1
      })

      this.map = new Map({
        basemap: customBasemap1
      })
      this.view = new MapView({
        map: this.map,
        container: 'viewDiv',
        center: config.centerPoint,
        zoom: 6
      })
      // 添加工具框
      this.view.ui.add(document.getElementById('toolbar'), 'top-left')
      // 添加全屏
      this.fullscreen = new Fullscreen({
        view: this.view
      })
      // 添加卷帘工具条
      this.view.ui.add(document.getElementById('curtainBtn'), 'top-left')
      // 添加图例
      this.view.ui.add(document.getElementById('lengend'), 'bottom-left')
      this.view.ui.add(this.fullscreen, 'top-left')
      // 增加地图切换插件
      let basemapToggle = new BasemapToggle({
        view: this.view,
        nextBasemap: customBasemap
      })
      this.view.ui.padding = { top: 20, left: 20, right: 55, bottom: 20 }
      this.view.ui.add(basemapToggle, 'top-right')
      this.newLayer = new GraphicsLayer({
        graphics: []
      })
      this.oldLayer = new GraphicsLayer({
        graphics: []
      })
      this.lightLayer = new GraphicsLayer({
        graphics: []
      })
      this.map.add(this.lightLayer)
      // this.map.add(this.oldLayer)
    },
    /**
     * @Description:测量工具点击事件
     * @author 张淼
     * @date 2019/4/11
     */
    async clickToolbar (type) {
      if (this.type === type) {
        type = null
      }
      this.type = type
      if (this.activeWidget) {
        this.view.ui.remove(this.activeWidget)
        this.activeWidget.destroy()
        this.activeWidget = null
      }
      switch (type) {
        case 'distance':
          let DistanceMeasurement2D = await arcgisPackage.DistanceMeasurement2D
          this.activeWidget = new DistanceMeasurement2D({
            view: this.view
          })
          this.activeWidget.viewModel.newMeasurement()
          this.view.ui.add(this.activeWidget, 'top-right')
          break
        case 'area':
          let AreaMeasurement2D = await arcgisPackage.AreaMeasurement2D
          this.activeWidget = new AreaMeasurement2D({
            view: this.view
          })
          this.activeWidget.viewModel.newMeasurement()
          this.view.ui.add(this.activeWidget, 'top-right')
          break
        default:
          break
      }
    },
    /* 渲染出人类活动 */
    async renderBankuai (addArr, subArr) {
      let FeatureLayer = await arcgisPackage.FeatureLayer
      let SimpleRenderer = await arcgisPackage.SimpleRenderer
      let Graphic = await arcgisPackage.Graphic
      this.map.removeMany([this.addLayer, this.subLayer, this.scaleLayer])
      /* 字段列表 */
      let fields = [
        {
          name: 'ObjectID',
          type: 'oid'
        },
        {
          name: 'name',
          alias: '斑块名称',
          type: 'string'
        },
        {
          name: 'name_1',
          alias: 'name_1',
          type: 'string'
        },
        {
          name: 'type',
          label: '人类活动类型',
          type: 'string'
        },
        {
          name: 'trend',
          alias: 'trend',
          type: 'string'
        },
        {
          name: 'type_1',
          alias: 'type_1',
          type: 'string'
        },
        {
          name: 'index',
          alias: 'index',
          type: 'string'
        }
      ]
      // 用于存放新增斑块的数组
      let graphicArr1 = []
      // 用于存放规模扩大斑块的数组
      let graphicArr3 = []
      // 封装面积增加的graphic数组
      addArr.forEach(val => {
        // 判断增加图层还是规模扩大图层--0扩大1新增
        if (val.attributes.addOrExpend === 0) {
          val.type = 'polygon'
          val.symbol = {
            type: 'simple-fill',
            color: [219, 64, 82, 0.4],
            style: 'solid',
            outline: {
              color: 'white',
              width: 1
            }
          }
          graphicArr3.push(new Graphic(val))
        } else if (val.attributes.addOrExpend === 1) {
          val.type = 'polygon'
          val.symbol = {
            type: 'simple-fill',
            color: [219, 64, 82, 0.4],
            style: 'solid',
            outline: {
              color: 'white',
              width: 1
            }
          }
          graphicArr1.push(new Graphic(val))
        }
      })

      // 样式渲染器，添加到FeatureLayer时候用的
      let orchardRenderer = new SimpleRenderer({
        symbol: symbolAdd
      })
      // 样式渲染器，添加到FeatureLayer时候用的
      let orchardRenderer3 = new SimpleRenderer({
        symbol: symbolScale
      })
      // 样式渲染器，添加到FeatureLayer时候用的
      let orchardRenderer2 = new SimpleRenderer({
        symbol: symbolSub
      })
      // 增加数据
      this.addLayer = new FeatureLayer({
        layerId: 'orchardLayer',
        id: 'orchardLayer',
        title: '',
        objectIdField: 'ObjectID',
        source: graphicArr1,
        renderer: orchardRenderer,
        fields: fields,
        spatialReference: {
          wkid: config.mapWkid
        },
        popupTemplate: {
          title: '斑块属性',
          content: [{
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'type',
                label: '人类活动类型'
              }, {
                fieldName: 'trend',
                label: '变化趋势'
              }]
          }]
        }
      })
      // 规模扩大
      this.scaleLayer = new FeatureLayer({
        layerId: 'orchardLayer3',
        id: 'orchardLayer3',
        title: '',
        objectIdField: 'ObjectID',
        source: graphicArr3,
        renderer: orchardRenderer3,
        fields: fields,
        spatialReference: {
          wkid: config.mapWkid
        },
        popupTemplate: {
          title: '斑块属性',
          content: [{
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'type',
                label: '人类活动类型'
              }, {
                fieldName: 'trend',
                label: '变化趋势'
              }]
          }]
        }
      })
      // 用于存放新增斑块的数组
      let graphicArr2 = []
      // 封装减少面积的graphic的数组
      subArr.forEach(val => {
        val.type = 'polygon'
        val.symbol = {
          type: 'simple-fill',
          color: [4, 170, 88, 0.4],
          style: 'solid',
          outline: {
            color: 'white',
            width: 1
          }
        }
        graphicArr2.push(new Graphic(val))
      })
      // 增加数据
      this.subLayer = new FeatureLayer({
        layerId: 'orchardLayer2',
        id: 'orchardLayer2',
        title: '',
        objectIdField: 'ObjectID',
        source: graphicArr2,
        renderer: orchardRenderer2,
        fields: fields,
        popupTemplate: {
          title: '斑块属性',
          content: [{
            type: 'fields',
            fieldInfos: [
            //   {
            //   fieldName: 'name',
            //   label: '斑块名称'
            // },
            //   {
            //   fieldName: 'cd020',
            //   label: '人类活动类型'
            // }, {
            //     fieldName: 'area',
            //     label: '面积（㎡）'
            //   },{
            //   fieldName: 'position',
            //   label: '位置'
            // },
              {
                fieldName: 'type',
                label: '人类活动类型'
              }, {
                fieldName: 'trend',
                label: '变化趋势'
              }]
          }]
        }
      })
      // 将数据图层添加到地图中
      this.map.add(this.addLayer)
      this.map.add(this.subLayer)
      this.map.add(this.scaleLayer)
      this.addLayer.applyEdits({
        addFeatures: graphicArr1
      })
      this.subLayer.applyEdits({
        addFeatures: graphicArr2
      })
      this.scaleLayer.applyEdits({
        addFeatures: graphicArr3
      })
      //this.view.goTo([...graphicArr1, ...graphicArr2])
    },
    /* 定位到所有版块视图 */
    async toPolygons (arr) {
      let Graphic = await arcgisPackage.Graphic
      // 用于存放新增斑块的数组
      let graphicArr = []
      // 封装面积增加的graphic数组
      arr.forEach(val => {
        graphicArr.push(new Graphic(val))
      })
      this.view.goTo([...graphicArr])
    },
    /* 定位到特定的斑块 */
    toPolygon (trend, index, addOrExpend) {
      // trend判断增加还是减少图层
      // addOrExpend判断增加还是规模扩大图层
      let layer = {}
      if (trend === 0) {
        //  判断是减少图层
        layer = this.subLayer
      } else if (trend === 1) {
        if (addOrExpend === 0) {
          //  判断是规模扩大图层
          layer = this.scaleLayer
        } else if (addOrExpend === 1) {
          //  判断是增加图层
          layer = this.addLayer
        }
      }
      layer.queryFeatures().then((res) => {
        let currentGraphic = res.features.filter(val => {
          return val.attributes.index === index
        })
        this.view.goTo(currentGraphic)
        for (let i in currentGraphic) {
          currentGraphic[i].symbol = symbolLigth
        }
        this.lightLayer.removeAll()
        this.lightLayer.addMany(currentGraphic)
      })
    },
    /* 切换合并按钮状态 */
    async curtainStateToggle () {
      if (!this.curtainStatus) {
        this.curtainStatus = true
        this.addCurtain()
      } else {
        this.delCurtain()
        this.curtainStatus = false
      }
    },
    /* 添加卷帘工具 */
    async addCurtain () {
      let Swipe = await arcgisPackage.Swipe
      this.map.addMany([this.oldLayer], 1)
      this.swipe = new Swipe({
        leadingLayers: [this.oldLayer],
        trailingLayers: [this.newLayer],
        position: 35, // set position of widget to 35%
        direction: 'vertical',
        view: this.view
      })
      this.view.ui.add(this.swipe)
    },
    /* 获取卷帘对比图层 */
    async addTifLayer1 (tifUrl) {
      let MapImageLayer = await arcgisPackage.MapImageLayer
      let layer = MapImageLayer({
        url: config.mapImageLayerDynamicSpaceLayer,
        spatialReference: this.view.spatialReference,
        sublayers: [{
          renderer: {
            type: 'simple',
            visualVariables: [
              {
                type: 'color',
                field: 'Value',
                stops: [
                  { value: 0, color: '#ff0000' },
                  { value: 100, color: '#0000ff' }
                ]
              }
            ]
          },
          source: {
            type: 'data-layer',
            dataSource: {
              type: 'raster',
              workspaceId: 'tif',
              dataSourceName: tifUrl
            }
          }
        }]
      })
      this.newLayer = layer
      this.map.addMany([this.newLayer], 0)
    },
    async addTifLayer2 (tifUrl) {
      let MapImageLayer = await arcgisPackage.MapImageLayer
      let layer = MapImageLayer({
        url: config.mapImageLayerDynamicSpaceLayer,
        spatialReference: this.view.spatialReference,
        sublayers: [{
          renderer: {
            type: 'simple',
            visualVariables: [
              {
                type: 'color',
                field: 'Value',
                stops: [
                  { value: 0, color: '#ff0000' },
                  { value: 100, color: '#0000ff' }
                ]
              }
            ]
          },
          source: {
            type: 'data-layer',
            dataSource: {
              type: 'raster',
              workspaceId: 'tif',
              dataSourceName: tifUrl
            }
          }
        }]
      })
      this.oldLayer = layer
    },
    /* 销毁组件 */
    async delCurtain () {
      this.map.remove(this.map.findLayerById('ctdt'))
      this.map.remove(this.map.findLayerById('ctdtNote'))
      this.swipe.destroy()
      this.map.removeMany([this.oldLayer])
    },
    /* 清空影像 */
    async clearImage () {
      this.delCurtain()
      this.map.removeMany([this.newLayer])
      this.map.removeMany([this.addLayer])
      this.map.removeMany([this.scaleLayer])
      this.map.removeMany([this.subLayer])
      this.map.removeMany([this.lightLayer])
    }
  },
  async mounted () {
    // 初始化地图
    await this.createMap()
  }
}
</script>

<style lang="scss" scoped>
  #mapbox{
    height: 100%;
    display: flex;
    position: relative;
    #curtainBtn{
      button{
        width: 32px;
        height: 32px;
        background: #fff;
        cursor: pointer;
        outline: none;
        border: 1px solid #fff;
      }
      .active{
        border: 1px solid #fff;
        background: #4c4c4c;
        color: #fff
      }
    }
  }
  #layersControl{
    .layersControl_box{
      padding:3px;
      background: #fff;
      border: 1px solid #d1d1d1;
      .fraggableBox{
        padding: 0;
        .fraggableLi{
          min-width: 100px;
          padding: 5px 8px;
          border-top: 1px solid #d1d1d1;
        }
      }
    }
  }
  #viewDiv{
    height: 100%;
    flex-grow: 2;
  }
  #maptab{
    width: 300px;
    .firstmenu{
      >li{
        margin-bottom: 6px;
        text-align: left;
        >ul{
          >li{
            padding-left: 20px;
          }
        }
        >p{
          line-height: 40px;
          text-align: left;
          font-size: 16px;
          background-color: rgb(42,177,245);
          color: white;
          padding-left: 10px;
          border-radius: 4px;
          cursor: pointer;
          i{
            font-size: 16px;
            line-height: 40px;
            margin-right: 10px;
          }
        }
        .secondmenu{
          label{
            line-height: 30px;
            font-size: 14px;
          }
        }
      }
    }
  }
  #basemapToggle{
    border: 5px #000 solid;
  }
</style>
<style scoped>
  #maptab >>> .ivu-tabs-content{
    height: calc(100% - 40px);
    margin-top: -16px;
  }
  #maptab >>> .ivu-tabs-content > .ivu-tabs-tabpane{
    padding: 16px;
    border: 1px solid #dcdee2;
    border-radius: 0 0 4px 4px;
    border-top: none;
  }
  #maptab >>> .ivu-tabs-nav{
    display: flex;
    float: none;
  }
  #maptab >>> .ivu-tabs-nav .ivu-tabs-tab{
    flex-grow: 2;
    margin-right: 0;
  }
  .sliderBox >>> .ivu-slider-wrap{
    margin: 0 0 3px
  }
  >>> .esri-swipe__container{
    outline:none
  }
  #lengend {
    background: #fff;
    z-index: 100;
    margin: 0;
    padding: 10px;
    text-align: left;
  }
  #lengend li {
    line-height: 30px;
    overflow: hidden;
  }
  #lengend span {
    display: inline-block;
    width: 15px;
    height: 15px;
    border: 2px solid #fff;
    margin-right: 5px;
    margin-top: 7px;
    float: left;
  }
</style>
