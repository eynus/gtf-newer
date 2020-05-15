<template>
  <div class="login">
    <header class="login-title">
      <h1>昭通市国土空间基础信息平台</h1>
    </header>
    <div class="aa"></div>
    <div class="login-con">
      <Card :bordered="false">
        <div class="card-inner">
          <h2>用户登录</h2>
          <div class="form-con">
            <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
              <FormItem prop="userName">
                <i-input
                  v-model="form.userName"
                  class="smzx-input-native"
                  size="large"
                  placeholder="请输入用户名"
                >
                  <span slot="prepend">
                    <Icon :size="18" :color="'rgba(0,0,0,0.3)'" type="ios-person"></Icon>
                  </span>
                </i-input>
              </FormItem>
              <FormItem prop="password">
                <i-input
                  type="password"
                  class="smzx-input-native"
                  v-model="form.password"
                  size="large"
                  placeholder="请输入密码"
                >
                  <span slot="prepend">
                    <Icon :size="18" :color="'rgba(0,0,0,0.3)'" type="md-lock"></Icon>
                  </span>
                </i-input>
              </FormItem>
              <FormItem prop="validateCode">
                <Row :gutter="16">
                  <i-col span="12">
                    <i-input
                      class="smzx-input-native"
                      v-model="form.validateCode"
                      size="large"
                      placeholder="请输入验证码"
                    >
                      <span slot="prepend">
                        <Icon :size="18" :color="'rgba(0,0,0,0.3)'" type="md-checkbox"></Icon>
                      </span>
                    </i-input>
                  </i-col>
                  <i-col span="12">
                    <!-- <Button @click="handleSubmit" type="primary" size="large" long class="let-spc">登录</Button> -->
                    <div class="validate-code" @click="getPublicKey">
                      <img :src="validateCodeSrc" alt class="w100" />
                    </div>
                  </i-col>
                </Row>
              </FormItem>
              <FormItem>
                <Button @click="handleSubmit" type="primary" size="large" long class="let-spc">登录</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </Card>
    </div>
    <my-footer color="rgb(200,200,200)"></my-footer>
  </div>
</template>

<script>
import MyFooter from "@/components/MyFooter";
import { getPublicKey } from "@/api/user/user";
import { JSEncrypt } from "jsencrypt";
import config from "@/config";
import { mapActions } from "vuex";
export default {
  components: { MyFooter },
  data() {
    return {
      form: {
        userName: "",
        password: "",
        validateCode: ""
      },
      validateCodeSrc: "",
      publicKey: "",
      encryptor: new JSEncrypt()
    };
  },
  created() {
    this.getPublicKey();
  },
  computed: {
    rules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        validateCode: this.codeRules
      };
    }
  },
  methods: {
    ...mapActions(["handleLogin"]),
    //加密密码
    encryptedData(data) {
      // 设置公钥
      this.encryptor.setPublicKey(this.publicKey);
      return this.encryptor.encrypt(data);
    },
    getPublicKey() {
      getPublicKey({}).then(res => {
        const { code, data } = res.data;
        if (code === 1000) {
          this.publicKey = data;
          this.getverCode();
        }
      });
    },
    // 获取验证码
    getverCode() {
      this.validateCodeSrc =
        config.baseUrl.dev +
        "lsp/api/system/getGenerationVerificationCode?publicKey=" +
        this.publicKey;
    },
    // 验证通过后进行登录请求
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let jm_username = this.encryptedData(this.form.userName);
          let jm_password = this.encryptedData(this.form.password);
          let jm_ver = this.encryptedData(this.form.validateCode);
          //调用vuex中handleLogin方法
          this.handleLogin({
            // kaptcha: encodeURI(jm_ver).replace(/\+/g, '%2B'),
            kaptcha: encodeURI(jm_ver),
            username: encodeURI(jm_username),
            password: encodeURI(jm_password),
            type: 0,
            publicKey: this.publicKey
          })
            .then(() => {
              // this.$Message.info({
              //   content: res,
              //   duration: 5
              // });
              this.$router.push({ path: `/home` });
            })
            .catch(err => {
              this.$Message.error({
                content: err,
                duration: 5
              });
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url("../../assets/img/login/login_bg.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  .login-title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-10%, -380%);
    z-index: 1001;

    h1 {
      color: #ffffff;
      font-size: 3rem;
      font-weight: 400;
      letter-spacing: 0.25rem;
    }
  }

  &-con {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(15%, -40%);
    width: 400px;
    z-index: 1001;
    h2 {
      color: rgb(28, 145, 255);
      font-size: 1.25rem;
      text-align: center;
      font-weight: 500;
      letter-spacing: 0.125rem;
      margin: 10px;
    }
    &-header {
      font-size: 1rem;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }

    .form-con {
      padding: 10px 0 0;
    }

    .login-tip {
      font-size: 0.625rem;
      text-align: center;
      color: #c3c3c3;
    }
  }
}

.ivu-card {
  width: 25rem;
  //   padding: 0.6rem;
  background-color: rgba(255, 255, 255, 0.5);
  .card-inner {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 4px;
  }
}

.ivu-form-item-error .ivu-input-group-append,
.ivu-form-item-error .ivu-input-group-prepend {
  background-color: #f8f8f900;
}

.ivu-input-group-append,
.ivu-input-group-prepend {
  background-color: #f8f8f900;
}

.ivu-input {
  color: #fff;
  background-color: #fff0;
}
.validate-code {
  cursor: pointer;
  width: 100%;
  //   background-color: #2d8cf0;
  background-color: rgba(0, 0, 0, 0.1);
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  &:hover {
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
