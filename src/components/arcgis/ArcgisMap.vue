<template>
  <div class="arcgis" id="mapbox">
    <!--  地图view  -->
    <div id="viewDiv" ref="viewDiv" style="width: 100%; height: 100%"></div>
    <!--  地图view  -->

    <!--  比例尺  -->
    <div id="scaleBar">
      <p class="jwTip">{{latitude}},{{longitude}}</p>
    </div>
    <!--  比例尺  -->

    <!--  工具框  -->
    <div id="tool-bar">
      <div id="toolBar">
        <ul class="toolBar" @click="toggleMap" :class="{active: showMapBox}">
          <li class="mapType" title="切换底图" v-if="type1 === 0"><Icon type="md-images" /></li>
          <li class="mapType" title="折叠" v-else-if="type1 === 1"><Icon type="ios-fastforward-outline" style="font-size: 16px;"/></li>
        </ul>
        <ul class="toolBar" @click="toggleOperates" :class="{active: showToolBox}">
          <li class="mapType" title="测量工具" v-if="type2 === 0"><Icon type="ios-apps-outline"/></li>
          <li class="mapType" title="折叠" v-else-if="type2 === 1"><Icon type="ios-fastforward-outline" /></li>
        </ul>
      </div>
      <div class="mapBox" v-show="showMapBox">
        <div @click="toggleMapType(1)" :class="{isActive: activeMapClass1 === 1}">
          <img src="../../assets/map_images/Basemapthumbnail1.png" alt="">
          <p>矢量图</p>
        </div>
        <div @click="toggleMapType(2)" :class="{isActive: activeMapClass2 === 1}">
          <img src="../../assets/map_images/Basemapthumbnail.png" alt="">
          <p>影像图</p>
        </div>
      </div>
      <div class="mapBox1" v-show="showToolBox">
        <div @click="mapHandle(1)" :class="{isActive: activeToolClass1 === 1}" title="测量距离">
          <Icon type="ios-barcode" />
        </div>
        <div @click="mapHandle(2)" :class="{isActive: activeToolClass2 === 1}" title="测量面积">
          <Icon type="ios-calendar" style="font-size: 16px;"/>
        </div>
        <div @click="mapHandle(3)" :class="{isActive: activeToolClass3 === 1}">
          <i class="el-icon-delete" title="清除"></i>
        </div>
      </div>
    </div>
    <!--  工具框  -->
  </div>
</template>

<script>
import { loadCss } from "esri-loader";
import arcgisPackage from "@/utils/arcgisTools";
import config from "@/config/mapConfig";
import {
  tdtlayer,
  tdtyNoteslayer,
  tdtclayer,
  tdtcNoteslayer,
  redLine,
  shengjie
} from "@/utils/layers";
import Basemapthumbnail from "@/assets/map_images/Basemapthumbnail.png";
import Basemapthumbnail1 from "@/assets/map_images/Basemapthumbnail1.png";
import boundaryMarker from "@/assets/boundaryMarker_images/coll_sign3.png";
// import boundaryMarker from "@/assets/projectApproval_images/position.png";
loadCss(config.esriCss);
/**
 * 快速生成一个地图
 * */
export default {
  name: "ArcgisMap",
  data() {
    return {
      mapId: "", // 地图框的id
      map: null, // 地图map实例
      view: null, // 地图view实例
      draw: null, // 地图绘制示例
      drawGeometry: null, // 地图绘制出的结果
      grouplayer: null, // 加载在地图的数组
      mousePoint: null, // 鼠标的位置
      latitude: null,
      longitude: null,
      type: "",
      type1: 0, // 切换底图
      showMapBox: false, // 地图切换
      activeMap: 0,
      activeMapClass: 0,
      activeMapClass1: 0,
      activeMapClass2: 1,
      type2: 0, // 切换测量工具
      showToolBox: false, // 测量工具切换
      activeTool: 0,
      activeToolClass1: 0,
      activeToolClass2: 0,
      activeToolClass3: 0,
    };
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
      default: "image",
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ["vector", "image"].indexOf(value) !== -1;
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
     * arcgis底图切换工具
     * */
    basemapToggle: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    layers: async function(layerarr) {
      this.addLayers(layerarr);
    }
  },
  methods: {
    /**
     * @Description:初始化地图
     */
    async createMap() {
      // 加载arcgis地图的依赖
      let MapView = await arcgisPackage.MapView
      let Map = await arcgisPackage.Map
      let Basemap = await arcgisPackage.Basemap
      let BasemapToggle = await arcgisPackage.BasemapToggle
      let Fullscreen = await arcgisPackage.Fullscreen

      // 天地图-影像地图
      let tdtylayer = await tdtlayer().then(res => {
        return res
      });
      // 天地图-矢量地图
      let tdtylayer1 = await tdtclayer().then(res => {
        return res
      })
      // 天地图-矢量标注图层
      let tdtylayer2 = await tdtcNoteslayer().then(res => {
        return res
      })
      // 天地图-影像标注图层
      let tdtylayer3 = await tdtyNoteslayer().then(res => {
        return res
      })
      // 底图
      let customBasemap = new Basemap({
        baseLayers: [tdtylayer1, tdtylayer2],
        title: "矢量地图",
        id: "myBasemap",
        thumbnailUrl: Basemapthumbnail
      });
      let customBasemap1 = new Basemap({
        baseLayers: [tdtylayer, tdtylayer3],
        title: "影像地图",
        id: "myBasemap1",
        thumbnailUrl: Basemapthumbnail1
      })
      this.basemap = [customBasemap, customBasemap1]

      this.map = new Map({
        basemap: {
          vector: customBasemap,
          image: customBasemap1
        }[this.baseMapType]
      })
      this.view = new MapView({
        map: this.map,
        container: "viewDiv", // this.mapId,
        center: config.centerPoint,
        zoom: 11
      })
      this.$emit('created', this.map, this.view)

      // 添加鼠标移动框
      this.view.on('pointer-move', e => {
        let point = this.view.toMap({x: e.x, y: e.y});
        this.latitude = point.latitude.toFixed(6)
        this.longitude = point.longitude.toFixed(6)
      })

      // 添加比例尺
      let scaleBar = await arcgisPackage.ScaleBar
      scaleBar = new scaleBar({
        view: this.view,
        unit: 'metric'
      }, document.getElementById('scaleBar'))
      this.view.ui.add(scaleBar, 'bottom-left')

      // 添加全屏
      this.fullscreen = new Fullscreen({
        view: this.view,
      });
      this.view.ui.add(this.fullscreen, "top-right");

      this.$emit('map', this.map, this.view)

      // 底图切换
      if (this.basemapToggle) {
        let basemapToggle = new BasemapToggle({
          view: this.view,
          nextBasemap: {
            vector: customBasemap1,
            image: customBasemap
          }[this.baseMapType]
        })
        this.view.ui.add(basemapToggle, "bottom-right")
      }


      this.view.ui.add(document.getElementById("tool-bar"), "top-right")

      if (this.isSketch) {
        let GraphicsLayer = await arcgisPackage.GraphicsLayer;
        let Sketch = await arcgisPackage.Sketch;
        let sketchlayer = new GraphicsLayer({    id: 'sketchlayer'});
        this.map.layers.add(sketchlayer);
        let sketch = new Sketch({
          layer: sketchlayer,
          view: this.view,
          creationMode: "update"
        });
        this.view.ui.add(sketch, "top-right");
        sketch.on("create", e => {
          if (e.state === "complete") {
            console.log("create,?", e.tool);
            // sketchlayer.remove(e.graphic);
            /**
             * sketch组件绘制完成的时间
             * @property {Graphic} 绘制后的graphic
             * */
            // switch (e.tool) {
            //   case "point":
            //     this.startDraw("point");
            //     break;
            //   case "polyline":
            //     this.startDraw("polyline");
            //     break;
            //   case "polygon":
            //     this.startDraw("polygon");
            //     break;
            //   default:
            //     break;
            // }
            this.$emit("sketchcreatecomplete", e.graphic);
          }
        });
      }
    },
    /**
     * @Description:切换地图
     */
    toggleMap () {
      if (this.type1 === 1) {
        this.type1 = 0
        this.showMapBox = false
      } else {
        this.type1 = 1
        this.showMapBox = true
        /*当显示地图切换弹窗关闭操作弹窗及清空操作*/
        this.type2 = 0
        this.activeToolClass1 = 0
        this.activeToolClass2 = 0
        this.activeToolClass3 = 0
        this.showToolBox = false
        this.setActiveWidget(null)
        // // 关闭打印
        // this.showPrint = false
        // this.removePrint()
        // // 关闭统计
        // this.type5 = 0
        // this.showStatisticAnalysis = false
      }
    },
    /**
     * @Description:切换测量工具
     */
    toggleOperates () {
      if (this.type2 === 1) {
        this.type2 = 0
        this.activeToolClass1 = 0
        this.activeToolClass2 = 0
        this.activeToolClass3 = 0
        this.showToolBox = false
        this.setActiveWidget(null)
      } else {
        this.type2 = 1
        this.showToolBox = true
        /*当显示操作弹窗关闭操作地图切换弹窗*/
        this.type1 = 0
        this.showMapBox = false
        // // 关闭打印
        // this.showPrint = false
        // this.removePrint()
        // // 关闭统计
        // this.type5 = 0
        // this.showStatisticAnalysis = false
      }
    },

    mapHandle (n) {
      if (n === 1) {
        if (this.activeToolClass1 === 0) {
          this.activeToolClass1 = 1
          this.setActiveWidget(null)
          this.setActiveWidget('distance')
        } else {
          this.activeToolClass1 = 0
          this.setActiveWidget(null)
        }
        this.activeToolClass2 = 0
        this.activeToolClass3 = 0
      } else if (n === 2) {
        if (this.activeToolClass2 === 0) {
          this.activeToolClass2 = 1
          this.setActiveWidget(null)
          this.setActiveWidget('area')
        } else {
          this.activeToolClass2 = 0
          this.setActiveWidget(null)
        }
        this.activeToolClass1 = 0
        this.activeToolClass3 = 0
      } else if (n === 3) {
        if (this.activeToolClass3 === 0) {
          this.activeToolClass3 = 1
          this.setActiveWidget(null)
        } else {
          this.activeToolClass3 = 0
          this.setActiveWidget(null)
        }
        this.activeToolClass1 = 0
        this.activeToolClass2 = 0
      }
    },

    toggleMapType (n) {
      if (n === 1) {
        this.activeMapClass1 = 1
        this.activeMapClass2 = 0
        this.getTdtBasemap(0)
      } else if (n === 2) {
        this.activeMapClass2 = 1
        this.activeMapClass1 = 0
        this.getTdtBasemap(1)
      }
    },

    /**
     * @Description:切换地图
     */
    getTdtBasemap(num) {
      this.map.basemap = this.basemap[num]
    },
    /**
     * 测距测面
     * @param  type distance或area 为null时清空
     */
    async setActiveWidget(type) {
      let view = this.view
      let that = this
      if (that.activeWidget) {
        view.ui.remove(that.activeWidget);
        that.activeWidget.destroy();
        that.activeWidget = null;
      }
      switch (type) {
        case "distance":
          let DistanceMeasurement2D = await arcgisPackage.DistanceMeasurement2D;
          that.activeWidget = new DistanceMeasurement2D({
            view: view
          });
          // skip the initial 'new measurement' button
          that.activeWidget.viewModel.newMeasurement();
          view.ui.add(that.activeWidget, "bottom-right");
          break;
        case "area":
          let AreaMeasurement2D = await arcgisPackage.AreaMeasurement2D;
          that.activeWidget = new AreaMeasurement2D({
            view: view
          });
          // skip the initial 'new measurement' button
          that.activeWidget.viewModel.newMeasurement();
          this.view.ui.add(that.activeWidget, "bottom-right");
          break;
        case null:
          if (that.activeWidget) {
            this.view.ui.remove(that.activeWidget);
            that.activeWidget.destroy();
            that.activeWidget = null;
          }
          break;
        default:
          break;
      }
    },
    /* 测量工具点击事件 */
    async clickToolbar(type) {
      if (this.type === type) {
        type = null;
      }
      this.type = type;
      if (this.activeWidget) {
        this.view.ui.remove(this.activeWidget);
        this.activeWidget.destroy();
        this.activeWidget = null;
      }
      switch (type) {
        case "distance":
          let DistanceMeasurement2D = await arcgisPackage.DistanceMeasurement2D;
          this.activeWidget = new DistanceMeasurement2D({
            view: this.view
          });
          this.activeWidget.viewModel.newMeasurement();
          this.view.ui.add(this.activeWidget, "top-right");
          break;
        case "area":
          let AreaMeasurement2D = await arcgisPackage.AreaMeasurement2D;
          this.activeWidget = new AreaMeasurement2D({
            view: this.view
          });
          this.activeWidget.viewModel.newMeasurement();
          this.view.ui.add(this.activeWidget, "top-right");
          break;
        case "point":
          this.startDraw("point");
          break;
        default:
          break;
      }
    },
    /**
     * @Description:添加红线图层
     */
    async addRedline() {
      let layerRedLine = await redLine().then(res => {
        return res;
      });
      this.map.add(layerRedLine);
    },
    /**
     * @Description:添加省界
     */
    async addProvinceLayer() {
      let layerProvince = await shengjie().then(res => {
        return res;
      });
      this.map.add(layerProvince);
    },
    /**
     * @Description:面积转换
     */
    async cacuCoordinates(view, val) {
      let geometryEngine = await arcgisPackage.geometryEngine;
      let GeometryService = await arcgisPackage.GeometryService;
      let AreasAndLengthsParameters = await arcgisPackage.AreasAndLengthsParameters;
      if (view.spatialReference.isWSG84) {
        return geometryEngine.geodesicArea(val, "square-meters").toFixed(2);
      } else {
        let geometryService = new GeometryService({
          url: config.geometryServerUrl
        });
        let areasAndLengths = await geometryService.areasAndLengths(
          new AreasAndLengthsParameters({
            calculationType: "geodesic",
            areaUnit: "square-meters",
            lengthUnit: "kilometers",
            polygons: [val]
          })
        );
        return areasAndLengths.areas[0].toFixed(2);
      }
    },

    /**
     *  触发绘图功能
     *  @param ,{String} drawType - 绘制地图的类型，point，poly，polygon三个值有效
     *  @public
     **/
    async startDraw(drawType) {
      let Draw = await arcgisPackage.Draw;
      if (!this.draw) {
        this.draw = new Draw({
          view: this.view
        });
      }
      let action = this.draw.create(drawType);
      console.log("drawType:", drawType, action);

      switch (drawType) {
        case "point":
          this.drawPoint(action);
          break;
        case "polyline":
          this.drawLine(action);
          break;
        case "polygon":
          this.drawPolygon(action);
          break;
        default:
          console.warn("地图绘制填写的类型不正确");
      }
    },
    /**
     * @Description:绘制点的函数
     */
    async drawPoint(action) {
      // 进行绘制点
      action.on(["cursor-update", "draw-complete"], evt => {
        this.renderPoint(evt.coordinates, evt);
      });
    },
    /**
     *  渲染点函数
     */
    async renderPoint(data, evt) {
      let Graphic = await arcgisPackage.Graphic;
      // 先清除地图上的点
      this.view.graphics.removeAll();
      // 定义点
      let point = {
        type: "point",
        x: data[0],
        y: data[1],
        spatialReference: this.view.spatialReference
      };
      let markerSymbol = {
        type: "picture-marker", // autocasts as new SimpleMarkerSymbol()
        url: boundaryMarker,
        height: 20,
        width: 20,
        yoffset: 10,
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
        }
      };
      let graphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      })
      // 添加点
      this.view.graphics.add(graphic);
      this.drawGeometry = point;
      if (evt.type === "draw-complete") {
        this.drawComplete(point)
      }
    },
    /**
     * @Description: 绘制线函数
     */
    async drawLine(action) {
      // 监听绘制过程的函数
      action.on(
        ["vertex-add", "vertex-remove", "cursor-update", "draw-complete"],
        evt => {
          this.renderLine(evt.vertices, evt);
        }
      );
    },
    /**
     *  渲染线函数
     */
    async renderLine(data, evt) {
      let Graphic = await arcgisPackage.Graphic;
      // 清空图层
      this.view.graphics.removeAll();
      let polyline = {
        type: "polyline",
        paths: data,
        spatialReference: this.view.spatialReference
      };
      let graphic = new Graphic({
        geometry: polyline,
        symbol: {
          type: "simple-line", // autocasts as new SimpleFillSymbol
          color: [51, 133, 255],
          width: 2,
          cap: "round",
          join: "round"
        }
      });
      // 将折线添加到地图上
      this.view.graphics.add(graphic);
      this.drawGeometry = polyline;
      if (evt.type === "draw-complete") {
        this.drawComplete(polyline);
      }
    },
    /**
     * @Description: 绘制多边形
     */
    async drawPolygon(action) {
      // 定义绘制事件
      action.on(
        ["vertex-add", "vertex-remove", "cursor-update", "draw-complete"],
        evt => {
          this.renderPolygon(evt.vertices, evt);
        }
      );
    },
    /**
     *  渲染多边形
     */
    async renderPolygon(data, evt) {
      let Graphic = await arcgisPackage.Graphic;
      // 清除图层
      this.view.graphics.removeAll();
      // 绘制多边形
      let polygon = {
        type: "polygon", // autocasts as Polygon
        rings: data,
        spatialReference: this.view.spatialReference
      };
      // polygon = WebMercatorUtils.webMercatorToGeographic(polygon)
      let graphic = new Graphic({
        geometry: polygon,
        symbol: {
          type: "simple-fill", // autocasts as SimpleFillSymbol
          color: [51, 133, 255, 0.5],
          style: "solid",
          outline: {
            color: [51, 133, 255, 0.8],
            width: 1
          }
        }
      });
      this.view.graphics.add(graphic);
      this.drawGeometry = polygon;
      if (evt.type === "draw-complete") {
        this.drawComplete(polygon);
      }
    },
    /* 返回地图绘制结果 */
    drawComplete(drawGeometry) {
      /**
       * 绘制完成事件
       * @property {Geometry} 绘制的geometry对象
       * */
      this.$emit("drawcomplete", drawGeometry);
    },
    /**
     * 用于使地图视图定位某个位置
     * @param {(Geometry|Graphic)} target - 定位的要素
     * @public
     * */
    goto(target) {
      this.view.goTo(target);
    },
    /* 用于将图层加载到地图上 */
    addLayers(layerarr) {
      if (this.map && layerarr) {
        this.map.layers.removeAll();
        layerarr = layerarr.filter(val => {
          return val;
        });
        this.map.layers.addMany(layerarr);
      }
    },
    clearWidget() {
      this.type = ''
      this.activeWidget && this.activeWidget.destroy()
      this.view.graphics.removeAll()
      this.activeWidget = null
    }
  },
  mounted() {
    this.mapId = "mapview" + this._uid;
    let { longitude, latitude } = config.centerPoint
    this.longitude = longitude
    this.latitude = latitude
    this.createMap()
  }
};
</script>
<style lang="scss" scoped>
  .arcgis {
    width: 100%;
    height: 100%;
    #scaleBar {
      min-width: 100px;
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(255,255,255,.8);
      padding: 20px 10px 10px 10px;
      ::v-deep .esri-scale-bar__bar-container {
        position: absolute;
        top: 20px;
        left: 10px;
      }
      .blTip {
        margin: 25px 0 0;
        span {
          font-weight: bold;
          color: #00a1ff;
        }
      }
      .jwTip {
        margin: 25px 0 0;
      }
    }

    #toolBar {
      position: absolute;
      top: 45Px;
      right: 0Px;
      li {
        cursor: pointer;
        background-color: #fff;
        color: #6e6e6e;
        width: 32Px;
        height: 32Px;
        margin-bottom: 10Px;
        line-height: 32Px;
        text-align: center;
        box-shadow: 0px 0px 20Px 0Px rgba(34, 44, 72, 0.2);
        i {
          font-size: 20Px;
        }
      }
      .active {
        li {
          color: #0079c1;
        }
      }
    }

    .mapBox {
      position: absolute;
      top: 45Px;
      right: 60Px;
      background: #fff;
      padding: 15Px;
      overflow: hidden;
      div {
        padding: 12Px;
        float: left;
        img {
          width: 64Px;
          height: 64Px;
        }
        p {
          width: 64Px;
          text-align: center;
          color: #6e6e6e;
          font-size: 12Px;
          margin-bottom: 0;
          margin-top: 5Px;
        }
        &:hover {
          background-color: #f2f2f2;
        }
        &.isActive {
          border: 1px solid #0079c1;
          background-color: rgba(225,241,251,.5);
        }
      }
    }
    .mapBox1 {
      position: absolute;
      top: 90Px;
      right: 60Px;
      background: #fff;
      padding: 10Px;
      div {
        width: 30Px;
        height: 30Px;
        text-align: center;
        line-height: 30Px;
        &:hover {
          background-color: #f2f2f2;
        }
        &.isActive {
          border: 1Px solid #0079c1;
          background-color: rgba(225,241,251,.5);
        }
      }
    }
  }

</style>
