'use strict';
const path = require('path');

const resolve = dir => {
    return path.join(__dirname, dir);
};

const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/';

module.exports = {
    publicPath: BASE_URL,
    lintOnSave: false,

    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'))
            .set('_model', resolve('src/model'));
        // 使用sass全局变量
        const oneOfsMap = config.module.rule('scss').oneOfs.store;
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // 全局变量资源路径
                    resources: './src/assets/css/variable.scss'
                    // 也可以选择全局变量路径数组, 如果你有多个文件需要成为全局,就可以采用这种方法
                    // resources: ['./path/to/vars.scss', './path/to/mixins.scss']
                    // 或者你可以将多个scss文件@import到一个main.scss用第一种方法，都是可以的
                })
                .end()
        })
    },

    // 设为false打包时不生成.map文件
    productionSourceMap: false,

    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    // devServer: {

    //   proxy: 'localhost:3000'
    // },
    devServer: {
        host: '0.0.0.0',
        port: '8080',
        proxy: {
            '/*': {
                // target: 'http://192.168.6.30:9992/',
                target: 'http://192.168.6.26:9992/',
                ws: false,
                changeOrigin: true
            }
        }
    },
    configureWebpack: {
        externals: {
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 16, // 换算的基数
                        // 忽略转换正则匹配项。插件会转化所有的样式的px。比如引入了三方UI，也会被转化。目前我使用 selectorBlackList字段，来过滤
                        //如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px 。
                        selectorBlackList: ['weui', 'mu'],
                        propList: ['*'],
                    }),
                ]
            }
        }
    },
    // pluginOptions: {
    //     postcss: {
    //         // plugins: [
    //         //     require('postcss-pxtorem')({ // 把px单位换算成rem单位
    //         //         rootValue: 16, // 换算的基数(设计图750的根字体为32)
    //         //         // selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
    //         //         propList: ['*']
    //         //     })
    //         // ]
    //         plugins: {
    //             'autoprefixer': {
    //                 browsers: ['Android >= 4.0', 'iOS >= 7']
    //             },
    //             'postcss-pxtorem': {
    //                 rootValue: 16,//结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
    //                 propList: ['*']
    //             }
    //         }
    //     }
    // }
};
