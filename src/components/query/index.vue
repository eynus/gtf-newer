<template>
  <div class="global-query">
    <!-- 搜索固定标题行 -->
    <div ref="queryBox" class="queryBox" @click="querySta=!querySta">
      <span class="title">
        查询条件：
      </span>
      <span style="color:#999" v-if="queryArr.length === 0">请点击此处弹出查询窗口</span>
      <span v-for="(item, index) in queryArr" :key="index" class="query">
        {{item.title}}:{{item.label}}
      </span>
    </div>

    <!-- 搜索查询条件下拉框 -->
    <div ref="queryDown" class="queryDown" v-show="querySta">
      <Form ref="formInline" inline :label-width="labelWidth" :model="formInline">
        <FormItem v-for="(item, index) in formArr" :key="index" :label="item.title + '：'" style="margin-bottom: 10px">
          <!-- type：1  文本框-->
          <Input v-if="item.type === 1" type="text" class="queryInput" v-model="formInline[item.field]" :placeholder="item.title"
                 style="width: 250px;height: 36px"></Input>
          <!-- type：2 选择框 -->
          <Select filterable clearable  v-if="item.type === 2" v-model="formInline[item.field]" style="width:250px">
            <Option v-for="(it, ind) in item.data" :value="it.value" :key="ind">{{ it.label }}</Option>
          </Select>
          <!-- type：3 时间日期 -->
          <DatePicker type="datetime" v-if="item.type === 3" format="yyyy-MM-dd HH:mm:ss" v-model="formInline[item.field]" :placeholder="item.title" :option="datetimeOption" style="width: 100%;"></DatePicker>
          <!-- type：4 时间日期范围 -->
          <DatePicker type="datetimerange" v-if="item.type === 4" v-model="formInline[item.field]" format="yyyy-MM-dd HH:mm:ss" :placeholder="item.title" style="width: 100%;"></DatePicker>
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
        for (let i in this.formInline) {
          if (this.formInline[i] !== '' && this.formInline[i] !== undefined) {
            /* 获取展示值label */
            let label
            let fromArrObj = this.formArr.filter(item => item.field === i)[0]
            if (fromArrObj.type === 2) {
              label = fromArrObj.data.filter(item => item.value === this.formInline[i])[0].label
            } else if (fromArrObj.type === 3) {
              label = this.$XEUtils.toDateString(this.formInline[i], 'yyyy-MM-dd HH:mm:ss')
            } else if (fromArrObj.type === 4) {
              if (this.formInline[i][0] === '' || this.formInline[i][1] === '') {
                return false
              } else {
                let arr = [this.$XEUtils.toDateString(this.formInline[i][0], 'yyyy-MM-dd HH:mm:ss'), this.$XEUtils.toDateString(this.formInline[i][1], 'yyyy-MM-dd HH:mm:ss')]
                label =  arr.join('-')
              }
            } else {
              label = this.formInline[i]
            }
            let obj = {
              title: this.formArr.filter(item => item.field === i)[0].title,
              field: i,
              value: this.formInline[i],
              label: label
            }
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
    .queryBox {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      cursor: pointer;
      border-bottom: 1px solid #cfd1d7;
      .title {
        line-height: 36px;
        margin-left: 30px;
        color:#999;
      }
      .query {
        max-width: 200px;
        padding:  3px 5px;
        margin: 5px;
        background: #E7F1FF;
        border: 1px solid #E7F1FF;
        border-radius: 5px;
        color: #97A2B9;
        font-size: 12px;
        line-height: 12px;
        font-weight: 600;
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
      overflow: hidden;
      border: 1px solid #d1d1d1;
      border-top: 0;
      background: #fff;
      .query-footer {
        margin-left: 120px;
      }
    }
  }
</style>
