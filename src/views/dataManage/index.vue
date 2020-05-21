<template>
  <div class="home h100">
    <Layout style="height:100%;">
      <Sider class="h100" width="110" :style="{background: '#fff'}">
        <Menu
          :active-name="activeMenuItem"
          theme="light"
          width="auto"
          :class="menuitemClasses"
          @on-select="changeRoute"
        >
          <template v-for="(item,index ) in dataManageList">
            <MenuItem :name="item.key" class="menu-item mb" :key="`dml_${index}`" v-if="item.show">
              <Icon
                :custom="item.icon"
                size="22"
                :color="activeMenuItem===`${item.key}`?'#2d8cf0':'#8391B8'"
              />
              <div>{{item.name}}</div>
            </MenuItem>
          </template>
        </Menu>
        <div slot="trigger"></div>
      </Sider>
      <Layout class="h100">
        <div :style="{ height: `calc(100% - 42px)` }" class="pd">
          <div class="scroll-y h100 card-style">
            <router-view />
          </div>
        </div>

        <div>
          <my-footer color="rgb(200,200,200)"></my-footer>
        </div>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  // @ is an alias to /src
  import MyFooter from '@/components/MyFooter'
  import { mapGetters } from 'vuex'
  export default {
    name: 'Home',
    components: { MyFooter },
    data() {
      return {
        activeMenuItem: 'overview',
        dataManageList: [
          {
            name: '数据总览',
            key: 'overview',
            show: false,
            icon: 'iconfont  icon-overview',
            id: 'page_5_1'
          },
          {
            name: '查询浏览',
            key: 'query',
            show: false,
            icon: 'iconfont  icon-file',
            id: 'page_5_2'
          },
          {
            name: '服务管理',
            key: 'service',
            show: false,
            icon: 'iconfont  icon-jiangbei',
            id: 'page_5_3'
          },
          {
            name: '质检管理',
            key: 'inspection',
            show: false,
            icon: 'iconfont  icon-setting',
            id: 'page_5_4'
          }
        ]
      }
    },
    created() {
    
       this.activeMenuItem = this.$route.path.replace('/data/','').split('/')[0]
      //判断当前用户是否有权限显示左侧列表menu
      let dataSiderAuth = this.role.find(
        (item, index) => item.resIdentif === 'main_menu_5'
      ).childs
      //设置show
      dataSiderAuth.forEach((item, index) => {
        let targetIndex = this.dataManageList.findIndex(
          (data, idx) => data.id === item
        )
        this.dataManageList[targetIndex]['show'] = true
      })
    },
    computed: {
      ...mapGetters(['role']),
      menuitemClasses() {
        return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
      }
    },
    watch: {
      '$route.path': function(newVal) {
        switch (newVal) {
          case '/data/query':
          case '/data/inspection':
          case '/data/service':
          case '/data/overview':
            this.activeMenuItem = newVal.slice(6)
            break
          default:
            break
        }
      }
    },
    methods: {
      changeRoute(data) {
        this.activeMenuItem = data
        this.$router.push('/data/' + data)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .card-style {
    background: #fff;
    border-radius: 4px;
  }
  .menu-item {
    text-align: center;
    color: #8391b8;
    padding: 10px 0;
    font-weight: 600;
    div {
      margin-top: 6px;
    }
  }
</style>

