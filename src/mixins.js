import { on, off } from '@/utils/common';
let mixin = {
    data() {
        return {
            documentFontSize: document.documentElement.style.fontSize
        };
    },
    methods: {
        //单位转换
        remToPx(rem) {
            let fontSize = this.documentFontSize;
            return Math.floor(rem * fontSize.replace('px', ''));
        },

        
        //设置echarts中图表format
        setLabelNormalFormat(unit, isArr) {
            return {
                show: false,
                formatter: function (parmas) {
                    if (isArr) {
                        return [
                            `{per|${parmas.percent}%}`,
                            `{a|${parmas.name}}`,
                            `{b|${parmas.value[1]}${unit}}`
                        ].join('\n');
                    } else {
                        return [
                            `{per|${parmas.percent}%}`,
                            `{a|${parmas.name}}`,
                            `{b|${parmas.value}${unit}}`
                        ].join('\n');
                    }
                },
                position: 'inner', //
                color: '#fff',
                fontSize: Number(this.remToPx(0.9)),
                backgroundColor: 'rgba(0,0,0,0.8)',
                // borderColor: 'rgba(0,0,0,0.7)',
                borderWidth: 1,
                borderRadius: 4,
                padding: [
                    Number(this.remToPx(0.5)),
                    Number(this.remToPx(1)),
                    Number(this.remToPx(0.5)),
                    Number(this.remToPx(1))
                ],
                rich: {
                    a: {
                        color: '#fff',
                        fontSize: Number(this.remToPx(1)),
                        align: 'center',
                        lineHeight: Number(this.remToPx(1.375))
                    },

                    b: {
                        color: '#fff',
                        fontSize: Number(this.remToPx(0.9)),
                        align: 'center',
                        lineHeight: Number(this.remToPx(1.375))
                    },
                    per: {
                        color: '#0ff',
                        fontWeight: 'bold',
                        lineHeight: Number(this.remToPx(1.375)),
                        fontSize: Number(this.remToPx(1.1)),
                        align: 'center'
                    }
                }
            };
        },
        // getExportUrl (prefix, data) {
        //   let prefixUrl = 'http://58.215.18.119:5555/api/' + prefix + '?'
        //   return _.reduce(
        //     data,
        //     (result, value, key) => {
        //       result += key + '=' + value + '&'
        //       return result
        //     },
        //     prefixUrl
        //   )
        // },
        resize() {
            this.documentFontSize = document.documentElement.style.fontSize;
        }
    },
    mounted() {
        on(window, 'resize', this.resize);
    },
    beforeDestroy() {
        off(window, 'resize', this.resize);
    }
};
export default mixin;
