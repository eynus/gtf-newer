<template>
  <div>
    <Modal v-model="visible" class-name="vertical-center-modal" :title="title" :width="remToPx(60)">
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
        <Button @click="cancel">取消</Button>
      </div>
      <Row>
        <Form
          :model="modalKeyFormItem"
          ref="modalKeyFormItem"
          :rules="modalKeyFormRuleValidate"
          :label-width="remToPx(7.5)"
          inline
        >
          <i-col span="12">
            <FormItem label="指标分类：">
              <Input disabled v-model.trim="modalKeyFormItem.classname" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="指标代码：">
              <Input disabled v-model.trim="modalKeyFormItem.code" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="指标名称：" prop="name">
              <Input v-model.trim="modalKeyFormItem.name" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="指标单位：" prop="unit">
              <Select v-model="modalKeyFormItem.unit" style="width:10.25rem">
                <Option
                  :value="item.id"
                  v-for="(item,index) in unitList"
                  :key="`unit_${index}`"
                >{{item.name}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="适用范围：" prop="fitrange">
              <Select v-model="modalKeyFormItem.fitrange" style="width:10.25rem">
                <Option
                  :value="item.id"
                  v-for="(item,index) in fitRangeList"
                  :key="`fitr_${index}`"
                >{{item.name}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="指标类型：" prop="type">
              <Select v-model="modalKeyFormItem.type" style="width:10.25rem">
                <Option
                  :value="item.id"
                  v-for="(item,index) in typeList"
                  :key="`fitr_${index}`"
                >{{item.name}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="值域范围：" prop="valrange">
              <!-- <Input v-model="modalKeyFormItem.valrange" /> -->
              <InputNumber :max="100" :min="1" v-model="modalKeyFormItem.valrange[0]"></InputNumber>-
              <InputNumber :max="100" :min="1" v-model="modalKeyFormItem.valrange[1]"></InputNumber>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="指标来源：" prop="source">
              <Input v-model="modalKeyFormItem.source" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="指标阈值：" prop="max">
              <InputNumber v-model="modalKeyFormItem.max" />
            </FormItem>
          </i-col>
          <i-col span="24">
            <FormItem label="指标涵义：" prop="content">
              <Input type="textarea" v-model="modalKeyFormItem.content" style="width:30rem" />
            </FormItem>
          </i-col>
        </Form>
      </Row>
    </Modal>
  </div>
</template>
<script>
import { remToPx } from "@/utils/common";
import { insertZB,updateZB } from "@/api/modelConfig/config";
export default {
  name: "add-modal",
  props: {
    show: Boolean,
    type: String,
    data: {
      type: Object,
      default: function() {
        return {
          id: 0,
          class: "1",
          code: "1",
          name: "",
          unit: "",
          fitrange: "",
          type: "",
          valrange: ["", ""],
          source: "",
          content: ""
        };
      }
    }
  },
  watch: {
    show(newVal, oldVal) {
      this.visible = newVal;
    },
    type(newVal, oldVal) {
      if (newVal === "add") {
        this.title = "添加指标";
        this.modalKeyFormItem = this.data;
      } else {
        this.title = "修改指标";
        this.modalKeyFormItem = this.data;
      }
    }
  },
  data() {
    return {
      title: "添加指标",
      visible: this.show,
      fitRangeList: [
        { id: 0, name: "全域" },
        { id: 1, name: "城区" }
      ],
      typeList: [
        { id: 0, name: "约束性" },
        { id: 1, name: "预期性" }
      ],
      unitList: [
        { id: 0, name: "平方千米(km²)" },
        { id: 1, name: "百分比(%)" },
        { id: 2, name: "平方米(㎡)" },
        { id: 3, name: "亩" }
      ],
      modalKeyFormRuleValidate: {
        name: [
          {
            required: true,
            message: "指标名称不能为空",
            trigger: "blur"
          }
        ],
        unit: [
          {
            required: true,
            type: "number",
            message: "指标单位不能为空",
            trigger: "change"
          }
        ],
        fitrange: [
          {
            required: true,
            type: "number",
            message: "适用范围不能为空",
            trigger: "change"
          }
        ],
        type: [
          {
            required: true,
            type: "number",
            message: "指标类型不能为空",
            trigger: "change"
          }
        ],
        valrange: [
          // {
          //   required: true,
          //   message: "值域范围不能为空",
          //   trigger: "blur"
          // }
        ],
        source: [
          //   {
          //     required: true,
          //     message: "指标来源不能为空",
          //     trigger: "blur"
          //   }
        ],
        max: [
          //   {
          //     required: true,
          //     message: "指标阈值不能为空",
          //     trigger: "blur"
          //   }
        ],
        content: [
          //   {
          //     required: true,
          //     message: "指标内涵不能为空",
          //     trigger: "blur"
          //   }
        ]
      },
      modalKeyFormItem: {
        class: "",
        code: "1",
        name: "",
        unit: "",
        fitrange: "",
        type: "",
        valrange: ["", ""],
        source: "",
        content: ""
      }
    };
  },

  computed: {},
  created() {},
  methods: {
    // modal取消按钮
    cancel() {
      console.log("cancel");

      this.visible = false;
      this.$emit("showModel", this.visible);
      // this.clearFormItem();
      // this.clearPathAndKeys();
    },
    // modal确认按钮
    ok() {
      this.$refs.modalKeyFormItem.validate(valid => {
        if (valid) {
          let postData = {
            pkId: this.modalKeyFormItem.id,
            pkZbflId: this.modalKeyFormItem.class,
            zbmxCode: this.modalKeyFormItem.code,
            zbmxName: this.modalKeyFormItem.name,
            zbmxType: this.modalKeyFormItem.type,
            zbmxYz: this.modalKeyFormItem.max,
            zbmxZbdw: this.modalKeyFormItem.unit,
            zbmxZbfw: this.modalKeyFormItem.fitrange,
            zbmxZbhy: this.modalKeyFormItem.content,
            zbmxZbly: this.modalKeyFormItem.source,
            zbmxZyfw: this.modalKeyFormItem.valrange.join("~")
          };
          if (this.type === "add") {
            insertZB(postData).then(res => {
              const { code, data } = res.data;
              if (code === 1000) {
                this.visible = false;
                this.$Message.info("添加成功");
                this.$emit("showModel", this.visible);
                this.$emit("handleAdd");
              }
            });
          } else {
             updateZB(postData).then(res => {
              const { code, data } = res.data;
              if (code === 1000) {
                this.visible = false;
                this.$Message.info("修改成功");
                this.$emit("showModel", this.visible);
                this.$emit("handleAdd");
              }
            });
          }
        }
      });
      // this.clearFormItem();
      // this.clearPathAndKeys();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>