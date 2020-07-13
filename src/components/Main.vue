<template>
  <div id="app">
    <Layout>
      <Header id="head" ref="head" class="flex flex-sb" :style="{backgroundImage:`url(${moduleHeadBgUrl})`}">
        <div>
          昭通市国土空间基础信息平台
          <span>
            <i>「</i>
            {{moduleName}}
            <i>」</i>
          </span>
        </div>

        <div class="opt-area">
          <div class="gohome" @click="returnHome">
            <span>
              <Icon type="ios-home" />
              主页
            </span>
          </div>
          <div class="user-info">
            <Dropdown placement="bottom-start">
              <a href="javascript:void(0)">
                <Icon type="md-person" />
                {{userName}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem class="text-center fs16 pd">修改密码</DropdownItem>
                <DropdownItem class="text-center fs16 pd" @click.native="quit">退出</DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </div>
        </div>
      </Header>
      <Content id="content">
        <router-view />
      </Content>
    </Layout>
  </div>
</template>
<script>
import { removeToken } from "@/utils/auth";
import { mapActions } from "vuex";
export default {
  name: "mainpage",
  data() {
    return {
      moduleName: "",
      moduleHeadBgUrl: ""
    };
  },
  computed: {
    userName() {
      return (
        (this.$store.state.user.userInfo &&
          this.$store.state.user.userInfo.userName) ||
        ""
      );
    },
    headInfo() {
      return this.$store.state.routeInfo.headInfo;
    }
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    returnHome() {
      this.$router.push("/home");
    },
    quit() {
      this.handleLogOut()
        .then(res => {
          this.$router.push("/login");
        })
        .catch(err => {
          this.$Message.error({
            content: err[0],
            duration: 5
          });
        });
    }
  },
  created() {
    let obj = this.headInfo[this.$route.path.split("/")[1]];
    this.moduleName = obj.title;
    this.moduleHeadBgUrl = obj.bgUrl;
    // this.moduleHeadBgUrl = require(obj.bgUrl)
  }
};
</script>
<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-normal;
  height: 100vh;
}
#head {
  height: 6vh;
  line-height: 6vh;
  font-size: 24px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 10px;
  // background-image: url("../assets/img/dataManage/head_bg.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  h1 {
    margin-bottom: 0;
  }
  span {
    font-size: 1.5rem;
    i {
      font-size: 1.125rem;
      font-style: normal;
    }
  }
  .opt-area {
    .gohome {
      float: left;
      margin-right: 1rem;
      margin-top: -3px;
      box-sizing: border-box;
      cursor: pointer;
      color: #fff;
      span {
        font-weight: normal;
        font-size: 14px;
        background: #7bb1ff;
        padding: 7px 10px;
        border-radius: 10px;
      }
    }
    .user-info {
       height: 100%;
       float: left;
       margin-right: 1rem;
       color: #fff;
       font-weight: normal;
       cursor: pointer;
       font-size: 1.25rem;
       a {
         color: #fff;
       }
     }
    ::v-deep .ivu-select-dropdown {
      z-index: 2000;
    }
  }


}
#content {
  height: 94vh;
}
::v-deep .ivu-layout-header {
  padding: 0;
}
</style>
