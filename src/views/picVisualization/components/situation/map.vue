<template>
  <div class="h100">
    <ArcgisMap
        ref="arcgismap"
        :isSketch="false"
        @created="createMap"
    ></ArcgisMap>
  </div>
</template>
<script>
  // js 代码
  import { loadCss } from "esri-loader";
  import arcgisPackge from "@/utils/arcgisTools";
  import mapConfig from "@/config/mapConfig";
  loadCss(mapConfig.esriCss);
  export default {
    name: 'arcMap',
    props: {
      funcname: Array
    },
    data() {
      return {

      }
    },
    watch: {
      funcname() {
        let labels = this.funcname.map(item => item.label)
        labels && this.layerChange(labels)
      }
    },
    methods: {
      async createMap(map, view) {
        this.map = map
        this.view = view
        await this.featureLayer()
        this.$emit('mapCreated')
      },
      layerChange(label) {
        let layer = this.map.findLayerById('funclayer')
        let renderer = {
          type: "unique-value",
          field: "FUNCAREA",
          defaultSymbol: { type: "simple-fill" },
          uniqueValueInfos: [{
            value: "优化开发区域",
            symbol: {
              type: "simple-fill",
              color: "green",
              outline: {
                color: [194, 194, 194, 1],
                width: "1px"
              }
            }
          }, {
            value: "禁止开发区域",
            symbol: {
              type: "simple-fill",
              color: "red"
            }
          }, {
            value: "重点开发区域",
            symbol: {
              type: "simple-fill",
              color: "blue"
            }
          }, {
            value: "限制开发区域",
            symbol: {
              type: "simple-fill",
              color: "orange"
            }
          }],
        }
        layer.renderer = renderer
        let express = ''
        label.forEach((item, i) => {
          if (i === label.length - 1) {
            express += "FUNCAREA = '"+ item +"'"
          } else {
            express += "FUNCAREA = '"+ item +"' OR "
          }
        })
        layer.definitionExpression = express
      },
      async featureLayer() {
        let FeatureLayer = await arcgisPackge.FeatureLayer

        let layer = new FeatureLayer({
          id: "funclayer",
          url: mapConfig.dynamicLayer,
          dynamicDataSource: {
            type: "data-layer",
            dataSource: {
              type: "table",
              workspaceId: "oracleWorkspaceID",
              dataSourceName: "SDE.ZTGNQ",
              version: ""
            }
          },
        })
        this.map.add(layer)
      }
    }
  };
</script>
