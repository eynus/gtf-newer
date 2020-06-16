<template>
  <div class="h100">
    <ArcgisMap
        ref="arcgismap"
        :isSketch="false"
    ></ArcgisMap>
  </div>
</template>
<script>
  // js 代码
  import { loadCss } from "esri-loader";
  import arcgisPackage from "@/utils/arcgisTools";
  import config from "@/config/mapConfig";
  loadCss(config.esriCss);
  export default {
    name: 'arcMap',
    data() {
      return {

      }
    },
    created: function() {},
    mounted: function() {

    },
    methods: {

    }
  };
</script>
