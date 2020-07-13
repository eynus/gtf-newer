<template>
  <div class="pdf">
    <div class="pdf-page">
      <div class="pdf-page-title">
        {{ filename ? filename : 'pdf.text' }}
      </div>
      <div class="pdf-page-changer" @click="changePage(0)">
        <span v-show="page.current !== 1">上一页</span>
      </div>
      <div class="pdf-page-num">
        {{ page.current }} / {{ page.count }}
      </div>
      <div class="pdf-page-changer" @click="changePage(1)">
        <span v-show="page.current !== page.count">下一页</span>
      </div>
      <div class="pdf-page-opt">
        <div class="pdf-page-opt-item" @click="download">
          <Icon :type="$btn.download" />
          <span> 下载</span>
        </div>
      </div>
    </div>
    <div class="pdf-contain">
      <pdf :src="pdfsrc"
           :page="page.current"
           @num-pages="page.count=$event"
           @page-loaded="page.current=$event"
           @loaded="loadPdfHandler">
      </pdf>
    </div>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'
  import Download from "@/utils/download";
  export default {
    name: "pdfView",
    components: { pdf },
    props: {
      path: String,
      filename: String
    },
    watch: {
      path(value) {
        this.pdfsrc = value
      }
    },
    data() {
      return {
        pdfsrc: '',
        page: {
          current: 1,
          count: 0,
        },
      }
    },
    methods: {
      changePage(val) {
        let { current, count } = this.page
        if (val === 0 && current > 1) {
          this.page.current--
        }
        if (val === 1 && current < count) {
          this.page.current++
        }
      },
      loadPdfHandler() {
        this.page.current = 1
      },
      download() {
        const download = new Download()
        download.url = this.pdfsrc
        download.filename = 'test.pdf'
        download.down()
      }
    },
    mounted() {
      this.pdfsrc = this.path
    }
  }
</script>

<style lang="scss" scoped>
.pdf {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding-top: 50px;
  .pdf-page {
    height: 50px;
    position: absolute;
    z-index: 99999;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    background: #dce0e9;
    box-sizing: border-box;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
    border-bottom: 1px solid #dae0e4;
    .pdf-page-title {
      position: absolute;
      left: 50px;
      font-size: 14px;
    }
    .pdf-page-opt {
      position: absolute;
      right: 50px;
      font-size: 14px;
      cursor: pointer;
    }
    .pdf-page-changer {
      width: 100px;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
    }
    .pdf-page-num {
      width: 100px;
      text-align: center;
    }
  }
  .pdf-contain {
    height: 100%;
    overflow: auto;
  }
}
</style>
