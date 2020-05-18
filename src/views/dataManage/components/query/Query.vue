<template>
  <div class="h100">
    <Row style="height:100%">
      <i-col span="4">
        <div style="padding:10px">
          <Input style="margin-bottom: 8px" placeholder="请输入关键字进行搜索" @on-change="onChange" />
          <!-- <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" /> -->
          <a-tree
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="gData"
            @expand="onExpand"
          >
            <template slot="title" slot-scope="{ title }">
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span
                  style="color: #f50"
                >{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </template>
          </a-tree>
        </div>
      </i-col>
      <i-col span="20" class="pd h100">
        <div class="text-right">
          <!-- <ButtonGroup>
            <Button type="primary">数据查看</Button>
            <Button>元数据信息</Button>
          </ButtonGroup>-->
          <RadioGroup v-model="activeMode" type="button">
            <Radio label="normal">数据查看</Radio>
            <Radio label="meta">元数据信息</Radio>
          </RadioGroup>
        </div>
        <div class="bordered w100 h100 mt img-container" :style="{ height: `calc(100% - 42px)` }">
          <div v-if="activeMode==='normal'">
            <img class="img" src="../../../../assets/img/dataManage/query/map.png" alt />
          </div>
          <div v-else-if="activeMode==='meta'" class="pd meta_info scroll-y h100">
            <div>
              <div class="meta_title">内容信息</div>
              <div>
                <span class="meta_label">数据名称：</span>
                <span>SDE2019年影像</span>
              </div>
              <div>
                <span class="meta_label">数据类型：</span>
                <span>SDE栅格</span>
              </div>
              <div>
                <span class="meta_label">内容描述：</span>
                <span>2019年昭通市全域形象</span>
              </div>
            </div>
            <div>
              <div class="meta_title">分发信息</div>
              <div>
                <span class="meta_label">负责单位名称：</span>
                <span>昭通市国土资源与规划局</span>
              </div>
              <div>
                <span class="meta_label">联系人：</span>
                <span>xx</span>
              </div>
              <div>
                <span class="meta_label">电话：</span>
                <span>188-9999-9898</span>
              </div>
              <div>
                <span class="meta_label">通信地址：</span>
                <span>云南省昭通市昭阳区昭阳大道348号</span>
              </div>
              <div>
                <span class="meta_label">邮政编码：</span>
                <span>657000</span>
              </div>
            </div>
            <div>
              <div class="meta_title">范围信息</div>
              <div>
                <span class="meta_label">上：</span>
                <span></span>
              </div>
              <div>
                <span class="meta_label">左：</span>
                <span></span>
              </div>
              <div>
                <span class="meta_label">右：</span>
                <span></span>
              </div>
              <div>
                <span class="meta_label">下：</span>
                <span></span>
              </div>
            </div>
            <div>
              <div class="meta_title">空间参考</div>
              <div>
                <span class="meta_label">空间参考名称：</span>
                <span>CDCS2000_GK_CM_105E</span>
              </div>
              <div>
                <span class="meta_label">投影：</span>
                <span>Gauss_Kruger</span>
              </div>
            </div>
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
// @ is an alias to /src
const x = 3;
const y = 2;
const z = 1;
let gData = [];

// const generateData = (_level, _preKey, _tns) => {
//   const preKey = _preKey || "0";
//   const tns = _tns || gData;

//   const children = [];
//   for (let i = 0; i < x; i++) {
//     const key = `${preKey}-${i}`;
//     tns.push({ title: key, key, scopedSlots: { title: "title" } });
//     if (i < y) {
//       children.push(key);
//     }
//   }
//   if (_level < 0) {
//     return tns;
//   }
//   const level = _level - 1;
//   children.forEach((key, index) => {
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };
// generateData(z);
gData = [
  {
    children: [
      {
        key: "基础绘测",
        scopedSlots: { title: "title" },
        title: "基础绘测",
        children: [
          {
            key: "基础地理",
            title: "基础地理",
            scopedSlots: { title: "title" }
          },
          { key: "影像图", title: "影像图", scopedSlots: { title: "title" } },
          { key: "地形图", title: "地形图", scopedSlots: { title: "title" } }
        ]
      },
      {
        key: "地质环境",
        scopedSlots: { title: "title" },
        title: "地质环境",
        children: [
          {
            key: "资源调查",
            title: "资源调查",
            scopedSlots: { title: "title" }
          },
          {
            key: "城乡建设",
            title: "城乡建设",
            scopedSlots: { title: "title" }
          },
          {
            key: "生态环境保护",
            title: "生态环境保护",
            scopedSlots: { title: "title" }
          }
        ]
      },
      {
        key: "历史文化保护",
        scopedSlots: { title: "title" },
        title: "历史文化保护",
        children: [
          {
            key: "资源感知",
            title: "资源感知",
            scopedSlots: { title: "title" }
          },
          {
            key: "管理数据",
            title: "管理数据",
            scopedSlots: { title: "title" }
          },
          {
            key: "社会经济数据",
            title: "社会经济数据",
            scopedSlots: { title: "title" }
          }
        ]
      }
    ],
    key: "现状数据",
    title: "现状数据",
    scopedSlots: { title: "title" }
  },
  {
    children: [
      {
        key: "0-1-0",
        scopedSlots: { title: "title" },
        title: "0-1-0",
        children: [
          { key: "0-1-0-0", title: "0-1-0-0", scopedSlots: { title: "title" } },
          { key: "0-1-0-1", title: "0-1-0-1", scopedSlots: { title: "title" } },
          { key: "0-1-0-2", title: "0-1-0-2", scopedSlots: { title: "title" } }
        ]
      },
      {
        key: "0-1-1",
        scopedSlots: { title: "title" },
        title: "0-1-1",
        children: [
          { key: "0-1-1-0", title: "0-1-1-0", scopedSlots: { title: "title" } },
          { key: "0-1-1-1", title: "0-1-1-1", scopedSlots: { title: "title" } },
          { key: "0-1-1-2", title: "0-1-1-2", scopedSlots: { title: "title" } }
        ]
      },
      {
        key: "0-1-2",
        scopedSlots: { title: "title" },
        title: "0-1-2",
        children: [
          { key: "0-1-2-0", title: "0-1-2-0", scopedSlots: { title: "title" } },
          { key: "0-1-2-1", title: "0-1-2-1", scopedSlots: { title: "title" } },
          { key: "0-1-2-2", title: "0-1-2-2", scopedSlots: { title: "title" } }
        ]
      }
    ],
    key: "规划数据",
    title: "规划数据",
    scopedSlots: { title: "title" }
  }
];
const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
export default {
  name: "Home",
  data() {
    return {
      activeMode: "normal",
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      gData,
      inputVal: "",
      data1: [
        {
          title: "parent 1",
          expand: false,
          children: [
            {
              title: "parent 1-1",
              expand: false,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  computed: {},
  methods: {
    handleSearch(e) {
      console.log(e);
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const value = e.target.value;
      console.log("datalist：", dataList);
      const expandedKeys = dataList
        .map(item => {
          if (item.key.indexOf(value) > -1) {
            return getParentKey(item.key, gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.card-container {
  // margin:4px;
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