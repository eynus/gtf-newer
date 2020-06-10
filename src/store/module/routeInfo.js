export default {
    state: {
        headInfo: {
            pic: {
                title: "一张图可视化",
                bgUrl: require('../../assets/img/picVisualization/head_bg.png')
            },
            data: {
                title: "数据管理",
                bgUrl: require('../../assets/img/dataManage/head_bg.png')
            },
            system: {
              title: "运维管理",
              bgUrl: require('../../assets/img/operation/head_bg.png')
            },
            supervision: {
              title: "实施监督管理",
              bgUrl: require('../../assets/img/supervision/head_bg.png')
            },
            modelConfig: {
              title: "模型指标配置管理",
              bgUrl: require('../../assets/img/modelConfig/head_bg.png')
            },
        }
    },
    mutations: {
        //保存用户信息
        // setUserInfo(state, userInfo) {
        //     state.userInfo = userInfo

        //     localStorage.setItem('userInfo', JSON.stringify(userInfo))
        // },


    },
    getters: {

    },
    actions: {
    }
}
