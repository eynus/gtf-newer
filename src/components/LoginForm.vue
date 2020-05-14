<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <i-input v-model="form.userName" class="smzx-input-native" size="large" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" :color="'rgba(0,0,0,0.3)'" type="ios-person"></Icon>
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
          <Icon :size="16" :color="'rgba(0,0,0,0.3)'" type="md-lock"></Icon>
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
              <Icon :size="16" :color="'rgba(0,0,0,0.3)'" type="md-checkbox"></Icon>
            </span>
          </i-input>
        </i-col>
        <i-col span="12">
          <!-- <Button @click="handleSubmit" type="primary" size="large" long class="let-spc">登录</Button> -->
          <img :src="validateCodeSrc" alt class="validate-code" @click="refresh()" />
        </i-col>
      </Row>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" size="large" long class="let-spc">登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { getPublicKey } from "@/api/user";
export default {
  name: "LoginForm",
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "密码不能为空", trigger: "blur" }];
      }
    },
    codeRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "验证码不能为空", trigger: "blur" }];
      }
    }
  },
  data() {
    return {
      form: {
        userName: "",
        password: "",
        validateCode: ""
      },
      validateCodeSrc: "",
      publicKey: ""
    };
  },
  created() {
    // 获取publickey
    getPublicKey().then(res => {
      const { code, data } = res.data;
      if (code === 1000) {
        this.publicKey = data;
        this.validateCodeSrc =
          "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1589339447&di=ef59a56d62a52ef1552731461b87c295&src=http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg";
      }
    });
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
    refresh() {},
    //登录提交
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit("on-success-valid", {
            userName: this.form.userName,
            password: this.form.password,
            code: this.form.validateCode
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>