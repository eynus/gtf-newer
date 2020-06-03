export default {
    state: {
        // token: getToken(),
        // userInfo: JSON.parse(localStorage.getItem('userInfo')),
        // userPower: JSON.parse(localStorage.getItem('userPower')),
        // // role: JSON.parse('[{"resIdentif":"main_menu_1","id":11,"childs":[]},{"resIdentif":"main_menu_2","id":12,"childs":[]},{"resIdentif":"main_menu_3","id":13,"childs":[]},{"resIdentif":"main_menu_4","id":14,"childs":[]},{"resIdentif":"main_menu_5","id":15,"childs":["page_5_1","page_5_2","page_5_3","page_5_4"]}]')
        // role: JSON.parse(localStorage.getItem('role'))
        headInfo: {
            pic: {
                title: "一张图",
                bgUrl: require('../../assets/img/dataManage/head_bg.png')
            },
            data: {
                title: "数据管理",
                bgUrl: require('../../assets/img/dataManage/head_bg.png')
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
