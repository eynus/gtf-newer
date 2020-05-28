<template>
  <div class="h100">
    <Row style="height:100%">
      <i-col span="4" class="h100 scroll-y">
        <div class="pd h100">
          <my-tree :gData="gData" @handleSelect="handleSelect" type="query"></my-tree>
        </div>
      </i-col>
      <i-col span="20" class="pd h100">
        <div class="text-right">
          <RadioGroup v-model="activeMode" type="button">
            <Radio label="normal">数据查看</Radio>
            <Radio label="meta">元数据信息</Radio>
          </RadioGroup>
        </div>
        <div class="bordered w100 h100 mt img-container" :style="{ height: `calc(100% - ${remToPx(2.65)}px)` }">
          <div v-if="activeMode==='normal'">
            <img class="img" src="../../../../assets/img/dataManage/query/map.png" alt />
          </div>
          <div v-else-if="activeMode==='meta'" class="pd meta_info scroll-y h100">
            <div>
              <div class="meta_title">内容信息</div>
              <div>
                <span class="meta_label">数据名称：</span>
                <span>{{activeMetaData.dataName}}</span>
              </div>
              <div>
                <span class="meta_label">数据类型：</span>
                <span>{{activeMetaData.typeName}}</span>
              </div>
              <div>
                <span class="meta_label">内容描述：</span>
                <span>{{activeMetaData.contentDoc}}</span>
              </div>
            </div>
            <div>
              <div class="meta_title">分发信息</div>
              <div>
                <span class="meta_label">负责单位名称：</span>
                <span>{{activeMetaData.proUnit}}</span>
              </div>
              <div>
                <span class="meta_label">联系人：</span>
                <span>{{activeMetaData.realName}}</span>
              </div>
              <div>
                <span class="meta_label">电话：</span>
                <span>{{activeMetaData.userPhone}}</span>
              </div>
              <div>
                <span class="meta_label">通信地址：</span>
                <span>{{activeMetaData.address}}</span>
              </div>
              <div>
                <span class="meta_label">邮政编码：</span>
                <span>{{activeMetaData.postCode}}</span>
              </div>
            </div>
            <div>
              <div class="meta_title">范围信息</div>
              <div>
                <span class="meta_label">上：</span>
                <span>{{activeMetaData.scopeUp}}</span>
              </div>
              <div>
                <span class="meta_label">左：</span>
                <span>{{activeMetaData.scopeLeft}}</span>
              </div>
              <div>
                <span class="meta_label">右：</span>
                <span>{{activeMetaData.scopeRight}}</span>
              </div>
              <div>
                <span class="meta_label">下：</span>
                <span>{{activeMetaData.scopeDown}}</span>
              </div>
            </div>
            <div>
              <div class="meta_title">空间参考</div>
              <div>
                <span class="meta_label">空间参考名称：</span>
                <span>{{activeMetaData.spaceName}}</span>
              </div>
              <div>
                <span class="meta_label">投影：</span>
                <span>{{activeMetaData.projection}}</span>
              </div>
            </div>
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
import MyTree from "_c/myTree/MyTree.vue";
import { getCatalogue, getMetaByName } from "@/api/dataManage/query";
const handleRawData = data => {
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({});
    if (data[i].children) {
      newData[i].children = handleRawData(data[i].children);
    }
    if (data[i].childrens) {
      newData[i].children = handleRawData(data[i].childrens);
    }
    newData[i].key = data[i].dataName;
    newData[i].title = data[i].dataName;
    // pkId作为key,但是后端返回的数据pkId有重复，暂时用的是dataName作为标识
    // newData[i].key = data[i].pkId;
    newData[i].scopedSlots = { title: "title" };
  }
  return newData;
};
export default {
  name: "Home",
  data() {
    return {
      activeMode: "normal",
      activeMetaData: {
        dataName: "",
        dataType: "",
        proUnit: "",
        realName: "",
        userEmail: "",
        userPhone: ""
      },
      gData: [],
      typeList: [
        {
          typeId: "0",
          typeName: "矢量"
        },
        {
          typeId: "1",
          typeName: "栅格"
        },
        {
          typeId: "2",
          typeName: "表格"
        },
        {
          typeId: "3",
          typeName: "其他"
        }
      ],
      timer1: null
    };
  },
  components: { MyTree },
  computed: {},
  created() {
    this.getCatalogue();
  },
  mounted() {
    this.timer1 = setInterval(() => {
      this.getCatalogue();
    }, 1000*60*10);
  },
  beforeDestroy() {
    clearInterval(this.timer1);
  },
  methods: {
    // 获取左侧目录
    getCatalogue() {
      getCatalogue().then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          let result = handleRawData(data);

          this.gData = result;
        }
      });
    },
    // 获取元数据
    getMetaByName(name) {
      getMetaByName({ dataName: name }).then(res => {
        const { data, code } = res.data;
        if (code === 1000) {
          this.activeMetaData = Object.assign(
            data,
            this.typeList.find((item, index) => item.typeId === data.dataType)
          );
        } else {
          this.activeMetaData = {
            dataName: "",
            dataType: "",
            proUnit: "",
            realName: "",
            userEmail: "",
            userPhone: ""
          };
        }
      });
    },
    handleSelect(e) {
      this.getMetaByName(e[0]);
    }
  }
};
</script>
<style lang="scss" scoped>
.card-container {
  .card-title {
    background-color: rgba(0, 0, 0, 0.1);
    font-weight: bold;
  }
  .card-body {
    .card-left-item {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 2px;
      margin: 10px;
      padding: 6px;
      color: white;
      .card-left-item-title {
        font-size: 26px;

        font-weight: bold;
      }
      .card-left-item-total {
        font-size: 26px;
        font-weight: bold;
      }
    }
  }
}
.bordered {
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.img-container {
  overflow: hidden;
  .img {
    width: 100%;
  }
}
.meta_info {
  .meta_title {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 1rem;
    font-weight: bold;
    &:before {
      content: "";
      display: inline-block;
      width: 0.625rem;
      height: 0.625rem;
      background-color: #2d8cf0;
      // border-radius: 50%;
      margin-right: 0.375rem;
    }
  }
  .meta_label {
    display: inline-block;
    width: 10rem;
    line-height: 2;
    margin-left: 20px;
  }
}
</style>