<template>
  <div class="home h100 guide guide-bg h100 w100">
    <h1>昭通市国土空间基础信息平台</h1>
    <Row class="h100" :style="{ height: `calc(100% - ${remToPx(8)}px)` }">
      <Col span="24" class="h100">
        <div class="guide-body h100"
        >
          <div class="guide-body-top">
            <div
              class="guide-body-top-left"
            >昭通，云南省下辖地级市，位于云南省东北部地处云、贵、川结合部的乌蒙山区腹地，金沙江下游沿岸坐落在四川盆地向云贵高原抬升的过渡地带，东侧紧邻贵州省毕节市，南侧紧邻云南曲靖市，西侧紧邻四川凉山彝族自治州以金沙江为界相邻，北侧紧邻四川宜宾市以金沙江为界相邻，辖区面积23021平方公里。</div>
            <!-- <div class="guide-body-top-right"> -->

            <video
              class="guide-body-top-right"
              src="movie.ogg"
              controls="controls"
            >您的浏览器不支持 video 标签。</video>
          </div>
          <div class="guide-body-bottom">
            <template v-for="(item,index) in guideList">
              <div
                class="guide-body-bottom-item"
                :key="`item_${index}`"
                :style="{backgroundImage:`url(${item.bg})`}"
                @click="changeRoute(item.show,item.to)"
              >
                <div
                  class="guide-body-bottom-item-icon"
                  :style="{'border-bottom': `0.2rem dashed ${item.color}`}"
                >
                  <img :src="`${item.icon}`" alt />
                </div>
                <div class="guide-body-bottom-item-title">{{item.name}}</div>
              </div>
            </template>
          </div>
        </div>
      </Col>
    </Row>

    <my-footer color="rgb(165,165,165)"></my-footer>
  </div>
</template>

<script>
// @ is an alias to /src
import MyFooter from "@/components/MyFooter";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  components: { MyFooter },
  data() {
    return {
      guideList: [
        {
          name: "一张图可视化",
          color: "#E63A3D",
          show: false,
          to: "pic"
        },
        { name: "实施监督管理", color: "#F76110", show: false, to: "data" },
        { name: "模型指标配置管理", color: "#F0B800", show: false, to: "modelConfig" },
        {
          name: "数据管理",
          color: "#00C6FF",
          show: false,
          to: "data/overview"
        },
        { name: "运维管理", color: "#0083FF", show: false, to: "system/user" }
      ]
    };
  },
  computed: {
    ...mapGetters(["role"])
  },
  created() {
    // 请求图片
    this.guideList = this.guideList.map((item, index) => ({
      ...item,
      bg: require(`../../assets/img/guide/beijing-${index + 1}.png`),
      icon: require(`../../assets/img/guide/icon-${index + 1}.png`)
    }));

    // 根据用户权限判断模块的显示
    this.role.forEach((item, index) => {
      switch (item.resIdentif) {
        case "main_menu_1":
          this.$set(this.guideList[0], "show", true);

          break;
        case "main_menu_2":
          this.$set(this.guideList[1], "show", true);

          break;
        case "main_menu_3":
          this.$set(this.guideList[2], "show", true);
          break;
        case "main_menu_4":
          this.$set(this.guideList[4], "show", true);
          break;
        case "main_menu_5":
          this.$set(this.guideList[3], "show", true);
          break;

        default:
          break;
      }
    });
  },

  watch: {},
  methods: {
    changeRoute(show, path) {
      if (show) {
        this.$router.push("/" + path);
      } else {
        this.$Message.error({
          content: "暂无权限",
          duration: 3
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.guide-bg {
  background-image: url("../../assets/img/guide/guide_bg.png");

  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
}
.guide {
  min-height: 100vh;
  h1 {
    padding-left:1rem;
    color: #0083ff;
    line-height: 5rem;
    height:5rem;
    font-size: 2rem;
    margin-bottom: 0;
  }
  &-body {

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: space-between;
    &-top,
    &-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 120px;
    }
    &-top {
      &-left {
        width: 28rem;
        height: 11rem;
        color: rgba(0, 0, 0, 0.75);
        text-indent: 2em;
        padding: 1.25rem;
        font-weight: 500;
        line-height: 1.6rem;
        border-radius: 0.4rem;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
      }
      &-right {
        width: 30%;
        height: 10rem;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    &-bottom {
      &-item {
        &:hover {
          transform: scale(1.15);
        }
        transform: scale(1);
        transition: all 0.2s linear;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 1.2rem;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% 100%;
        width: 230px;
        padding-top: 4rem;
        padding-bottom: 2rem;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 700;

        &-icon {
          width: 56%;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;

          margin-bottom: 1rem;
          padding: 1rem;
          img {
            width: 80%;
          }
        }
      }
    }
  }
}
</style>

