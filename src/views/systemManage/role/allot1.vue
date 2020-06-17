<template>
  <div>
    <Drawer
      title="权限分配"
      v-model="drawer"
      width="550"
      :styles="styles"
      @on-visible-change="resetForm"
    >
      <Form :model="formData" :rules="rules" ref="form" label-position="left" :label-width="100">
        <Row>
          <i-col class-name="col-item">
            <FormItem label="角色名称" prop="roleName">
              <div>{{ roleName }}</div>
            </FormItem>
          </i-col>
          <i-col class-name="col-item">
            <FormItem label="权限分配" prop="resourcesIds">
              <Input v-model="formData.resourcesIds" v-show="false" />
        
              <el-tree
                :data="resource"
                check-strictly
                :props="treeFields"
                ref="tree"
                :default-checked-keys="resourcesIds"
                show-checkbox
                node-key="pkId"
                :expand-on-click-node="true"
                @check="resourceCheck"
              ></el-tree>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" type="primary" @click="onSubmit">提交</Button>
        <Button @click="close">关闭</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import {
  resources,
  resourceByRid,
  resourceToUser
} from "@/api/systemManage/user";
const handleData = data => {
  let val = [];
  data.forEach(item => {
    val.push(item.pkId);
    if (item.childs.length) {
      let result = handleData(item.childs);
      val = val.concat(result);
    }
  });
  return val;
};
export default {
  name: "allot",
  data() {
    return {
      drawer: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      roleName: "",
      formData: {
        resourcesIds: "",
        roleId: ""
      },
      rules: {
        resourcesIds: [{ required: true, message: "请选择角色权限！" }]
      },
      resourcesIds: [],
      realIds: [],
      treeFields: {
        children: "childs",
        label: "resName",
        id: "pkId"
      },
      resource: [] // 资源tree
    };
  },
  methods: {
    open(selection) {
      this.drawer = true;
      this.formData.roleId = selection[0].pkId;
      this.roleName = selection[0].roleName;
      this.getList();
    },
    close() {
      this.drawer = false;
      this.resetForm();
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
    resourceCheck(v, e,node) {
      this.resourcesIds = e.checkedKeys
      if (e.checkedKeys.length) {
        this.formData.resourcesIds = 1;
      } else {
        this.formData.resourcesIds = "";
      }
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          
          let param = {
            resourcesIds: this.resourcesIds,
            roleId: this.formData.roleId
          };
          resourceToUser(param).then(res => {
            if (res.data.code === 1000) {
              this.$Message.success("权限分配成功，退出重新登录后生效！");
              this.drawer = false;
              this.$emit("close");
            } else {
              this.$Message.error(res.data.message);
            }
          });
        }
      });
    },
    getList() {
      resources().then(res => {
        if (res.data.code === 1000) {
          this.resource = res.data.data;
          this.getRList();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    getRList() {
      resourceByRid({ pkId: this.formData.roleId }).then(res => {
        if (res.data.code === 1000) {
          let data = res.data.data;
          data = data ? handleData(data) : [];
          this.resourcesIds = data;
          this.formData.resourcesIds = data.length ? 1 : null;
        } else {
          this.$Message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: center;
  background: #fff;
}
.col-item {
  padding: 5px 20px;
}
</style>
