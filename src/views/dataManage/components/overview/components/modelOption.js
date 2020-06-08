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
    x: '78%',
    y: 'bottom',
    icon: 'circle',
    itemHeight  :remToPx(0.75),
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
      radius: ['40%', '60%'],
      center: ['45%', '55%'],
      // roseType : 'radius',
      label: {
        normal: {
          show: true, //
          formatter: function (pargram) {
            return `${pargram.name}:${pargram.data[1]}(${pargram.percent}%)`
          },
          position: 'outer', //
          color: '#8f9bb3',
          fontSize: remToPx(1)
        },
        emphasis: {
          show: true
        }
      },
      labelLine: {
        normal: {
          show: true
        },
        emphasis: {
          show: true
        }
      },
  
    }
  ]
  color = ["#0b89fe", "#fe8e0b", "#7c63ea", "#08c28b"]
  // color = ['rgba(8,92,217,1)', ' rgba(38,188,3,1)',  'rgba(4,227,182,1)', 'rgba(233,132,0,1)',' rgba(228,246,100,1)']
}
