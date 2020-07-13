import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'


const config = {
  dictionary: {
    zh_CN
  },
  fieldsBagName: 'vee-fields'
}
Validator.localize('zh_CN')

Vue.use(VeeValidate, config)
