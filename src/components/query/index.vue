<template>
  <div class="global-query">
    <!-- 搜索固定标题行 -->
    <div ref="queryBox" class="queryBox" @click="querySta=!querySta">
      <span class="title" v-show="queryArr.length === 0">
        查询条件：
      </span>
      <span style="color:#999" v-if="queryArr.length === 0">请点击此处弹出查询窗口</span>
      <div class="query-box" v-if="queryArr.length !== 0">
        <span v-for="(item, index) in queryArr" :key="index" class="query" :title="item.label">
          {{item.title}}:{{item.label}}
        </span>
      </div>
      <span v-show="queryArr.length === 0" class="query-tool">
        <Icon type="ios-search" />
        查询条件
      </span>
    </div>

    <!-- 搜索查询条件下拉框 -->
    <div ref="queryDown" class="queryDown" v-show="querySta">
      <Form ref="formInline" inline :label-width="labelWidth" :model="formInline">
        <FormItem v-for="(item, index) in formArr" :key="index" :label="item.title + '：'" style="margin-bottom: 10px">
          <!-- type：1  文本框-->
          <Input v-if="item.type === 1" type="text" class="queryInput" v-model="formInline[item.field]" :placeholder="item.title" clearable
                 style="width: 250px;height: 36px"></Input>
          <!-- type：2 选择框 -->
          <Select filterable clearable  v-if="item.type === 2" v-model="formInline[item.field]" style="width:250px">
            <Option v-for="(it, ind) in item.data" :value="it.value" :key="ind">{{ it.label }}</Option>
          </Select>
          <!-- type：3 时间日期 -->
          <DatePicker type="datetime" v-if="item.type === 3" format="yyyy-MM-dd HH:mm:ss" v-model="formInline[item.field]" :placeholder="item.title" :option="datetimeOption" clearable style="width:250px"></DatePicker>
          <!-- type：4 时间日期范围 -->
          <DatePicker type="datetimerange" v-if="item.type === 4" v-model="formInline[item.field]" format="yyyy-MM-dd HH:mm:ss" :placeholder="item.title" style="width:250px"></DatePicker>
        </FormItem>
        <div class="query-footer">
          <Button type="primary" size="small" @click.stop="cleardata">清空</Button>
          <Button type="primary" size="small" @click.stop="query" style="margin-left: 15px">查询</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
  import { remToPx } from "@/utils/common";
  import XEUtils from 'xe-utils'
  export default {
    name: 'query',
    props: {
      formArr: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        labelWidth: remToPx(8),
        formInline: {}, // 查询表单值
        querySta: false, // 查询弹出框状态控制
        datetimeOption: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
      }
    },
    computed: {
      // 查询条件返回数组
      queryArr: function () {
        let arr = []
        let obj = {}
        for (let i in this.formInline) {
          if (this.formInline[i] !== '' && this.formInline[i] !== undefined) {
            /* 获取展示值label */
            let label, value
            let fromArrObj = this.formArr.filter(item => item.field === i)[0]
            if (fromArrObj.type === 2) {
              label = fromArrObj.data.filter(item => item.value === this.formInline[i])[0].label
            } else if (fromArrObj.type === 3) {
              label = XEUtils.toDateString(this.formInline[i])
              value = XEUtils.toDateString(this.formInline[i])
            } else if (fromArrObj.type === 4) {
              if (this.formInline[i][0] === '' && this.formInline[i][1] === '') {
                continue
              } else {
                let arr = [XEUtils.toDateString(this.formInline[i][0]), XEUtils.toDateString(this.formInline[i][1])]
                // 判断需要时间对象还是日期格式
                if (fromArrObj.date === 'object') {
                  value = [this.formInline[i][0], this.formInline[i][1]]  // 时间对象
                } else {
                  value = arr // YYYY-MM-DD HH:ii:ss
                }
                label =  arr.join('-')
              }
            } else {
              label = this.formInline[i]
            }
            if (!value) {
              value = this.formInline[i]
            }
            obj = {
              ...obj,
              title: this.formArr.filter(item => item.field === i)[0].title,
              field: i,
              value: value,
              label: label
            }
            console.log(obj)
            arr.push(obj)
          }
        }
        return arr
      }
    },
    mounted () {
      document.addEventListener('click', this.queryHide)
    },
    beforeDestroy () {
      document.removeEventListener('click', this.queryHide)
    },
    methods: {
      /* 清空查询数据 */
      cleardata () {
        this.formInline = {}
      },
      /* 点击查询 */
      query () {
        this.querySta = false
        let obj = {}
        for (let i in this.queryArr) {
          obj[this.queryArr[i].field] = this.queryArr[i].value
        }
        this.$emit('query', obj)
      },
      /* 点击任意地方隐藏搜索栏 */
      queryHide (e) {
        if ((!this.$refs.queryBox.contains(e.target)) && (!this.$refs.queryDown.contains(e.target))) {
          this.querySta = false
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .global-query {
    position: relative;
    .query-tool {
      float: right;
      display: inline-block;
      margin-right: 20px;
      color: #4292FF;
    }
    .queryBox {
      line-height: 35px;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
      z-index: 900;
      background: #fff;
      font-size: 14px;
      box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
      border-bottom: 1px solid #dae0e4;
      .query-box {
        min-height: 36px;
        margin-left: 30px;
        padding-bottom: 5px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
      }
      .title {
        line-height: 36px;
        margin-left: 30px;
        color:#999;
      }
      .query {
        padding: 5px 10px;
        margin: 3px 5px 0 5px;
        max-width: 200px;
        color: #97A2B9;
        font-size: 12px;
        line-height: 12px;
        background: rgba(31, 93, 234, 0.08);
        border: 1px solid #E7F1FF;
        border-radius: 2px;
        flex-wrap: nowrap;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .queryDown {
      position: absolute;
      z-index: 100;
      width: 100%;
      padding: 10px 0;
      border: 1px solid #d1d1d1;
      border-top: 0;
      background: #fff;
      .query-footer {
        margin-left: 120px;
      }
    }
  }
</style>
