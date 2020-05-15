// 如果是页面中的option，那么等于号就应该换成冒号了
import { remToPx } from '@/utils/common'
export class PieOptionModel {
  title = {
    text: '',
    subtext: '',
    x: 'center'
  }
  tooltip = {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)',
    textStyle: {
      fontSize: remToPx(0.875)
    }
  }
  legend = {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      fontSize: remToPx(0.875),
      color: '#fff'
    },
    data: []
  }
  series = [
    {
      type: 'pie',
      radius: '75%',
      center: ['50%', '55%'],
      data: [],
      labelLine: {
        normal: {
          show: false, // show设置线是否显示，默认为true，可选值：true ¦ false
          color: '#0ff'
        },
        emphasis: {
          show: true
        }
      },
      label: {
        normal: {
          show: false,
          position: 'center', // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
          // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
          // {a}指series.name  {b}指series.data的name
          // {c}指series.data的value  {d}%指这一部分占总数的百分比
          formatter: '{b}',
          color: '#fff',
          fontSize: remToPx(1)
        },
        emphasis: {
          show: true
          // formatter: "{b}{c}"
        }
      },
      // itemStyle: {
      //   emphasis: {
      //     shadowBlur: remToPx(0.625),
      //     shadowOffsetX: 0,
      //     shadowColor: 'rgba(0, 0, 0, 0.5)'
      //   }
      // }
    }
  ]
  color = ['#ff0','f0f','#0071bc', '#0ff']
}
