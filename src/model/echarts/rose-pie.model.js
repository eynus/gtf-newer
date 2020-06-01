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
    x: '60%',
    y: 'center',
    icon: 'circle',
    orient: 'vertical',
    textStyle: { color: '#999db2', fontSize: remToPx(1) },

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
      radius: ['60%', '80%'],
      center: ['35%', '50%'],
      // roseType : 'radius',
      label: {
        normal: {
          show: false, //
          formatter: function (pargram) {
            return `${pargram.name}:${pargram.data[1]}(${pargram.percent}%)`
          },
          position: 'inner', //
          color: '#fff',
          fontSize: remToPx(1)
        },
        emphasis: {
          show: false
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
  
    }
  ]
  color = ["rgb(0,131,255)", "rgb(255,195,0)", "rgb(67,207,124)", "rgb(227,60,100)"]
  // color = ['rgba(8,92,217,1)', ' rgba(38,188,3,1)',  'rgba(4,227,182,1)', 'rgba(233,132,0,1)',' rgba(228,246,100,1)']
}
