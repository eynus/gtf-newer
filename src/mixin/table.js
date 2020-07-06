import {remToPx} from "@/utils/common";

export const ivtable = {
  data() {
    return {
      tbd: '', // 自定义table要减去的高度
      tbhopt: '', // 定义了内容操作区域的表格高度
      tbhone: '',
      tbhtwo: '',
      tbhthree: '',
      selection: [],
      page: {
        current: 1,
        total: 0,
        pageSize: 10
      },
    }
  },
  methods: {
    resize() {
      let innerHeight = window.innerHeight
      let head = document.getElementById('head').offsetHeight // 头部高度
      this.optHeight = this.$refs.opt.offsetHeight // 操作区域内容高度
      this.tbhone = innerHeight - this.tbd
      this.tbhopt = innerHeight - this.optHeight - head - remToPx(9.25)
    },
    // 更改页数
    changePage(index) {
      this.page.current = index
      this.getList()
    },
    // 更改页码范围
    changePageSize(val) {
      this.page.pageSize = val
      this.getList()
    },
  },
  mounted() {
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  destroyed() {
    window.removeEventListener('resize', this.resize)
  },
}
