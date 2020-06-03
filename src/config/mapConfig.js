// /*
// arcgis初始化配置
// */

// window._base_path = "http://localhost:8080";
// window._base_kuangjia = "http://localhost:8080";
// window._arcgis_js_apiUrl = "http://localhost:8080/arcgis_js_api/library/4.12/";
// window._base_landServer = "";

// export function arcgisConfig () {
//   window.arcgis = {
//     config: {
//       proxyUrl: 'http://localhost:8080/arcgis_js_api/library/4.12/init.js',
//       baseUrl: window._arcgis_js_apiUrl + 'init.js',
//       dojoUrl: 'http://localhost:8080/arcgis_js_api/library/4.12/dojo',
//       // offlineMapWkid: 26911,
//       getBaseUrl: function () {
//         return this.baseUrl
//       },
//       getDojoUrl: function () {
//         return this.dojoUrl
//       },
//       getWkid: function () {
//         // return this.offlineMapWkid
//       }
//     }
//   }
// }
/*
arcgis初始化配置
*/
/* 服务器配置 */
export default {
  baseUrl: 'http://115.29.42.107:8686/415/init.js',
  dojoUrl: 'http://115.29.42.107:8686/415/dojo',
  esriCss: 'http://115.29.42.107:8686/415/esri/css/main.css',
  serverUrl: 'http://218.94.134.42:2173',
  dynamicLayerSpace: 'D:\\FTP\\dynamicSpace\\',
  mapWkid: 3857,
  inflectionPointcolor: [226, 119, 40], // 拐点颜色
  boundaryColor: [226, 119, 40], // 界桩颜色
  centerPoint: {
    longitude: 106.267,
    latitude: 38.467,
    spatialReference: {
      wkid: 3857
    }
  }, // 地图中心经纬度
  /* 动态工作空间 */
  remoteSensingDynamicSpace: 'http://192.168.1.195:6080/arcgis/rest/services/nxhx/dynamicRSI/MapServer',
  geometryServerUrl: 'http://120.24.69.160:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer',
  redlineLayer: 'http://192.168.1.195:6080/arcgis/rest/services/nxhx/redlinelayer/MapServer',
  // todo 准备全部删除
  GeoprocessorUrl: 'http://218.94.134.42:2173/arcgis/rest/services/jshx/insect1/GPServer/hotline',
  rasterToShpGP: 'http://218.94.134.42:2173/arcgis/rest/services/jshx/toShpInsect/GPServer/toShpInsect',
  dynamicSpaceLayer: 'http://218.94.134.42:2173/arcgis/rest/services/jshx/dynamicLayer/MapServer/dynamicLayer',
  mapImageLayerDynamicSpaceLayer: 'http://218.94.134.42:2173/arcgis/rest/services/jshx/dynamicLayer/MapServer',
  GeoJsonUrl: 'http://218.94.134.42:2073/eprGeoJson/',
  adjustToShpGP: 'http://218.94.134.42:2173/arcgis/rest/services/jshx/diff/GPServer/diff',
  ledgerUrl: 'http://192.168.1.195:6080/arcgis/rest/services/nxhx/daihecha/MapServer',
  jiezhuangUrl: 'http://192.168.1.195:6080/arcgis/rest/services/nxhx/jiezhuang/MapServer',
  signUrl: 'http://192.168.1.195:6080/arcgis/rest/services/nxhx/biaoshipai/MapServer'
}
