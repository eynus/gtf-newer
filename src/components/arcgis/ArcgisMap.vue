<template>
  <div style="width: 100%; height: 100%">
    <div :id="mapId" ref="viewDiv" style="width: 100%; height: 100%"></div>
    <div style="position: absolute;bottom: 20;left: 50%"></div>
  </div>
</template>

<script>
import { loadCss } from 'esri-loader'
import arcgisPackage from '@/utils/arcgisTools'
import config from '@/config/mapConfig'
import { tdtlayer, tdtyNoteslayer, tdtclayer, tdtcNoteslayer, redLine, shengjie } from '@/utils/layers'
import Basemapthumbnail from '../../assets/map_images/Basemapthumbnail.png'
import Basemapthumbnail1 from '../../assets/map_images/Basemapthumbnail1.png'
import boundaryMarker from '../../assets/projectApproval_images/position.png'
loadCss(config.esriCss)
/**
 * 快速生成一个地图
* */
export default {
  name: 'ArcgisMap',
  data () {
    return {
      mapId: '', // 地图框的id
      map: null, // 地图map实例
      view: null, // 地图view实例
      draw: null, // 地图绘制示例
      drawGeometry: null, // 地图绘制出的结果
      grouplayer: null, // 加载在地图的数组
      mousePoint: null // 鼠标的位置
    }
  },
  props: {
    /**
     * 用于加载的图层，传入为图层的数组
     * */
    layers: {
      type: Array
    },
    /**
     * 地图默认加载的地图类型，vector-矢量地图，image-影像地图
     *  @values vector, image
     * */
    baseMapType: {
      type: String,
      default: 'image',
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['vector', 'image'].indexOf(value) !== -1
      }
    },
    /**
     * 底图是否需要图形编辑工具sketch
     * */
    isSketch: {
      type: Boolean,
      default: false
    },
    /**
     * 标绘工具--是否添加标绘工具
     * */
    isPlotting: {
      type: Boolean,
      default: false
    },
    /**
     * 标绘工具--标绘的人类活动图层
     * */
    plottingLayerUrl: {
      type: String
    },
    /**
     * 标绘工具--当前解译任务的id
     * */
    ioha_hait_id: {
      type: Number
    }
  },
  watch: {
    layers: async function (layerarr) {
      this.addLayers(layerarr)
    }
  },
  methods: {
    /**
     * @Description:初始化地图
     */
    async createMap () {
      // todo 修改能够兼容84与非84地图
      // 加载arcgis地图的依赖
      let MapView = await arcgisPackage.MapView
      let Map = await arcgisPackage.Map
      let Basemap = await arcgisPackage.Basemap
      let BasemapToggle = await arcgisPackage.BasemapToggle
      let Plotting = await arcgisPackage.Plotting
      // 天地图影像地图
      let tdtylayer = await tdtlayer().then(res => { return res })
      // 天地图矢量地图
      let tdtylayer1 = await tdtclayer().then(res => { return res })
      // 天地图的矢量标注图层
      let tdtylayer2 = await tdtcNoteslayer().then(res => { return res })
      // 天地图影像标注图层
      let tdtylayer3 = await tdtyNoteslayer().then(res => { return res })
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
        basemap: {
          vector: customBasemap,
          image: customBasemap1
        }[this.baseMapType]
      })
      this.view = new MapView({
        map: this.map,
        container: this.mapId,
        center: config.centerPoint,
        zoom: 10
      })
      // 增加底图切换插件
      let basemapToggle = new BasemapToggle({
        view: this.view,
        nextBasemap: {
          vector: customBasemap1,
          image: customBasemap
        }[this.baseMapType]
      })
      this.view.on('pointer-move', ['Shift'], e => {
        let point = this.view.toMap({ x: e.x, y: e.y })
        console.log(point)
      })
      this.view.ui.add(basemapToggle, 'top-bottom')
      /* 将图层加载至地图上 */
      this.addLayers(this.layers)
      /* 判断是否需要创建图形编辑工具sketch */
      if (this.isSketch) {
        let GraphicsLayer = await arcgisPackage.GraphicsLayer
        let Sketch = await arcgisPackage.Sketch
        let sketchlayer = new GraphicsLayer({
          id: 'sketchlayer'
        })
        this.map.layers.add(sketchlayer)
        let sketch = new Sketch({
          view: this.view,
          layer: sketchlayer,
          availableCreateTools: [ 'polygon', 'rectangle', 'circle' ]
        })
        this.view.ui.add(sketch, 'top-right')
        sketch.on('create', e => {
          if (e.state === 'complete') {
            sketchlayer.remove(e.graphic)
            /**
             * sketch组件绘制完成的时间
             * @property {Graphic} 绘制后的graphic
             * */
            this.$emit('sketchcreatecomplete', e.graphic)
          }
        })
      }
      if (this.isPlotting) {
        let props = [{
          name: 'ioha_number',
          type: 'string',
          alias: '编号',
          inputtype: 'textinput'
        }, {
          name: 'ioha_hait_id',
          type: 'string',
          alias: '人类活动类型',
          inputtype: 'textinput'
        }, {
          name: 'ioha_area',
          type: 'string',
          alias: '面积',
          inputtype: 'textinput'
        }]
        let GraphicsLayer = await arcgisPackage.GraphicsLayer
        let FeatureLayer = await arcgisPackage.FeatureLayer
        let layer = new GraphicsLayer({})
        let featureLayer = new FeatureLayer({
          url: this.plottingLayerUrl,
          definitionExpression: 'ioha_del_flag = 1 and ioha_hait_id= ' + this.ioha_hait_id
        })
        let plotting = new Plotting({
          view: this.view,
          layer: layer,
          featureLayer: featureLayer,
          ioha_hait_id: this.ioha_hait_id,
          updateUrl: '/epr/api/rsmohaIoha/add',
          createUrl: '/epr/api/rsmohaIoha/add'
        })
        this.map.layers.add(layer)
        this.view.ui.add(plotting, 'top-right')
      }
    },
    /**
     * @Description:添加红线图层
     */
    async addRedline () {
      let layerRedLine = await redLine().then(res => { return res })
      this.map.add(layerRedLine)
    },
    /**
     * @Description:添加省界
     */
    async addProvinceLayer () {
      let layerProvince = await shengjie().then(res => { return res })
      this.map.add(layerProvince)
    },
    /**
     * @Description:面积转换
     */
    async cacuCoordinates (view, val) {
      let geometryEngine = await arcgisPackage.geometryEngine
      let GeometryService = await arcgisPackage.GeometryService
      let AreasAndLengthsParameters = await arcgisPackage.AreasAndLengthsParameters
      if (view.spatialReference.isWSG84) {
        return geometryEngine.geodesicArea(val, 'square-meters').toFixed(2)
      } else {
        let geometryService = new GeometryService({
          url: config.geometryServerUrl
        })
        let areasAndLengths = await geometryService.areasAndLengths(new AreasAndLengthsParameters({
          calculationType: 'geodesic',
          areaUnit: 'square-meters',
          lengthUnit: 'kilometers',
          polygons: [ val ]
        }))
        return areasAndLengths.areas[0].toFixed(2)
      }
    },
    /**
     * 测距测面
     * @param  type distance或area 为null时清空
     */
    async setActiveWidget (view, type) {
      let that = this
      if (that.activeWidget) {
        view.ui.remove(that.activeWidget)
        that.activeWidget.destroy()
        that.activeWidget = null
      }
      switch (type) {
        case 'distance':
          let DistanceMeasurement2D = await arcgisPackage.DistanceMeasurement2D
          that.activeWidget = new DistanceMeasurement2D({
            view: view
          })
          // skip the initial 'new measurement' button
          that.activeWidget.viewModel.newMeasurement()
          view.ui.add(that.activeWidget, 'bottom-right')
          break
        case 'area':
          let AreaMeasurement2D = await arcgisPackage.AreaMeasurement2D
          that.activeWidget = new AreaMeasurement2D({
            view: view
          })
          // skip the initial 'new measurement' button
          that.activeWidget.viewModel.newMeasurement()
          this.view.ui.add(that.activeWidget, 'bottom-right')
          break
        case null:
          if (that.activeWidget) {
            this.view.ui.remove(that.activeWidget)
            that.activeWidget.destroy()
            that.activeWidget = null
          }
          break
        default:
          break
      }
    },
    /**
     *  触发绘图功能
     *  @param ,{String} drawType - 绘制地图的类型，point，poly，polygon三个值有效
     *  @public
     **/
    async startDraw (drawType) {
      let Draw = await arcgisPackage.Draw
      if (!this.draw) {
        this.draw = new Draw({
          view: this.view
        })
      }
      let action = this.draw.create(drawType)
      switch (drawType) {
        case 'point':
          this.drawPoint(action)
          break
        case 'polyline':
          this.drawLine(action)
          break
        case 'polygon':
          this.drawPolygon(action)
          break
        default:
          console.warn('地图绘制填写的类型不正确')
      }
    },
    /**
     * @Description:绘制点的函数
     */
    async drawPoint (action) {
      // 进行绘制点
      action.on(['cursor-update', 'draw-complete'], evt => {
        this.renderPoint(evt.coordinates, evt)
      })
    },
    /**
     *  渲染点函数
     */
    async renderPoint (data, evt) {
      let Graphic = await arcgisPackage.Graphic
      // 先清除地图上的点
      this.view.graphics.removeAll()
      // 定义点
      let point = {
        type: 'point',
        x: data[0],
        y: data[1],
        spatialReference: this.view.spatialReference
      }
      let markerSymbol = {
        type: 'picture-marker', // autocasts as new SimpleMarkerSymbol()
        url: boundaryMarker,
        height: 20,
        width: 20,
        yoffset: 10,
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
        }
      }
      let graphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      })
      // console.log(graphic)
      // console.log(this.view.graphics)
      // 添加点
      this.view.graphics.add(graphic)
      this.drawGeometry = point
      if (evt.type === 'draw-complete') {
        this.drawComplete(point)
      }
    },
    /**
     * @Description: 绘制线函数
     */
    async drawLine (action) {
      // 监听绘制过程的函数
      action.on(['vertex-add', 'vertex-remove', 'cursor-update', 'draw-complete'], evt => {
        this.renderLine(evt.vertices, evt)
      })
    },
    /**
     *  渲染线函数
     */
    async renderLine (data, evt) {
      let Graphic = await arcgisPackage.Graphic
      // 清空图层
      this.view.graphics.removeAll()
      let polyline = {
        type: 'polyline',
        paths: data,
        spatialReference: this.view.spatialReference
      }
      let graphic = new Graphic({
        geometry: polyline,
        symbol: {
          type: 'simple-line', // autocasts as new SimpleFillSymbol
          color: [51, 133, 255],
          width: 2,
          cap: 'round',
          join: 'round'
        }
      })
      // 将折线添加到地图上
      this.view.graphics.add(graphic)
      this.drawGeometry = polyline
      if (evt.type === 'draw-complete') {
        this.drawComplete(polyline)
      }
    },
    /**
     * @Description: 绘制多边形
     */
    async drawPolygon (action) {
      // 定义绘制事件
      action.on(['vertex-add', 'vertex-remove', 'cursor-update', 'draw-complete'], evt => {
        this.renderPolygon(evt.vertices, evt)
      })
    },
    /**
     *  渲染多边形
     */
    async renderPolygon (data, evt) {
      let Graphic = await arcgisPackage.Graphic
      // 清除图层
      this.view.graphics.removeAll()
      // 绘制多边形
      let polygon = {
        type: 'polygon', // autocasts as Polygon
        rings: data,
        spatialReference: this.view.spatialReference
      }
      // polygon = WebMercatorUtils.webMercatorToGeographic(polygon)
      let graphic = new Graphic({
        geometry: polygon,
        symbol: {
          type: 'simple-fill', // autocasts as SimpleFillSymbol
          color: [51, 133, 255, 0.5],
          style: 'solid',
          outline: {
            color: [51, 133, 255, 0.8],
            width: 1
          }
        }
      })
      this.view.graphics.add(graphic)
      this.drawGeometry = polygon
      if (evt.type === 'draw-complete') {
        this.drawComplete(polygon)
      }
    },
    /* 返回地图绘制结果 */
    drawComplete (drawGeometry) {
      /**
       * 绘制完成事件
       * @property {Geometry} 绘制的geometry对象
       * */
      this.$emit('drawcomplete', drawGeometry)
    },
    /**
     * 用于使地图视图定位某个位置
     * @param {(Geometry|Graphic)} target - 定位的要素
     * @public
     * */
    goto (target) {
      this.view.goTo(target)
    },
    /* 用于将图层加载到地图上 */
    addLayers (layerarr) {
      if (this.map && layerarr) {
        this.map.layers.removeAll()
        layerarr = layerarr.filter(val => {
          return val
        })
        this.map.layers.addMany(layerarr)
      }
    }
  },
  mounted () {
    this.mapId = 'mapview' + this._uid
    this.createMap()
  }
}

</script>

<style scoped>

</style>

<docs>
  对arcgis进行封装，能够快速建设地图相关内容
  #### 简单示例
  ```vue
  <template>
    <div style="height: 500px">
      <ArcgisMap></ArcgisMap>
    </div>
  </template>
  <script>
    export default {}
  </script>
  ```
</docs>
