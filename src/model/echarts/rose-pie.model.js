// 如果是页面中的option，那么等于号就应该换成冒号了
import { remToPx } from '@/utils/common'
export class RosePieOptionModel {
  title = {
    show: true,
    text: '',
    subtext: '',
    subtextStyle: {
      color: '#000',
      fontSize: remToPx(1)
    },
    x: '30'
  }
  tooltip = {
    trigger: 'item',
    formatter: function (pargram) {
     
      return `${pargram.name}:${pargram.data[1]}(${pargram.percent}%)`
    }
  }
  legend = {
    x: 'right',
    y: 'center',
    icon: 'circle',
    orient: 'vertical',
    textStyle: { color: '#000', fontSize: remToPx(1) },

  }
  // grid = {
  //     top: '6%',
  //     left: '40%',
  //     right: '2%',
  //     bottom: '20%',
  //     containLabel: true
  // };
  // calculable = true;
  dataset = {
    // dimensions: [],
    source: []
  }
  series = [
    {
      name: '半径模式',
      type: 'pie',
      radius: ['50%', '90%'],
      center: ['45%', '50%'],
      // roseType : 'radius',
      label: {
        normal: {
          show: false, //
          formatter: function (pargram) {
            return `${pargram.name}:${pargram.data[1]}(${pargram.percent}%)`
          },
          position: 'inner', //
          color: '#000',
          fontSize: remToPx(1)
        },
        emphasis: {
          show: true
        }
      },
      labelLine: {
        normal: {
          show: false
        },
        emphasis: {
          show: true
        }
      },
      // data: [
      //   { value: 10, name: 'rose1' },
      //   { value: 5, name: 'rose2' },
      //   { value: 15, name: 'rose3' },
      //   { value: 25, name: 'rose4' },
      //   { value: 20, name: 'rose5' },
      //   { value: 35, name: 'rose6' },
      //   { value: 30, name: 'rose7' },
      //   { value: 40, name: 'rose8' }
      // ]
    }
  ]
  color = ["rgb(0,131,255)", "rgb(255,195,0)", "rgb(67,207,124)", "rgb(227,60,100)"]
}
