/**
 * 流文件转化为对应格式的文件
 */
class Download {
  constructor() {
    this.blob = {}
    this.url = ''
    this.filename = ''
  }

  zip(res) {
    this.blob = new Blob([res],  { type: 'zip;charset=utf-8' })
    this.url = window.URL.createObjectURL(this.blob)
    this.down()
  }

  xlsx(res) {
    this.blob = new Blob([res],  { type: 'application/vnd.ms-excel' })
    this.url = window.URL.createObjectURL(this.blob)
    this.down()
  }

  down() {
    let url = this.url
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = `${this.filename}`
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }
}

export default Download
