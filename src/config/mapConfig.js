
/* 服务器配置 */
const base_url = process.env.NODE_ENV === 'development' ? 'http://192.168.1.195:6080' : ''
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
    longitude: 103.717216,
    latitude: 27.336999,
    spatialReference: {
      wkid: 3857
    }
  },
  /* 动态工作空间 */
  remoteSensingDynamicSpace: base_url + '/arcgis/rest/services/nxhx/dynamicRSI/MapServer',
  geometryServerUrl: base_url + '/arcgis/rest/services/Utilities/Geometry/GeometryServer',
  redlineLayer: base_url + '/arcgis/rest/services/nxhx/redlinelayer/MapServer',
  dynamicLayer: base_url + '/arcgis/rest/services/ztgt/VectorDynamic/MapServer/dynamicLayer'
}
