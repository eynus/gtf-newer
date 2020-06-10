import { getZJListPageById, startRules, deleteRules, stopRules } from "@/api/dataManage/inspection";

const InspectionMixins = {
    data() {
        return {
            queryRulesFitObj: "",
            delModalFlag: false,
            unstartedArr: [],//未启用集合
            startedArr: [],//已启用集合
            isRuleUpdate: false,
            selectedRowIds: [],
            page: {
                current: 1,
                total: 0,
                pageSize: 10
            },
        }
    },
    methods: {
        // 添加规则
        handleAddRule() {
            this.isRuleUpdate = false;
            this.modalFlag = true;
        },

        // 删除规则
        handleDeleteRule() {
            if (this.selectedRowIds.length) {
                this.delModalFlag = true;

            } else {
                this.$Message.info("请选择所要删除的规则");
            }
        },
        // 确认启用
        handleStartRule() {
            console.log('this.startedArr', this.startedArr);
            console.log('this.unstartedArr', this.unstartedArr);
            if (this.selectedRowIds.length) {
                if (_.intersection(this.selectedRowIds, this.startedArr).length) {
                    this.$Message.info("您选择的规则中包含已启用项！");
                } else {
                    startRules({ ids: this.selectedRowIds.join(',') }).then(res => {
                        const { data, code } = res.data;
                        if (code === 1000) {
                            this.$Message.info('启用成功！')
                            this.getZJListPageById()
                        }
                    })
                }
            } else {
                this.$Message.info("请选择规则");
            }
        },
        // 确认停止启用
        handleStopRule() {
            console.log('this.startedArr', this.startedArr);
            console.log('this.unstartedArr', this.unstartedArr);
            if (this.selectedRowIds.length) {
                if (_.intersection(this.selectedRowIds, this.unstartedArr).length) {
                    this.$Message.info("您选择的规则中包含未启用项！");
                } else {
                    stopRules({ ids: this.selectedRowIds.join(',') }).then(res => {
                        const { data, code } = res.data;
                        if (code === 1000) {
                            this.$Message.info('停止启用成功！')
                            this.getZJListPageById()
                        }
                    })
                }
            } else {
                this.$Message.info("请选择规则");
            }
        },
        // 删除确认
        confirmDel() {
            // 删除规则
            this.delModalFlag = false;
            deleteRules({ ids: this.selectedRowIds.join(',') }).then(res => {
                const { data, code } = res.data;
                if (code === 1000) {
                    this.$Message.info('删除成功！')
                    this.getZJListPageById()
                }
            })
        },
        // 删除取消
        quitDel() {
            this.delModalFlag = false
        },
        //切换页数
        changePage(index) {
            this.page.current = index;
            this.getZJListPageById();
        },
        // 请求list
        getZJListPageById() {
            let postData = {
                dataName: this.queryRulesFitObj,
                pageNum: this.page.current,
                pageSize: this.page.pageSize,
                queryTerms: {

                    createdBy: "",
                    createdTime: "",
                    pkId: 0,
                    rdIdentify: "",
                    rulesCode: "",
                    rulesMlId: this.$route.query.id,
                    rulesName: "",
                    unCheck: "",
                    unRead: "",
                    unUpdate: "",
                    updatedBy: "",
                    updatedTime: "",
                    validity: ""
                }
            };
            getZJListPageById(postData).then(res => {
                this.tableData = []
                this.selectedRowIds = []
                this.startedArr=[]
                this.unstartedArr=[]
                const { data, code } = res.data;
                if (code === 1000) {
                    this.page.total = data.total
                    data.list.forEach(item => {
                        let newData = {
                            ...item,
                            id: item.pkId,
                            ruleStatus: item.unCheck === "0" ? "启用" : "未启用",
                            ruleStatusCode: item.unCheck,
                            path: item.dataPath && item.dataPath.split(',') || [],
                            rdIdentify: JSON.parse(item.rdIdentify)
                        }
                        
                        // 值域规范性处理
                        if (this.$route.query.id == 3) {
                            newData.rdIdentify = JSON.parse(item.rdIdentify) || { 'rulesFitObj': '' }
                            newData.rulesFitObj = newData.rdIdentify.rulesFitObj || '-'
                        }
                        this.tableData.push(newData);
                        if (item.unCheck === "0") {
                            this.startedArr.push(item.pkId + "");
                        } else {
                            this.unstartedArr.push(item.pkId + "");
                        }
                    });
                }
            })

        },

        // 选择某一行-规则
        handleSelectRow(selection, row) {

            this.selectedRowIds.push(row.id + "");
        },
        //   全选
        handleSelectRowAll(selection) {
            this.selectedRowIds = selection.map((item, index) => item.id + '');
        },
        //   取消选择某一行
        handleCancelRow(selection, row) {
            for (let i = 0; i < this.selectedRowIds.length; i++) {
                if (this.selectedRowIds[i] === row.id + "") {
                    this.selectedRowIds.splice(i, 1);
                }
            }
        },
        //   全选取消
        handleCancelRowAll(selection) {
            this.selectedRowIds = [];
        },
    },
    created() {
        this.getZJListPageById()
    }
}

export { InspectionMixins }
