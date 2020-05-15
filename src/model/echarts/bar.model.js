// 如果是页面中的option，那么等于号就应该换成冒号了
import { remToPx } from '@/utils/common'
export class BarOptionModel {
  title = {
    show: false,
    text: '',
    subtext: '单位：个',
    subtextStyle: {
      color: '#fff',
      fontSize: remToPx(0.875)
    }
  }
  tooltip = {
    trigger: 'axis'
    // axisPointer: {
    //     type: 'shadow'
    // }
  }
  legend = {
    show: false,
    textStyle: {
      fontSize: remToPx(0.875)
    }

    // data: ['用电量']
  }
  grid = {
    top: '20%',
    bottom: '6%',
    containLabel: true
  }
  calculable = true
  dataset = {
    dimensions: [],
    source: []
  }
  xAxis = [
    {
      type: 'category',
      axisLine: {
        // 轴线
        show: false,
        lineStyle: {
          color: '#1d6bf9',
          type: 'solid',
          width: 1
        }
      },
      triggerEvent: true,
      axisLabel: {
        // interval:0,
        color: '#fff',
        fontSize: remToPx(0.875),
        // formatter:(value)=>{
        //     return value;
        // },
        // interval: 0,
        formatter: function (value) {
          // 关键代码
          var res = value
          if (res.length > 7) {
            res = res.substring(0, 6) + '..'
          }
          return res
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: 'rgba(6,49,114,0.2)',
          type: 'solid',
          width: 1
        }
      }
    }
  ]
  yAxis = [
    {
      type: 'value',
      axisLine: {
        // 轴线
        show: false,
        lineStyle: {
          color: '#fff',
          type: 'solid',
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#fff',
        fontSize: remToPx(0.875)
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#1d6bf9',
          type: 'solid',
          width: 1
        }
      }
    }
  ]
  series = [
    {
      type: 'bar',
      barMaxWidth: remToPx(5),
      itemStyle: {
        normal: {
          barBorderRadius: 1,
          label: {
            show: true, // 开启显示
            position: 'top', // 在上方显示
            textStyle: {
              // 数值样式
              color: '#0ff',
              fontWeight: 'bold',
              fontSize: remToPx(0.875)
            }
          }
        }
      }
    }
  ]
  // color = [{
  //     type: 'linear',
  //     x: 0,
  //     y: 0,
  //     x2: 0,
  //     y2: 1,
  //     colorStops: [{
  //         offset: 0, color: 'rgba(2,254,237,1)' // 0% 处的颜色
  //     }, {
  //         offset: 0.3, color: 'rgba(5,255,253,1)' // 0% 处的颜色
  //     }, {
  //         offset: 0.7, color: 'rgba(4,203,255,1)' // 0% 处的颜色
  //     }, {
  //         offset: 1, color: 'rgba(5,151,255,1)' // 100% 处的颜色
  //     }],
  //     globalCoord: false // 缺省为 false
  // }]
  color = [
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: 'rgba(0,255,255,1)' // 0% 处的颜色
        },
        {
          offset: 1,
          color: 'rgba(15,49,98,1)' // 100% 处的颜色
        }
      ],
      globalCoord: false // 缺省为 false
    }
  ]
}
