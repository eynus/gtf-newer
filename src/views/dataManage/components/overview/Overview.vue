<template>
  <div class="h100">
    <div class="card-container">
      <div class="card-title">
        <Icon custom="iconfont  icon-type" size="16" color="#2d8cf0" />
        <span class="ml">分类汇总</span>
      </div>
      <div class="card-body pd-lg">
        <Row>
          <i-col span="14">
            <Row type="flex" :gutter="12">
              <i-col span="12" order="1" v-for="(item,index) in typesTotal" :key="`type_${index}`">
                <div class="card-left-item" :style="`backgroundColor:${item.bgColor}`">
                  <div class="card-left-item-title">
                    <Icon :custom="`${item.icon}`" size="30" color="#fff" />
                    <span class="ml">{{item.name}}</span>
                  </div>
                  <div>
                    <Row type="flex" align="bottom">
                      <i-col span="18">
                        <Row type="flex">
                          <i-col span="12">
                            <span>{{item.firstChilds}}个一级子类</span>
                          </i-col>
                          <i-col span="12">
                            <span>{{item.secondChilds}}个二级子类</span>
                          </i-col>
                        </Row>
                      </i-col>
                      <i-col span="6">
                        <div>
                          <span class="card-left-item-total">{{item.totalChilds}}</span> 个
                        </div>
                      </i-col>
                    </Row>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
          <i-col span="10">
            <rose-chart style="height:260px"></rose-chart>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <Icon custom="iconfont  icon-input" size="16" color="#2d8cf0" />
        <span class="ml">入库历史</span>
      </div>
      <div class="card-body">
        <Form
          ref="formInline"
          :model="formInline"
          inline
          style="margin-top:.75rem"
          class="search-box smzx-search-box"
          label-position="right"
          :label-width="100"
        >
          <FormItem label="入库时间：">
            <DatePicker
              type="daterange"
              :value="formInline.date"
              @on-change="handleDateChange"
              placeholder="请选择起止日期"
              :clearable="false"
              class="smzx-normal-datepick smzx-date-range"
            ></DatePicker>
          </FormItem>
          <FormItem label="数据路径：">
            <Input v-model.trim="formInline.path" placeholder="请选择" clearable />
          </FormItem>
          <FormItem label="数据类型：">
            <!-- <Input v-model.trim="formInline.facename" placeholder="请选择" clearable /> -->
            <Select v-model="formInline.type" class="scroll dropdown" style="width:8.75rem">
              <Option v-for="item in typeList" :value="item.id" :key="item.id">
                {{
                item.name
                }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="上传用户：">
            <Input v-model.trim="formInline.uploader" placeholder="请选择" clearable />
            <!-- <Select v-model="formInline.uploader" class="scroll dropdown" style="width:8.75rem">
              <Option v-for="item in uploaderList" :value="item.id" :key="item.id">
                {{
                item.name
                }}
              </Option> 
            </Select>-->
          </FormItem>
          <FormItem :label-width="remToPx(2)">
            <Button type="primary" class="smzx-search-btn" @click="handleSubmit">查询</Button>
          </FormItem>
        </Form>

        <Table border size="small" :columns="columnsPutIn" :data="dataPutIn" class="ml-lg mr-lg">
          <template slot="path" slot-scope="{row,index}">
            <a href="#">现状数据/基础测绘/基础地理/水系/2019年昭通市水系</a>
          </template>
        </Table>
        <div class="text-right mr-lg">
          <Page
            :total="page.total"
            @on-change="changePage"
            show-total
            show-elevator
            :current="page.current"
            :page-size="page.pageSize"
          ></Page>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // @ is an alias to /src
  import { format } from 'date-fns'
  import RoseChart from './components/RoseChart.vue'
  export default {
    name: 'Home',
    components: {
      RoseChart
    },
    data() {
      return {
        typesTotal: [
          {
            name: '现状数据',
            firstChilds: 1,
            secondChilds: 2,
            totalChilds: 3,
            bgColor: 'rgb(0,131,255)',
            icon: 'iconfont icon-earth'
          },
          {
            name: '规划数据',
            firstChilds: 1,
            secondChilds: 21,
            totalChilds: 22,
            bgColor: 'rgb(255,195,0)',
            icon: 'iconfont icon-hill'
          },
          {
            name: '管理数据',
            firstChilds: 1,
            secondChilds: 12,
            totalChilds: 13,
            bgColor: 'rgb(67,207,124)',
            icon: 'iconfont icon-setting'
          },
          {
            name: '社会经济数据',
            firstChilds: 12,
            secondChilds: 12,
            totalChilds: 24,
            bgColor: 'rgb(227,60,100)',
            icon: 'iconfont icon-person'
          }
        ],
        columnsPutIn: [
          {
            title: '入库时间',
            key: 'time',
            align: 'center'
          },
          {
            title: '数据路径',
            slot: 'path',
            align: 'center'
          },
          {
            title: '数据类型',
            key: 'type',
            align: 'center'
          },
          {
            title: '上传用户',
            key: 'uploader',
            align: 'center'
          }
        ],
        dataPutIn: [
          {
            uploader: 'user1',
            type: '矢量',
            time: '2016-10-03'
          },
          {
            uploader: 'user2',
            type: '影像',
            time: '2016-10-11'
          },
          {
            uploader: 'user1',
            type: '矢量',
            time: '2016-10-03'
          },
          {
            uploader: 'user2',
            type: '影像',
            time: '2016-10-11'
          },
          {
            uploader: 'user1',
            type: '矢量',
            time: '2016-10-03'
          },
          {
            uploader: 'user1',
            type: '矢量',
            time: '2016-10-03'
          }
        ],
        formInline: {
          path: '',
          date: [
            format(new Date(), 'yyyy-mm-dd'),
            format(new Date(), 'yyyy-mm-dd')
          ],
          uploader: '',
          type: '-1'
        },
        typeList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '0',
            name: '无'
          },
          {
            id: '1',
            name: '进入'
          },
          {
            id: '2',
            name: '出去'
          }
        ],
        // uploaderList: [
        //   {
        //     id: "-1",
        //     name: "张三"
        //   },

        //   {
        //     id: "2",
        //     name: "李四"
        //   }
        // ],
        page: {
          current: 1,
          total: 0,
          pageSize: 8
        }
      }
    },
    computed: {
      menuitemClasses() {
        return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
      }
    },
    methods: {
      handleSubmit() {},
      handleDateChange(e) {
        this.formInline.date = e
      },
      changePage(index) {
        this.page.current = index
        this.getrlsbcx2()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .card-container {
    // &:nth-of-type(1){
    //   height: 45%;
    // }
    // &:nth-of-type(2){
    //   height: 55%;
    // }
    .card-title {
      background-color: rgba(0, 0, 0, 0.1);
      font-weight: bold;

      line-height: 1.75;
      color: rgb(81, 81, 81);
      padding: 0 4px;
    }
    .card-body {
      .card-left-item {
        border-radius: 0.25rem;
        margin: 1rem;
        padding: 0.75rem;
        color: white;
        .card-left-item-title {
          font-size: 1.5rem;

          font-weight: 500;
        }
        .card-left-item-total {
          font-size: 2rem;
          font-weight: bold;
        }
      }
    }
  }
</style>