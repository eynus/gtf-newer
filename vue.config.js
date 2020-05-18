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
                // target: 'http://192.168.6.12:9995/', //本地
                target: 'http://192.168.6.12:9992/', //本地
                // target: 'http://120.24.69.160:8080/', //外网
                ws: false,
                changeOrigin: true
            }
        }
    },
    configureWebpack: {
        externals: {
        }
    },

    pluginOptions: {
        // 'style-resources-loader': {
        //   preProcessor: 'less',
        //   patterns: [path.resolve(__dirname, './src/variable.less')]
        // }
    }
};
