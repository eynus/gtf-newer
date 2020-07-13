<template>
  <div id="onePicture">
    <el-tabs type="border-card">
      <el-tab-pane label="图层">
        <!--<p class="title">基础地理</p>
        <el-tree v-show="navTree" class="treeEl" id="tree1" :data="allData" show-checkbox node-key="id"
                 :default-expanded-keys="[]" :default-checked-keys="treeShow" :props="defaultProps" @check-change="getNodeClick" :render-content="renderContent">
        </el-tree>-->
        <p class="title mt25">生态系统质量分析</p>
        <el-tree v-show="navTree1" class="treeEl" id="tree2" :data="treeData1" show-checkbox node-key="id"
                 :default-expanded-keys="[]" :default-checked-keys="treeShow1" :props="defaultProps1" @check-change="getNodeClick1" :render-content="renderContent1" :check-strictly=true>
        </el-tree>
      </el-tab-pane>
      <el-tab-pane label="图例">

      </el-tab-pane>
    </el-tabs>
    <div id="map">
      <div id="scaleBar">
        <p  class="jwTip">{{latitude}},{{longitude}}</p>
      </div>
      <div id="toolBar">
        <ul class="toolBar" @click="toggleMap" :class="{active: showMapBox}">
          <li class="mapType" title="切换地图" v-if="type1 === 0"><i class="iconfont icon-tupian"></i></li>
          <li class="mapType" title="折叠" v-else-if="type1 === 1"><i class="iconfont icon-shousuo"></i></li>
        </ul>
        <ul class="toolBar" @click="toggleOperates" :class="{active: showToolBox}">
          <li class="mapType" title="测量工具" v-if="type2 === 0"><i class="iconfont icon-tool-measure"></i></li>
          <li class="mapType" title="折叠" v-else-if="type2 === 1"><i class="iconfont icon-shousuo"></i></li>
        </ul>
        <ul class="toolBar" @click="handlePrint" :class="{active: showPrint}">
          <li class="mapType" title="打印"><span class="iconfont">&#xe620;</span></li>
        </ul>
        <ul class="toolBar" @click="reset">
          <li class="mapType" title="还原"><span class="iconfont">&#xe60a;</span></li>
        </ul>
        <ul class="toolBar" @click="statisticAnalysis"  :class="{active: showStatisticAnalysis}">
          <li class="mapType" title="统计"><span class="el-icon-data-analysis"></span></li>
        </ul>
      </div>
      <div class="mapBox" v-show="showMapBox">
        <div @click="toggleMapType(1)" :class="{isActive: activeMapClass1 === 1}">
          <img src="../../assets/images/onePicture/Basemapthumbnail1.png" alt="">
          <p>矢量图</p>
        </div>
        <div @click="toggleMapType(2)" :class="{isActive: activeMapClass2 === 1}">
          <img src="../../assets/images/onePicture/Basemapthumbnail.png" alt="">
          <p>影像图</p>
        </div>
      </div>
      <div class="mapBox1" v-show="showToolBox">
        <div @click="mapHandle(1)" :class="{isActive: activeToolClass1 === 1}">
          <i class="iconfont icon-juli" title="测距离"></i>
        </div>
        <div @click="mapHandle(2)" :class="{isActive: activeToolClass2 === 1}">
          <i class="iconfont icon-mianji" title="测面积" style="font-size: 16px;"></i>
        </div>
        <div @click="mapHandle(3)" :class="{isActive: activeToolClass3 === 1}">
          <i class="el-icon-delete" title="清除"></i>
        </div>
      </div>
      <div class="mapBox4" v-show="showStatisticAnalysis">
        <article id="charts"></article>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import arcgisPackage from '@/utils/arcgisTools'
  import config from '@/setting/mapConfig'
  import {
    getTdtBasemap
  } from '@/utils/TdtMap'
  import {
    getGooleBasemap
  } from '@/utils/GooleMap'
  // 导入接口
  import {
    listTreeSt4SysSg // 查询tree数据
  } from '@/api/ProtectData'
  import {
    listSpaceDataTree // 查询tree数据
  } from '@/api/SpaceData'
  // 导入接口
  import {
    listLedgerzg
  } from '@/api/statisticAnalysis'
  let map = null
  let view = null
  let arcgisPackageArr = {}
  let legendArr = []
  let zoomCenter//中心点四至
  export default {
    name: 'pattern-spot',
    components: {},
    data () {
      return {
        navTree: true, // 默认显示树形数据
        listTree: [], // 返回全部数据
        treeData: [], // tree数组
        treeShow: [], // 回显树结构数据
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        childUrl: '', // 子节点url
        latitude: '116.427265', // 实时经度
        longitude: '40.005854', // 实时纬度
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
        showPrint: false, // 是否显示打印
        print: null, // 打印
        /*空间数据树*/
        navTree1: true, // 默认显示树形数据
        listTree1: [], // 返回全部数据
        treeData1: [], // tree数组
        treeShow1: [], // 回显树结构数据
        defaultProps1: {
          children: 'children',
          label: 'label'
        },
        childUrl1: '', // 子节点url
        tempData: [], // 当ct007=0时的数组
        tempData2: [], // 新数组
        allData: [],
        allListTree: [],
        // 统计弹窗
        type5: 0, // 切换查询
        showStatisticAnalysis: false,
        parameterChartsData: []
      }
    },
    computed: {
      // 台账整改情况
      xArrs: function () {
        let arr = []
        for (let item of this.parameterChartsData) {
          arr.push(item.name)
        }
        return arr
      },
      valNum: function () {
        let Arr = []
        for (let item of this.parameterChartsData) {
          Arr.push(item.value)
        }
        return Arr
      },
    },
    mounted () {
      this.createMap()
      this.treeList()
      this.treeList1()
      this.getListzg()
    },
    methods: {
      /**
       * @Description:初始化地图的函数
       */
      async createMap () {
        // 加载arcgis地图的依赖
        // 取出arcgis中需要的类
        arcgisPackageArr.esriConfig = await arcgisPackage.esriConfig
        arcgisPackageArr.MapImageLayer = await arcgisPackage.MapImageLayer
        arcgisPackageArr.BasemapGallery = await arcgisPackage.BasemapGallery
        arcgisPackageArr.Expand = await arcgisPackage.Expand
        arcgisPackageArr.Fullscreen = await arcgisPackage.Fullscreen
        arcgisPackageArr.Map = await arcgisPackage.Map
        arcgisPackageArr.MapView = await arcgisPackage.MapView
        arcgisPackageArr.LayerList = await arcgisPackage.LayerList
        arcgisPackageArr.DistanceMeasurement2D = await arcgisPackage.DistanceMeasurement2D
        arcgisPackageArr.AreaMeasurement2D = await arcgisPackage.AreaMeasurement2D
        arcgisPackageArr.Print = await arcgisPackage.Print
        arcgisPackageArr.Compass = await arcgisPackage.Compass
        arcgisPackageArr.PictureMarkerSymbol = await arcgisPackage.PictureMarkerSymbol
        arcgisPackageArr.FeatureLayer = await arcgisPackage.FeatureLayer
        arcgisPackageArr.Graphic = await arcgisPackage.Graphic
        arcgisPackageArr.Polyline = await arcgisPackage.Polyline
        arcgisPackageArr.GraphicsLayer = await arcgisPackage.GraphicsLayer
        arcgisPackageArr.GeoJSONLayer = await arcgisPackage.GeoJSONLayer
        arcgisPackageArr.Field = await arcgisPackage.Field
        arcgisPackageArr.Geoprocessor = await arcgisPackage.Geoprocessor
        arcgisPackageArr.FeatureSet = await arcgisPackage.FeatureSet
        arcgisPackageArr.Legend = await arcgisPackage.Legend
        arcgisPackageArr.HeatmapRenderer = await arcgisPackage.HeatmapRenderer
        arcgisPackageArr.QueryTask = await arcgisPackage.QueryTask
        arcgisPackageArr.Query = await arcgisPackage.Query
        arcgisPackageArr.Point = await arcgisPackage.Point
        arcgisPackageArr.ScaleBar = await arcgisPackage.ScaleBar
          arcgisPackageArr.esriConfig.request.corsEnabledServers.push('*') // 设置地图服务器已允许跨域
        map = null
        map = new arcgisPackageArr.Map({
          basemap: 'dark-gray'
        })
        view = null
        view = new arcgisPackageArr.MapView({
          map: map,
          container: 'map',
          center: [116.427265,40.005854],
          zoom: 8,
          constraints: {
            minZoom: 4,
            maxZoom: 18
          }
        })
        view.ui._removeComponents(["attribution"]);
        // 增加比例尺
        let scaleBar = new arcgisPackageArr.ScaleBar({
          view: view,
          unit: 'metric'
        },document.getElementById('scaleBar'));
        view.ui.add(scaleBar, {
          position: 'bottom left'
        })

        view.ui._removeComponents(["attribution"]);
        view.on('pointer-move', e => {
          let point = view.toMap({x: e.x, y: e.y});
          this.latitude = point.latitude.toFixed(6)
          this.longitude = point.longitude.toFixed(6)
        })
        this.getTdtBasemap(1)
        this.createMapImageLayerFromServer(config.serverUrl + '/arcgis/rest/services/bjhky/北京行政区边界/MapServer', 'shengjie','北京行政区边界')
        //图例菜单下的
        let legend2 = arcgisPackageArr.Legend({
          view: view,//组件所属的地图视图
          container: "pane-1"
        });
      },
      /**
       * 设置天地图底图
       * @param  num 0(矢量图)  1(影像图)  2(地形图)
       * @param
       * @param
       */
      getTdtBasemap(num) {
        getTdtBasemap().then(e => {
          map.basemap = e.getItemAt(num)
        })
      },
      /**
       * 设置谷歌地图底图
       * @param  num 0(矢量图)  1(影像图)  2(地形图)
       * @param
       * @param
       */
      getGooleBasemap(num) {
        getGooleBasemap().then(e => {
          map.basemap = e.getItemAt(num)
        })
      },
      /**
       * 使用MapImageLayer渲染地图服务
       * @param type 图层类型
       * @param url 图层服务
       * @param layerid 图层id
       * @param layerTitle 图层标题
       */
      createMapImageLayerFromServer(url, layerid,title) {
        let fLayerFlag = map.findLayerById(layerid)
        if (fLayerFlag) {
          map.remove(fLayerFlag)
        }
        if(title == undefined){
          title = ''
        }
        let mapimagelayer = new arcgisPackageArr.MapImageLayer({
          url: url,
          title:title,
          id: layerid
        })

        map.add(mapimagelayer)
        mapimagelayer.on('layerview-create', (event) => {
          view.extent = mapimagelayer.fullExtent.expand(1.3) // 定位图层
          if(layerid == "shengjie"){
            zoomCenter = view.extent
          }
        })
      },
      // 移出图层
      removeLayer(layerid) {
        let fLayerFlag = map.findLayerById(layerid)
        if (fLayerFlag) {
          map.remove(fLayerFlag)
        }
      },
      /**
       * 测距测面
       * @param  type distance或area 为null时清空
       * @param
       * @param
       */
      setActiveWidget(type) {
        let that = this
        switch (type) {
          case 'distance':
            that.activeWidget = new arcgisPackageArr.DistanceMeasurement2D({
              view: view
            })
            // skip the initial 'new measurement' button
            that.activeWidget.viewModel.newMeasurement()
            view.ui.add(that.activeWidget, 'bottom-right')
            break
          case 'area':
            that.activeWidget = new arcgisPackageArr.AreaMeasurement2D({
              view: view
            })
            // skip the initial 'new measurement' button
            that.activeWidget.viewModel.newMeasurement()
            view.ui.add(that.activeWidget, 'bottom-right')
            break
          case null:
            if (that.activeWidget) {
              view.ui.remove(that.activeWidget)
              that.activeWidget.destroy()
              that.activeWidget = null
            }
            break
          default:
            break
        }
      },
      /* 添加地图导出文件 */
      async addPrint () {
        this.print = new arcgisPackageArr.Print({
          view: view,
          printServiceUrl: config.ArcGISServerUrl +
            '/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
        })
        view.ui.add(this.print, 'bottom-right')
      },
      removePrint () {
        if (this.print) {
          this.print.destroy()
        }
      },
      /**
       * 重置
       * @param
       * @param
       * @param
       */
      reset() {
        // (view)
        /*view.center = [116.427265,40.005854]
        view.zoom = 8*/
        view.extent = zoomCenter
      },
      /**
       * 导出
       * @param
       * @param
       * @param
       */
      handlePrint () {
        if (this.showPrint) {
          this.removePrint()
          this.showPrint = false
        } else {
          this.addPrint()
          this.showPrint = true
          this.type1 = 0
          this.showMapBox = false
          this.type2 = 0
          this.activeToolClass1 = 0
          this.activeToolClass2 = 0
          this.activeToolClass3 = 0
          this.showToolBox = false
          this.setActiveWidget(null)
          this.type5 = 0
          this.showStatisticAnalysis = false
        }
      },
      // 查询空间数据tree列表
      treeList () {
        let params = {
          'data': {}
        }
        listTreeSt4SysSg(params).then(res => {
          if (res.status === 1000) {
            this.listTree = res.data
            this.treeData = []
            this.listTree.forEach(element => {
              let arr = []
              element.reserveData.forEach(i => {
                let sd008 = ''
                let sm002 = ''
                let sn002 = ''
                if (i.adminRegion !== null && i.adminRegion.sd008 !== null) {
                  sd008 = i.adminRegion.sd008
                } else {
                  sd008 = ''
                }
                if (i.reserveType !== null && i.reserveType.sm002 !== null) {
                  sm002 = i.reserveType.sm002
                } else {
                  sm002 = ''
                }
                if (i.reserveRank !== null && i.reserveRank.sn002 !== null) {
                  sn002 = i.reserveRank.sn002
                } else {
                  sn002 = ''
                }
                arr.push({
                  id: i.sg001,
                  label: i.sg008,
                  sg008: i.sg008,
                  sg011: i.sg011,
                  sn002: sn002,
                  sd008: sd008,
                  sm002: sm002,
                  sg017: i.sg017,
                  sg013: i.sg013,
                  sg018: i.sg018,
                  sg020: i.sg020,
                  sg021: i.sg021,
                  sg006: i.sg006,
                  children: []
                })
              })
              let sd008s = ''
              let sm002s = ''
              let sn002s = ''
              if (element.adminRegion !== undefined && element.adminRegion.sd008 !== undefined) {

                sd008s = element.adminRegion.sd008
              } else {
                sd008s = ''
              }
              if (element.reserveType !== undefined && element.reserveType.sm002 !== undefined) {
                sm002s = element.reserveType.sm002
              } else {
                sm002s = ''
              }
              if (element.reserveRank !== undefined && element.reserveRank.sn002s !== undefined) {
                sn002s = element.reserveRank.sn002s
              } else {
                sn002s = ''
              }
              this.treeData.push({
                id: element.sn001,
                label: element.sn002  + "自然保护地",
                sg008: element.sg008, // 保护地名称
                sn002: sn002s, // 保护地级别
                sg011: element.sg011, // 面积
                sd008: sd008s, // 行政区划
                sm002: sm002s, // 保护地类型
                sg017: element.sg017, // 始建时间
                sg013: element.sg013, // 主要保护对象
                sg018: element.sg018, // 主管部门
                sg020: element.sg020, // 主管部门联系人
                sg021: element.sg021, // 主管部门联系人电话
                sg006: element.sg006, // 备注
                children: arr
              })
              this.allData = this.treeData
              console.log(this.allData)
              this.allListTree = this.listTree
            })
          }
        })
        listSpaceDataTree({data: {ct007: 0}}).then(res => {
          if (res.status === 1000) {
            this.tempData = []
            this.tempData = res.data
            this.tempData2 = []
            this.tempData.forEach(element => {
              let arr = []
              element.children.forEach(i => {
                arr.push({
                  id: i.ct001,
                  label: i.ct003,
                  children: []
                })
              })
              this.tempData2.push({
                id: element.ct001,
                label: element.cts002,
                children: arr
              })
            })
            this.allData = this.allData.concat(this.tempData2)
            this.allListTree = this.allListTree.concat(this.tempData)
          }
        })
      },
      // 获取树形菜单选中值
      getNodeClick (val, isChecked, children) {
        this.listTree.forEach(element => {
          if (element.reserveData) {
            element.reserveData.forEach(i => {
              if (i.sg001 === val.id) {
                this.childUrl = i.reserveUrl.cs004
              }
            })
          } else if (element.children) {
            element.children.forEach(i => {
              if (i.ct001 === val.id) {
                this.childUrl = i.ct004
              }
            })
          }
        })
        if(isChecked){
          this.createMapImageLayerFromServer(this.childUrl, 'layer' + val.id.toString(),val.label)
          //构造图例的组件
          let legend = arcgisPackageArr.Legend({
            view: view,//组件所属的地图视图
            layerInfos: [{//图例显示那些图层的图例
              layer: map.findLayerById("layer" + val.id),
              //title: ""
            }],
            id:val.id + "sgLegend",
            container: val.id + "sg"
          });
          legendArr.push(legend)
        }else{
          this.removeLayer('layer' + val.id.toString())
          $("#" + val.id + "sg").find(".esri-legend__message").remove();
          /*  for(let i = 0 ; i < legendArr.length ; i++){
              if(legendArr[i].id == val.id + "sgLegend"){
                legendArr[i].destroy();
              }
            }*/
        }
      },
      // 自定义分类树节点
      renderContent(h, { node, data, store }) {
        if (data.children.length === 0) {
          return (
            <div style="display: block;white-space: nowrap;"  ><span title={data.label} style="white-space: normal;">{data.label}</span>
            <div id={data.id + "sg"}></div>
            </div>
        )
        } else {
          return (
            <span style="display: block;white-space: nowrap;"  title={data.label} style="white-space: normal;">{data.label}</span>
        )
        }

      },
      // 自定义分类树节点
      renderContent1(h, { node, data, store }) {
        if (data.children.length === 0) {
          return (
            <div style="display: block;white-space: nowrap;"><span  title={data.label} style="white-space: normal;">{data.label}</span>
            <div id={data.id + "space"}></div>
            </div>
        )
        } else {
          return (
            <span style="display: block;white-space: nowrap;"  title={data.label} style="white-space: normal;">{data.label}</span>
        )
        }
      },
      // 切换地图
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
          // 关闭打印
          this.showPrint = false
          this.removePrint()
          // 关闭统计
          this.type5 = 0
          this.showStatisticAnalysis = false
        }
      },
      toggleMapType (n) {
        if (n === 1) {
          this.activeMapClass1 = 1
          this.activeMapClass2 = 0
          this.getGooleBasemap(0)
        } else if (n === 2) {
          this.activeMapClass2 = 1
          this.activeMapClass1 = 0
          this.getGooleBasemap(1)
        }
      },
      // 切换测量工具
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
          // 关闭打印
          this.showPrint = false
          this.removePrint()
          // 关闭统计
          this.type5 = 0
          this.showStatisticAnalysis = false
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
      // 查询空间数据tree列表
      treeList1 () {
        let params = {
          'data': {
            ct007: 1
          }
        }
        this.treeData1.push({
          id: 1,
          label: 1,
          children: [
            {
              id: 2,
              label: 2,
            },
            {
              id: 3,
              label: 3,
            },
            {
              id: 4,
              label: 4,
            }
          ]
        })
        listSpaceDataTree(params).then(res => {
          if (res.status === 1000) {
            this.listTree1 = res.data
            this.treeData1 = []
            this.listTree1.forEach(element => {
              let arr = []
              element.children.forEach(i => {
                arr.push({
                  id: i.ct001,
                  label: i.ct003,
                  children: []
                })
              })
              this.treeData1.push({
                id: element.ct001,
                label: element.cts002,
                children: arr
              })
            })
          }
        })
      },
      // 获取树形菜单选中值
      getNodeClick1 (val, isChecked, children) {
        this.listTree1.forEach(element => {
          element.children.forEach(i => {
            if (i.ct001 === val.id) {
              this.childUrl1 = i.ct004
            }
          })
        })

        // isChecked ? this.createMapImageLayerFromServer(this.childUrl1, val.id.toString()) : this.removeLayer(val.id.toString())
        if(isChecked){
          this.createMapImageLayerFromServer(this.childUrl1, 'layer' + val.id.toString(),val.label)
          //构造图例的组件
          let legend = arcgisPackageArr.Legend({
            view: view,//组件所属的地图视图
            layerInfos: [{//图例显示那些图层的图例
              layer: map.findLayerById("layer" + val.id),
              title: ""
            }],
            id:val.id + "spaceLegend",
            container: val.id + "space"
          });
        }else{
          this.removeLayer('layer' + val.id.toString())
          $("#" + val.id + "space").find(".esri-legend__message").remove();
        }
      },
      // 显示统计
      statisticAnalysis () {
        if (this.type5 === 0) {
          this.type5 = 1
          this.showStatisticAnalysis = true
          this.type1 = 0
          this.showMapBox = false
          /*当显示地图切换弹窗关闭操作弹窗及清空操作*/
          this.type2 = 0
          this.activeToolClass1 = 0
          this.activeToolClass2 = 0
          this.activeToolClass3 = 0
          this.showToolBox = false
          this.setActiveWidget(null)
          // 关闭打印
          this.showPrint = false
          this.removePrint()
        } else {
          this.type5 = 0
          this.showStatisticAnalysis = false
        }
      },
      /* 整改情况数据统计、点位获取 */
      getListzg () {
        let params = {
          'data': {
            st4ScsCl: {
              cl001: '', // 台账批次
              cl011: '' // 下发级别
            },
            st4SysSd: { // 行政区
              sd001: ''
            },
            st4SysSg: { // 保护地
              sg001: ''
            },
            ck005: '', // 所在功能区
            ck016: '', // 下发问题类型
            ck013: '', // 变化类型
            ck078: '', // 台账来源
            ck006: '', // 实际功能区
            ck080: '', // 四类聚焦
            ck081: '', // 巡查台账
            ck082: '', // 市级巡查
            ck083: '', // 国家点
            st4ScsCn: {
              cn010: '未整改'
            },
            groupByName: 'sg001'
          }
        }
        listLedgerzg(params).then(res => {
          this.parameterChartsData = res.data
          this.charts()
        })
      },
      // 台账数据柱状图
      charts (param, url, heightpx, flag) {
        let _this = this
        document.getElementById('charts').style.height = heightpx // heightpx2定义在data中，用于动态设置高度
        // 基于准本好的DOM，初始化echarts实例
        let myChart = echarts.init(document.getElementById('charts'))
        myChart.clear()
        myChart.resize()
        window.addEventListener('resize', myChart.resize)
        // 绘制图表
        myChart.setOption({
          title: {
            text: '百花山国家级自然保护区-生物量分析统计',
            left: 'center',
            top: 0
          },
          grid: {
            left: 50,
            right: 50,
            bottom: 30
          },
          toolbox: {
            // y: 'bottom',
            feature: {
              saveAsImage: {
                pixelRatio: 1
              }
            },
            right: 20
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} (个)'
          },
          xAxis: [{
            type: 'category',
            data: ["核心区","缓冲区","实验区"]
          }],
          yAxis: [{type: 'value'}],
          series: [
            {
              name: '生物量',
              type: 'bar',
              z: 3,
              itemStyle: {
                normal: {
                  color: '#9287e7'
                }
              },
              data: [10892,8945,3420],
              barMaxWidth: 30
            }
          ]
        })
      },
    }
  }

</script>

<style lang="scss" scoped>
  #onePicture {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-tabs /deep/ {
      float: left;
      width: 300px;
      height: 100%;
      overflow: hidden;
      .el-tabs__nav {
        width: 100% !important;
        .el-tabs__item {
          width: 51% !important;
          text-align: center;
          background: #dfe1e7;
          color: #555;
          font-size: 16px;
          border-radius: 4px 4px 0 0;
          border: 1px solid #ddd;
          &.is-active {
            color: #069;
            background: #fff;
          }
        }
      }
      .el-tabs__content {
        padding: 0;
        width: 100%;
        height: calc(100% - 39px);
        overflow: hidden;
        background: url("../../assets/images/onePicture/mapfilters-bg-2.png") 0 0 no-repeat;
        background-size: cover;

        .el-tab-pane {
          width: 100%;
          height: 100%;
          overflow: auto;
          .title {
            margin: 10px;
            &:before {
              content: "";
              display: inline-block;
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-bottom: 10px solid #069;
              vertical-align: middle;
              margin-top: -1px;
              margin-right: 8px;
            }
          }
          .el-tree {
            width: 100%;
            background: transparent;
            &>.el-tree-node {
              margin: 0 10px;
              border-bottom: 1px solid #d3e6ec;
              &:last-child {
                border: none;
              }
              &>.el-tree-node__content {
                line-height: 38px;
                height: 38px;
                color: #069;
              }
              &>.el-tree-node__children {
                .el-tree-node {
                  margin-bottom: 15px;
                  .el-tree-node__content {
                    line-height: 20px;
                    min-height: 20px;
                    height: auto;
                    color: #069;
                    padding-left: 50px !important;
                    position: relative;
                    .el-tree-node__expand-icon.is-leaf {
                      display: none;
                    }
                    &>div {
                      span {
                        font-size: 15px;
                        display: block;
                      }
                    }
                    &>label.el-checkbox {
                      margin-right: 8px;
                      position: absolute;
                      top: 2px;
                      left: 28px;
                    }
                    .esri-legend {
                      background: transparent;
                      margin-top: 10px;
                      .esri-legend__service {
                        padding-left: 0;
                        padding-top: 0;
                        .esri-legend__layer {
                          margin: 0;
                          .esri-legend__layer-table {
                            width: 100%;
                            overflow: hidden;
                            display: inherit;
                          }
                        }
                      }
                      .esri-legend__message {
                        margin-bottom: 10px;
                        background: #fff;
                      }
                    }
                  }
                  &:focus, &:hover {
                    &>.el-tree-node__content {
                      color: #00a1ff;
                      background-color: transparent;
                    }
                  }
                }
              }
              &.is-expande {
                border-bottom: 1px solid #8db4c1;
              }
              &:focus, &:hover {
                border-bottom: 1px solid #8db4c1;
                &>.el-tree-node__content {
                  color: #00a1ff;
                  background-color: transparent;
                  /*.el-tree-node__expand-icon {*/
                  /*  &:before {*/
                  /*    color: #00a1ff !important;*/
                  /*  }*/
                  /*}*/
                }
              }
              .is-leaf + .el-checkbox .el-checkbox__inner {
                display:inline-block;
              }
              /*.el-checkbox__input>.el-checkbox__inner {*/
              /*  display:none;*/
              /*}*/
              .el-icon-caret-right:before {
                content: "\e6ab";
                font-family: "iconfont" !important;
                font-size: 16px;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                vertical-align: middle !important;
                color: #069;
              }
              .el-icon-caret-right.expanded {
                transform: initial;
              }
              .el-icon-caret-right.expanded:before {
                content: "\e6f1" !important;
                font-family: "iconfont" !important;
                font-size: 14px !important;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                vertical-align: middle !important;
                color: #069;
              }
            }
            &#tree2 {
              &>.el-tree-node {
                &>.el-tree-node__content {
                  .el-checkbox__inner {
                    display:none;
                  }
                }
              }
            }
          }
        }
      }
    }
    #map {
      float: left;
      width: calc(100% - 302px);
      height: 100%;
      position: relative;
      #scaleBar /deep/ {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: rgba(255,255,255,.8);
        padding: 20px 10px 10px 10px;
        .esri-scale-bar__bar-container {
          position: absolute;
          top: 0;
          &:last-child {
            align-items: flex-end;
          }
        }
        .blTip {
          margin: 25px 0 0;
          span {
            font-weight: bold;
            color: #00a1ff;
          }
          //position: absolute;
        }
        .jwTip {
          margin: 25px 0 0;
          //position: absolute;
        }
      }
      #toolBar {
        position: absolute;
        top: 15px;
        right: 15px;
        li {
          background-color: #fff;
          color: #6e6e6e;
          width: 32px;
          height: 32px;
          margin-bottom: 10px;
          line-height: 32px;
          text-align: center;
          box-shadow: 0px 0px 20px 0px rgba(34, 44, 72, 0.2);
          i {
            font-size: 20px;
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
        top: 15px;
        right: 60px;
        background: #fff;
        padding: 15px;
        overflow: hidden;
        div {
          padding: 12px;
          float: left;
          img {
            width: 64px;
            height: 64px;
          }
          p {
            width: 64px;
            text-align: center;
            color: #6e6e6e;
            font-size: 12px;
            margin-bottom: 0;
            margin-top: 5px;
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
        top: 56px;
        right: 60px;
        background: #fff;
        padding: 10px;
        div {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          &:hover {
            background-color: #f2f2f2;
          }
          &.isActive {
            border: 1px solid #0079c1;
            background-color: rgba(225,241,251,.5);
          }
        }
      }
      .mapBox4 {
        position: absolute;
        top: 15px;
        right: 60px;
        background: #fff;
        padding: 15px;
        article {
          width: 640px;
          height: 300px;
        }
      }
    }
  }
  .mt25 {
    margin-top: 25px;
  }

</style>
<style>
  .esri-legend__message{
    display: none;
  }
  #pane-0 .esri-legend__layer-caption {
    display: none;
  }
  #pane-0 .esri-legend__service-label{
    display: none;
  }
  #pane-1 .esri-legend__layer-caption{
    display: none;
  }
</style>
