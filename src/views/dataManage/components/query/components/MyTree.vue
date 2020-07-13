<template>
  <div>

  </div>
</template>

<script>
import { getLeavesById } from "@/api/dataManage/query";
export default {
  name: 'mytree',
  data() {
    return {
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      filterText: "",
      space: [],
      nospace: [],
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf:'isLeaf'
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getCatalogue();
  },
  methods: {

  },


};
</script>
