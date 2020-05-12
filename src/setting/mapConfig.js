/*
arcgis初始化配置
*/
/* export default {
  baseUrl: 'http://115.29.42.107:8686/410/init.js',
  dojoUrl: 'http://115.29.42.107:8686/410/dojo',
  esriCss: 'http://115.29.42.107:8686/410/esri/css/main.css',
  serverUrl: 'http://192.168.1.158:6080',
  GeoprocessorUrl: 'http://192.168.1.158:6080/arcgis/rest/services/qhhx/insect/GPServer/insect',
  mapWkid: 10200,
  inflectionPointcolor: [226, 119, 40], // 拐点颜色
  boundaryColor: [226, 119, 40], // 界桩颜色
  centerPoint: [98.880521, 37.762178] // 地图中心经纬度
} */
/* export default {
  baseUrl: 'http://localhost:8081/410/init.js',
  dojoUrl: 'http://localhost:8081/410/dojo',
  esriCss: 'http://localhost:8081/410/esri/css/main.css',
  serverUrl: 'http://localhost:6080',
  mapWkid: 10200,
  inflectionPointcolor: [226, 119, 40], // 拐点颜色
  boundaryColor: [226, 119, 40], // 界桩颜色
  centerPoint: [98.880521, 37.762178], // 地图中心经纬度
} */
/* 服务器配置 */
export default {
  baseUrl: 'http://10.34.100.135:8080/4.11/init.js',
  dojoUrl: 'http://10.34.100.135:8080/4.11/dojo',
  esriCss: 'http://10.34.100.135:8080/4.11/esri/css/main.css',
  fontsUrl: 'http://10.34.100.135:8080/4.11/fonts',
  serverUrl: 'http://10.34.100.135:6080',
  GeoprocessorUrl: 'http://10.34.100.135:6080/arcgis/rest/services/anhx/insect1/GPServer/hotline',
  // rasterToShpGP: 'http://10.34.100.135:6080/arcgis/rest/services/anhx/rasterToShp/GPServer/toShp',
  rasterToShpGP: 'http://10.34.100.135:6080/arcgis/rest/services/anhx/rasterToShp/GPServer/toShp',
  dynamicSpaceLayer: 'http://10.34.100.135:6080/arcgis/rest/services/anhx/dynamicSpace/MapServer/dynamicLayer',
  mapImageLayerDynamicSpaceLayer: 'http://10.34.100.135:6080/arcgis/rest/services/anhx/dynamicSpace/MapServer',
  dynamicLayerSpace: 'E:\\FTP\\dynamicSpace\\',
  mapWkid: 4490,
  inflectionPointcolor: [226, 119, 40], // 拐点颜色
  boundaryColor: [226, 119, 40], // 界桩颜色
  centerPoint: {
    longitude: 117.328239,
    latitude: 31.784646,
    spatialReference: {
      wkid: 4490
    }
  }, // 地图中心经纬度
  geometryServerUrl: 'http://10.34.100.135:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer',
  redlineUrl: '', // 红线服务路径
  vectorBaseMapUrl: '', // 矢量底图服务
  ImageBaseMapUrl: '', // 影像地图服务
  redlineShpUrl: '', // 红线的shp文件路径
  remarkLayerUrl: '', // 界桩服务的路径
  bspLayerUrl: '', // 标识牌服务的路径
  notesVectorMapUrl: '', // 矢量地图标注服务的路径
  notesImageMapUrl: '', // 影像地图标注服务的路径
  guaidianLayerUrl: '', // 拐点地图
  GeoJsonUrl: 'http://10.34.100.136:8080/epr/epr/'
}
