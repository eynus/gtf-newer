<template>
  <div class="h100">
    <!-- <ArcgisMap :isPlotting="true" ></ArcgisMap> -->
    <ArcgisMap
      ref="arcgismap"
      :isPlotting="true"
      
    ></ArcgisMap>
    <!-- :layers="[MapLayer, drawLayer]" -->
    <!-- <div :id="mapId" class="h100 w100"></div> -->
  </div>
</template>
<script>
// js 代码
import { loadCss } from "esri-loader";
import arcgisPackage from "@/utils/arcgisTools";
import config from "@/config/mapConfig";
import Basemapthumbnail1 from "@/assets/map_images/Basemapthumbnail1.png";
import { tdtlayer, tdtyNoteslayer } from "@/utils/layers";
loadCss(config.esriCss);
export default {
  data() {
    return {
      mapId: "", // 地图框的id
      map: null, // 地图map实例
      view: null // 地图view实例
      //       draw: null, // 地图绘制示例
      //       drawGeometry: null, // 地图绘制出的结果
      //       grouplayer: null, // 加载在地图的数组
      //       mousePoint: null // 鼠标的位置
      //     };
    };
  },
  created: function() {},
  mounted: function() {
    this.mapId = "mapview" + this._uid;
    this.createMap();
  },
  methods: {
    //初始化地图
    async createMap() {
      // 加载arcgis地图的依赖
      let MapView = await arcgisPackage.MapView;
      let Map = await arcgisPackage.Map;
      let Basemap = await arcgisPackage.Basemap;
      // 天地图影像地图
      let tdtylayer = await tdtlayer().then(res => {
        return res;
      });
      // 天地图影像标注图层
      let tdtylayer3 = await tdtyNoteslayer().then(res => {
        return res;
      });

      // let BasemapToggle = await arcgisPackage.BasemapToggle
      // let Plotting = await arcgisPackage.Plotting
      // let customBasemap = new Basemap({
      //   // baseLayers: [tdtylayer1, tdtylayer2],
      //   title: '矢量地图',
      //   id: 'myBasemap',
      //   // thumbnailUrl: Basemapthumbnail
      // })
      let customBasemap1 = new Basemap({
        baseLayers: [tdtylayer, tdtylayer3],
        title: "影像地图",
        id: "myBasemap1",
        thumbnailUrl: Basemapthumbnail1
      });
      this.map = new Map({
        // basemap: "topo"
        basemap: {
          // vector: customBasemap,
          image: customBasemap1
        }["image"]
      });
      this.view = new MapView({
        map: this.map,
        container: this.mapId, //this.mapId,
        center: [103.717216, 27.336999], //config.centerPoint,
        zoom: 10
      });
    },
    /* 创建人类活动事件 */
    async createcomplete(graphic) {
      if (this.selectedToha) {
        //   graphic.attributes = {
        //     Classname: this.selectedToha.tohaId,
        //     Classvalue: this.selectedToha.tohaId,
        //     RED: 230,
        //     BLUE: 32,
        //     GREEN: 32
        //   }
        //   if (!this.drawedToha[this.selectedToha.tohaId]) {
        //     this.$set(this.drawedToha, this.selectedToha.tohaId, {
        //       title: this.selectedToha.title,
        //       RED: Math.floor(Math.random() * 255),
        //       GREEN: Math.floor(Math.random() * 255),
        //       BLUE: Math.floor(Math.random() * 255)
        //     })
        //   }
        //   graphic.symbol = {
        //     type: 'simple-fill', // autocasts as new SimpleFillSymbol()
        //     color: [this.drawedToha[this.selectedToha.tohaId].RED, this.drawedToha[this.selectedToha.tohaId].GREEN, this.drawedToha[this.selectedToha.tohaId].BLUE, 0.7],
        //     outline: { // autocasts as new SimpleLineSymbol()
        //       color: 'gray',
        //       width: '0.5px'
        //     }
        //   }
        //   this.drawLayer.add(graphic)
      } else {
        this.$Notice.info({
          title: "请先选择人类活动类型图层"
        });
      }
    }
  }
};
</script>
 