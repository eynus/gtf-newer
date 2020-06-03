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
            <Form
              ref="loginForm"
              :rules="ruleFormValidate"
              :model="form"
              @keydown.enter.native="handleSubmit"
            >
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
    <div class="position-a-b-c">
      <my-footer color="rgb(200,200,200)"></my-footer>
    </div>
    <Modal
      v-model="modalFlag"
      class-name="vertical-center-modal"
      title="请先设置新密码"
      :width="remToPx(40)"
    >
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确定</Button>
      </div>
      <Form
        class="pd-lg"
        ref="formModalValidate"
        :model="formModalValidate"
        :rules="ruleModalValidate"
        :label-width="100"
      >
        <FormItem label="新密码：" prop="password">
          <Input
            v-model="formModalValidate.password"
            type="password"
            clearable
            placeholder="请输入新密码"
          />
        </FormItem>

        <FormItem label="确认密码：" prop="password2">
          <Input
            v-model="formModalValidate.password2"
            type="password"
            clearable
            placeholder="请确认新密码"
          />
        </FormItem>
        <FormItem>
          <div class="text-blue">注意：密码不能少于八位，至少包含一位字母和一位数字</div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import MyFooter from "@/components/MyFooter";
import { getPublicKey, updateUserPwd } from "@/api/user/user";
import { JSEncrypt } from "jsencrypt";
import config from "@/config";
import { mapActions } from "vuex";
import { baseUrl_user } from "@/api/set";
export default {
  components: { MyFooter },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("新密码不能为空"));
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) {
        return callback(
          new Error("密码不能少于八位，至少包含一位字母和一位数字")
        );
      }
      callback();
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("确认密码不能为空"));
      } else if (value !== this.formModalValidate.password) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    return {
      formModalValidate: {
        password: "",
        password2: ""
      },
      ruleModalValidate: {
        password: [
          {
            validator: validatePassword,
            trigger: "blur"
          }
        ],
        password2: [
          {
            validator: validatePassCheck,
            trigger: "blur"
          }
        ]
      },
      modalFlag: false,
      form: {
        userName: "",
        password: "",
        validateCode: ""
      },
      ruleFormValidate: {
        userName: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        validateCode: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ]
      },
      validateCodeSrc: "",
      publicKey: "",
      encryptor: new JSEncrypt()
    };
  },
  created() {
    this.getPublicKey();
  },
  computed: {},
  methods: {
    ...mapActions(["handleLogin"]),
    // modal框确定按钮
    ok() {
      this.$refs.formModalValidate.validate(valid => {
        if (valid) {
          updateUserPwd({
            password: this.formModalValidate.password,
            userName: this.form.userName
          })
            .then(res => {
              const { code, data, message } = res.data;
              if (code === 1000) {
                this.modalFlag = false;
                this.$Message.info("修改成功！请重新登录");
                this.$refs["loginForm"].resetFields();
              } else {
                this.$Message.info(message);
              }
            })
            .catch(res => {
              this.$Message.info(res);
            });
        }
      });
    },
    // modal取消按钮
    cancel() {
      this.modalFlag = false;
      this.$refs["formModalValidate"].resetFields();
    },
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
        // config.baseUrl.dev +
        baseUrl_user +
        "api/system/getGenerationVerificationCode?publicKey=" +
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
            .then(res => {
              console.log(res);

              if (res === "init") {
                this.modalFlag = true;
              } else {
                this.$router.push({ path: `/home` });
              }
            })
            .catch(err => {
              // if(err==='验证码错误！'){
                this.getPublicKey()
              // }
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
    transform: translate(-2%, -350%);
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
    transform: translate(28%, -48%);
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
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>
