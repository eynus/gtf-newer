<template>
  <div class="h100">
    <ArcgisMap></ArcgisMap>
  </div>
</template>
<script>
// js 代码
// import config from "@/config/mapConfig";
// import arcgisPackage from "@/utils/arcgisTools";
// // import  arcgisConfig  from '@/config/mapConfig'
// import { loadCss } from "esri-loader";
// loadCss(config.esriCss);
// export default {
//   data() {
//     return {
//       mapId: "", // 地图框的id
//       map: null, // 地图map实例
//       view: null, // 地图view实例
//       draw: null, // 地图绘制示例
//       drawGeometry: null, // 地图绘制出的结果
//       grouplayer: null, // 加载在地图的数组
//       mousePoint: null // 鼠标的位置
//     };
//   },
//   created: function() {},
//   mounted: function() {
//     this.mapId = "mapview" + this._uid;
//     this.createMap();
//   },
//   methods: {
//     /**
//      * @Description:初始化地图
//      */
//     async createMap() {
//       console.log("createMap");

//       // todo 修改能够兼容84与非84地图
//       // 加载arcgis地图的依赖
//       let MapView = await arcgisPackage.MapView;
//       let Map = await arcgisPackage.Map;
//       let Basemap = await arcgisPackage.Basemap;
//       // let BasemapToggle = await arcgisPackage.BasemapToggle
//       // let Plotting = await arcgisPackage.Plotting
//       // let customBasemap = new Basemap({
//       //   // baseLayers: [tdtylayer1, tdtylayer2],
//       //   title: '矢量地图',
//       //   id: 'myBasemap',
//       //   // thumbnailUrl: Basemapthumbnail
//       // })
//       // let customBasemap1 = new Basemap({
//       //   // baseLayers: [tdtylayer, tdtylayer3],
//       //   title: '影像地图',
//       //   id: 'myBasemap1',
//       //   // thumbnailUrl: Basemapthumbnail1
//       // })
//       this.map = new Map({
//         basemap: {
//           // vector: customBasemap,
//           // image: customBasemap1
//         }[this.baseMapType]
//       });
//       this.view = new MapView({
//         map: this.map,
//         container: this.mapId,
//         center: [102.7346125, 25.0563901], //config.centerPoint,
//         zoom: 6
//       });
//       console.log(this.view, "?");
//     }
//   }
//   //       test1() {
//   //         const options = {
//   //            url: config.baseUrl //本地js资源
//   //         };
//   //         arcgisPackage.loadModules ([
//   //         // esriLoader.loadModules ([
//   //           "esri/Map",
//   //           'esri/views/MapView',
//   //           "dojo/_base/array"
//   //         ],options)
//   //           .then (([
//   //                     Map,
//   //                     MapView,
//   //                     array
//   //                   ]) => {
//   //             const map = new Map ({
//   //               basemap: "streets"
//   //             });
//   //             const mapview = new MapView ({
//   //               container: "viewDiv",
//   //               map: map,
//   //               zoom: 12,
//   //               center: [ 102.7346125, 25.0563901 ]
//   //             });
//   //            //监听地图比例尺改变事件
//   //             mapview.watch('zoom',function (e) {
//   //               console.log(window._arcgis_js_apiUrl,'?');
//   //             });

//   //           }, reason => {
//   //             console.log (reason);
//   //           });

//   // }
// };
</script>
 