<template>
<div>
    <!-- 筛选，判断 -->
    <Row style="margin-top: 15px" type="flex">
        <!-- 增加按钮 -->
        <Col span="1" style="margin-left: 5px">
        <span><Button type="primary" @click="addModal" icon="search">增加</Button></span>
        <!-- <span ><Button  type="error"  @click="this.delete" icon="trash-a">批量删除</Button></span> -->
        </Col>

        <!-- 状态选择 -->
        <Col span="2" style="margin-left: 10px">
        <i-select @on-change="search" v-model="params.status" placeholder="选择状态" filterable style="width:120px" clearable>
            <Option value="0">待审核</Option>
            <Option value="1">已审核</Option>
            <Option value="2">待审定</Option>
            <Option value="-1">全部</Option>
        </i-select>
        </Col>

        <!-- 日期查询 -->
        <Col span="3">
        <date-picker type="date" style="width:200px"  format="yyyy-MM-dd HH:mm:ss" v-model="params.startTime" @on-change="search" placeholder="请选择开始时间" :clearable="isClearAble"></date-picker>
        </Col>
        <Col span="3">
        <date-picker type="date" style="width:200px"  format="yyyy-MM-dd HH:mm:ss" v-model="params.endTime" @on-change="search" placeholder="请选择结束时间" :clearable="isClearAble"></date-picker>
        </Col>

        <!-- <Col>
                <i-col>
                    <Date-picker type="daterange" :options="options2" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
                </i-col>
            </Col>   -->

        <!-- 查询 -->
        <Col span="3">
        <Input v-model="params.wangwangnum" style="width:200px" @on-change="search" placeholder="请输入客户名" clearable />
        </Col>
        <Col span="3">
        <Input v-model="params.shopptype" style="width:200px" @on-change="search" placeholder="请输入店铺类型" clearable />
        </Col>
        <Col span="3">
        <Input v-model="params.username1" style="width:200px" @on-change="search" placeholder="请输入店长" clearable />
        </Col>
        <Col span="3">
        <Input v-model="params.username2" style="width:200px" @on-change="search" placeholder="请输入招商顾问" clearable/>
        </Col>
        <Col span="3">
        <Input v-model="params.teamname" style="width:200px" @on-change="search" placeholder="请输入团队" clearable/>
        </Col>
        <Col span="3">
        <Input v-model="params.frequency" style="width:200px" @on-change="search" placeholder="请输入隐患次数" clearable />
        </Col>

        <!-- 搜索按钮 -->
        <Col span="1" style="margin-left: 5px">
            <span><Button type="primary" @click="init" icon="search">搜索</Button></span>
        </Col>
    </Row>

    <!-- 主页面的表格 -->
    <Row style="margin-top: 25px">
        <Table border ref="selection" :columns="columns1" :current="params.pageNum" :data="data1" width=100%>
        </Table>
    </Row>

    <!-- 分页 -->
    <Row>
        <div style="float:right">
            <Page :total="totalCount" :page-size="params.pageSize" loading @on-change="pageChange" @on-page-size-change="sizeChange" />
        </div>
    </Row>

    <!-- 增加隐患弹窗，点击增加按钮弹出 -->
    <Modal v-model="showAddModal" @on-ok="save" @on-cancel="cancel">
        <h3 slot="header" style="color:#2D8CF0">增加信息</h3>
        <Form :model="showAddForm" ref="form1" resetFields label-position="right" :label-width="100" @submit.native.prevent="saveEditUser" :rules="addForm">
            <FormItem label="隐患客户" prop="wangwangnum">
                <Input v-model="showAddForm.wangwangnum" placeholder="请输入隐患客户" style="width: 300px" @on-blur="add" :clearable="isClearAble" />
            </FormItem>
            <FormItem label="隐患日期" prop="hDate">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="showAddForm.hDate" placeholder="隐患时间，若不填，获取当前日期时间" style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem label="隐患原因" prop="hiddenContent">
                <Input v-model="showAddForm.hiddenContent" placeholder="请输入隐患原因" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px" :clearable="isClearAble" />
            </FormItem>
            <FormItem label="备注" prop="remark">
                <Input v-model="showAddForm.remark" placeholder="备注" style="width: 300px" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :clearable="isClearAble" />
            </FormItem>
            <FormItem>
                <!-- <Button @click="handleReset('showAddForm')">重置</Button> -->
                <Button @click="reset">重置</Button>
            </FormItem>
        </Form>
    </Modal>

    <!-- 修改隐患弹窗，点击修改按钮弹出 -->
    <Modal v-model="modifierModal" @on-ok="modifier" @on-cancel="cancelModifier" width=600>
        <h3 slot="header" style="color:#2D8CF0">修改信息</h3>
        <Form :model="modifierForm" label-position="right" :label-width="100" @submit.native.prevent="saveModifier" inline>
            <div style="width:270px;float:left">
                <FormItem label="客户名" prop="wangwangnum">
                    <Input disabled v-model="modifierForm.wangwangnum" style="width:150px" />
                </FormItem>
                <FormItem label="客户类型">
                    <div>
                        <Input disabled v-model="modifierForm.custtype" style="width:75px" />
                        <Input disabled v-model="modifierForm.childtype" style="width:75px" />
                    </div>
                </FormItem>
                <FormItem label="隐患日期" prop="hDate">
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="modifierForm.hDate" style="width:180px"></DatePicker>
                </FormItem>
                <FormItem label="招商顾问" prop="username2">
                    <Input disabled v-model="modifierForm.username2" style="width:120px" />
                </FormItem>
            </div>
            <div style="width:240px;float:left">
                <FormItem label="隐患次数" prop="frequency">
                    <Input disabled v-model="modifierForm.frequency" style="width:120px" />
                </FormItem>
                <FormItem label="店长" prop="username1">
                    <Input disabled v-model="modifierForm.username1" style="width:120px" />
                </FormItem>
                <FormItem label="所属团队" prop="teamname">
                    <Input disabled v-model="modifierForm.teamname" style="width:120px" />
                </FormItem>
                <FormItem label="店铺类型" prop="shopptype">
                    <Input disabled v-model="modifierForm.shopptype" style="width:120px" />
                </FormItem>
            </div>
            <FormItem label="隐患内容" prop="hiddenContent">
                <Input v-model="modifierForm.hiddenContent" type="textarea" style="width:400px" />
            </FormItem>
            <FormItem label="备注" prop="remark">
                <Input v-model="modifierForm.remark" type="textarea" style="width:400px" />
            </FormItem>
        </Form>
    </Modal>

    <!-- 删除，点击删除按钮弹出 -->
    <Modal v-model="removeModal" @on-ok="remove" @on-cancel="cancelRemove">
        <h2 style="color:red;text-align: center;font-size: 20px">确定删除吗</h2>
    </Modal>

    <!-- 历史记录 -->
    <Modal v-model="historyModal" @on-ok="history" @on-cancel="cancelHistory" width=50%>
        <h3 slot="header" style="color:#2D8CF0">历史记录</h3>
        <Table border ref="selection" :columns="columns2" :current="params.pageNum" @on-selection-change="selectionChange" :data="data2" width=100%></Table>
    </Modal>

    <!-- 详情弹窗，点击修改按钮弹出 -->
    <Modal v-model="detailsModal" @on-ok="details" @on-cancel="cancelDetails" width=600>
        <h3 slot="header" style="color:#2D8CF0">详情</h3>
        <Form :model="modifierForm" label-position="right" :label-width="100" @submit.native.prevent="saveModifier" inline>
            <div style="width:270px;float:left">
                <FormItem label="客户名" prop="wangwangnum">
                    <Input disabled v-model="modifierForm.wangwangnum" style="width:150px" />
                </FormItem>
                <FormItem label="客户类型">
                    <div>
                        <Input disabled v-model="modifierForm.custtype" style="width:75px" />
                        <Input disabled v-model="modifierForm.childtype" style="width:75px" />
                    </div>
                </FormItem>
                <FormItem label="隐患日期" prop="hiddenDate">
                    <DatePicker type="datetime" readonly disabled format="yyyy-MM-dd HH:mm" v-model="modifierForm.hiddenDate" style="width:180px"></DatePicker>
                </FormItem>
                <FormItem label="招商顾问" prop="username2">
                    <Input disabled v-model="modifierForm.username2" style="width:120px" />
                </FormItem>
            </div>
            <div style="width:240px;float:left">
                <FormItem label="隐患次数" prop="frequency">
                    <Input disabled v-model="modifierForm.frequency" style="width:120px" />
                </FormItem>
                <FormItem label="店长" prop="username1">
                    <Input disabled v-model="modifierForm.username1" style="width:120px" />
                </FormItem>
                <FormItem label="所属团队" prop="teamname">
                    <Input disabled v-model="modifierForm.teamname" style="width:120px" />
                </FormItem>
                <FormItem label="店铺类型" prop="shopptype">
                    <Input disabled v-model="modifierForm.shopptype" style="width:120px" />
                </FormItem>
            </div>
            <FormItem label="隐患内容" prop="hiddenContent">
                <Input disabled v-model="modifierForm.hiddenContent" type="textarea" style="width:400px" />
            </FormItem>
            <FormItem label="备注" prop="remark">
                <Input disabled v-model="modifierForm.remark" type="textarea" style="width:400px" />
            </FormItem>
        </Form>
    </Modal>

    <!-- 文件上传 -->
    <Modal v-model="uploadFile" @on-ok="fileAdd" @on-cancel="cancelEdit">
        <h3 slot="header" style="color:#2D8CF0">文件上传</h3>
        <template>
            <Upload ref="upload" name="file" :show-upload-list="false" :on-success="handleSuccess" :multiple="true" action="http://192.168.1.112:9090/mj-admin/sys/hidden/uploads" style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="30"></Icon>
                </div>
            </Upload>
        </template>
    </Modal>

    <!-- 文件列表 -->
    <Modal v-model="fileModal" @on-ok="fileTable" @on-visible-change="resetDate1" @on-cancel="cancelFileList" width=50%>
        <h3 slot="header" style="color:#2D8CF0">历史记录</h3>
        <Table border ref="selection" :columns="columns3" :data="data3" width=100%>
        </Table>
    </Modal>

    <!-- 文件删除 -->
    <Modal v-model="showDeleteFileModal" width=15 @on-ok="saveFileDelete" @on-cancel="cancelFileDelete">
        <!--<h3 slot="header" style="color:red">确定删除吗</h3>-->
        <h2 style="color:red;text-align: center;font-size: 20px">确定删除吗</h2>
    </Modal>

</div>
</template>

<script>
import API from "../../api"; //调用接口
export default {
    name: "HiddenTrouble",
    data() {
        return {
            params: {
                pageNum: 1,
                pageSize: 10,
                wangwangnum: '',
                shopptype: '',
                username1: '',
                username2: '',
                teamname: '',
                frequency: '',
                startTime: '',
                endTime: '',
                status: -1
            },
            params1: {
                level: -1,
            },
            totalCount: 0,
            showAddModal: false, //不显示
            loading: false,
            modifierModal: false,
            removeModal: false,
            historyModal: false,
            detailsModal: false,
            uploadFile: false,
            fileModal:false,
            showDeleteFileModal: false,
            showAddForm: {
                wangwangnum: '',
                hDate: '',
                hiddenContent: '',
                remark: '',
            },
            modifierForm: {
                pkId: '',
                wangwangnum: '',
                hDate: '',
                hiddenContent: '',
                remark: '',
                custtype: '',
                childtype: '',
                shopptype: '',
                username1: '',
                username2: '',
                // technologyrecruitmentid:'',
                teamname: '',
                status: '',
                isDelete: '',
                level: '',
                hiddenDate:''
            },
            showFileForm: {
                url: '',
                name: '',
                complaintId: '',
            },
            pageNumber: [], //表格页数
            length: [], //表格每页长度

            //表单验证(如果为空就会提示)
            addForm: {
                wangwangnum: [{
                        required: true,
                        message: '请输入退款客户',
                        trigger: 'blur'
                    },
                    // {validator:validAccess,trigger:'blur'}
                ],
            },

            isClearAble: true,
            //主表格
            columns1: [{
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: '客户名',
                    align: 'center',
                    key: 'wangwangnum'
                },
                {
                    title: '隐患日期',
                    align: 'center',
                    key: 'hiddenDate'
                },
                {
                    title: '隐患次数（第几次）',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'block'
                                }
                            }, "该用户的第"+params.row.frequency + "次隐患"),
                        ]);
                    },
                },
                {
                    title: '店长',
                    align: 'center',
                    key: 'username1'
                },
                {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.status == 0 ? 'green' : (row.status == 1 ? 'red' : 'blue');
                        const text = row.status == 0 ? '待审核' : (row.status == 1 ? "已审核" : "待审定");
                        return h('Tag', {
                            props: {
                                color: color
                            }
                        }, text);
                    },
                    align: 'center'
                },
                {
                    title: '隐患原因',
                    align: 'center',
                    ellipsis: true,
                    key: 'hiddenContent',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'span', {
                                    style: {},
                                    //就是这里加的属性
                                    domProps: {
                                        title: params.row.hiddenContent,
                                    }
                                },
                                params.row.hiddenContent,
                            )
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 300,
                    align: 'center',
                    render: (h, params) => {
                        let editBtn = h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '3px'
                            },
                            on: {
                                click: () => {
                                    this.showEditModalData(params);
                                }
                            }
                        }, '修改');
                        let deleteBtn = h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '3px'
                            },
                            on: {
                                click: () => {
                                    this.delete(params);
                                }
                            }
                        }, '删除');
                        let showBtn = h('Button', {
                            props: {
                                type: 'info',
                                size: 'small'
                            },
                            style: {
                                marginRight: '3px'
                            },
                            on: {
                                click: () => {
                                    this.lookModal(params);
                                }
                            }
                        }, '历史记录');
                        let uploadBtn = h('Button', {
                            props: {
                                type: 'warning',
                                size: 'small'
                            },
                            style: {
                                marginRight: '3px'
                            },
                            on: {
                                click: () => {
                                    this.uploadAdd(params);
                                }
                            }
                        }, '上传附件');
                        let fileBtn = h('Button', {
                            props: {
                                type: 'success',
                                size: 'small'
                            },
                            style: {
                                marginRight: '3px'
                            },
                            on: {
                                click: () => {
                                    this.showFileFormList(params);
                                }
                            }
                        }, '附件');
                        return h(
                            'div', [editBtn, deleteBtn, showBtn, uploadBtn, fileBtn]
                        );
                    }
                }
            ],
            //详情表格
            columns2: [{
                    title: '客户名',
                    align: 'center',
                    key: 'wangwangnum'
                },
                {
                    title: '隐患日期',
                    align: 'center',
                    key: 'hiddenDate'
                },
                {
                    title: '隐患次数（第几次）',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'block'
                                }
                            }, "该用户的第"+params.row.frequency + "次隐患"),
                        ]);
                    },
                },
                {
                    title: '店长',
                    align: 'center',
                    key: 'username1'
                },
                {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.status == 0 ? 'green' : (row.status == 1 ? 'red' : 'blue');
                        const text = row.status == 0 ? '待审核' : (row.status == 1 ? "已审核" : "待审定");
                        return h('Tag', {
                            props: {
                                color: color
                            }
                        }, text);
                    },
                    align: 'center'
                },
                {
                    title: '隐患原因',
                    align: 'center',
                    ellipsis: true,
                    key: 'hiddenContent',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'span', {
                                    style: {

                                    },
                                    //就是这里加的属性
                                    domProps: {
                                        title: params.row.hiddenContent,
                                    }
                                },
                                params.row.hiddenContent,
                            )
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        let detailsBtn = h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '3px'
                            },
                            on: {
                                click: () => {
                                    this.detailsModalDate(params);
                                }
                            }
                        }, '详情');

                        return h(
                            'div', [detailsBtn]
                        );
                    }
                }
            ],
            //文件列表表格
            columns3: [{
                    title: '文件链接（根据文件上传的时间）',
                    align: 'center',

                    // height: 10,
                    // key: 'url',
                    render: (h, showFileFrom) => {
                        return h('div', [
                            h('a', {
                                attrs: {
                                    target: "_blank",
                                    href: showFileFrom.row.url,
                                },

                            }, showFileFrom.row.name)
                        ])

                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    height: 10,
                    key: 'action',
                    fixed: 'right',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        let deleteBtn = h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '3px'
                            },
                            on: {
                                click: () => {
                                    this.deleteList(params);
                                }
                            }
                        }, '删除');
                        return h(
                            'div', [deleteBtn]
                        );
                    }
                }
            ],
            data1: [],
            data2: [],
            data3: [],
        }
    },
    //生命周期
    mounted() {
        // 初始化
        this.init();
        // this.second();
    },
    created: function () {

    },
    methods: {

        reset(){
            this.$refs.form1.resetFields();
        },

        resetDate1(val) {
            if (!val) {
                this.showFileForm = {
                    pkId: '',
                    name: '',
                    url: '',
                    complaintId: '',
                };
            }
        },

        cancelEdit() {
            this.uploadFile = false;
        },
        search() {
            API.hiddenTroubleList.lists(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data1 = data.data.list;
                    this.totalCount = data.data.total;
                    this.length = data.data.list.length;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            this.loading = false;
        },

        init() {
            // 数据初始化
            this.loading = true;
            API.hiddenTroubleList.lists(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data1 = data.data.list;
                    // console.log("第一个data1为:" + this.data1);
                    this.totalCount = data.data.total;
                    this.length = data.data.list.length;
                    // for(var i = 0;i<this.length;i++){
                    //     this.pkIds.push(data.data.list[i].pkIds);
                    // }
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            this.loading = false;
        },
        pageChange(num) {
            this.params.pageNum = num;
            this.pageNumber = num;
            this.init();
        },
        sizeChange(size) {
            this.params.pageSize = size;
            this.init();
        },

        /* 删除模块，弹出弹框*/
        delete(params) {
            //this.pkIds=[params.row.pkId];
            this.pkIds = [];
            this.removeModal = true;
            let pkIds = this.pkIds;
            if (typeof params.row != 'undefined') {
                pkIds.push(params.row.pkId);
                // console.log("循环啊");
                // console.log(pkIds);
            } else {
                this.selection.forEach(v => {
                    pkIds.push(v.pkId)
                });
            };
        },

        /* 确定删除*/
        remove() {
            let pkIds = this.pkIds;
            let param = {
                "pkIds": pkIds
            };
            API.hiddenTroubleList.less(param).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    if (this.params.pageNum > 1) {
                        if (this.length == 1 || this.size == this.length) {
                            this.pageNumber = this.pageNumber - 1;
                            this.params.pageNum = this.pageNumber;
                        }
                    }
                    this.init();
                } else {
                    this.$Message.error(data.msg);
                };
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });

        },
        /*取消*/
        cancelRemove() {
            this.removeModal = false;
        },

        // 根据旺旺名查询历史记录
        lookModal(params) {
            this.historyModal = true;
            this.params.wangwangnum = params.row.wangwangnum;
            // console.log("1111111111111111111111111旺旺名:"+this.params.wangwangnum);
            this.params.pageNum = 1;
            // 数据初始化
            this.loading = true;
            API.hiddenTroubleList.selectByWangWangNum(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data2 = data.data;
                    // console.log("data2"+this.data2);
                    this.params.wangwangnum = '';
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error("链接失败，请检查网络！");
            })
        },
        // 选择状态改变
        selectionChange(data) {
            this.size = data.length
            this.selection = data;
        },

        //调用添加接口
        save() {
            API.hiddenTroubleList.insert(this.showAddForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.init();
                } else {
                    this.$Message.error(data.msg);
                }
                this.$refs.form1.resetFields();
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            })
        },

        //调用查看旺旺名是否存在接口
        add() {
            API.hiddenTroubleList.ByWang(this.showAddForm).then(({
                data
            }) => {
                if (data.code == 200003) {} else {
                    this.$Message.error(data.msg);
                }
            })
        },

        //修改
        modifier() {
            API.hiddenTroubleList.update(this.modifierForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.init();
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error("链接失败，请检查网络！");
            })
        },

        //修改
        showEditModalData(params) {
            this.modifierModal = true;
            this.showFileForm.complaintId = params.row.pkId;
            if (typeof params.row != 'undefined') {
                const HiddenTrouble = params.row;
                this.modifierForm.pkId = HiddenTrouble.pkId;
                this.modifierForm.teamname = HiddenTrouble.teamname;
                this.modifierForm.username1 = HiddenTrouble.username1;
                this.modifierForm.username2 = HiddenTrouble.username2;
                this.modifierForm.shopptype = HiddenTrouble.shopptype;
                this.modifierForm.hiddenDate = HiddenTrouble.hiddenDate;
                // console.log("获取的时间为："+HiddenTrouble.hiddenDate);
                // console.log("获取的时间1为："+HiddenTrouble.hDate);
                this.modifierForm.hDate = HiddenTrouble.hiddenDate;
                // console.log("获取的时间2为："+this.modifierForm.hDate);
                this.modifierForm.wangwangnum = HiddenTrouble.wangwangnum;
                // console.log("旺旺名为："+ HiddenTrouble.wangwangnum);
                this.modifierForm.hiddenContent = HiddenTrouble.hiddenContent;
                this.modifierForm.remark = HiddenTrouble.remark;
                this.modifierForm.frequency = HiddenTrouble.frequency;
                this.modifierForm.custtype = HiddenTrouble.custtype;
                this.modifierForm.childtype = HiddenTrouble.childtype;
                this.modifierForm.status = HiddenTrouble.status;
                this.modifierForm.isDelete = HiddenTrouble.isDelete;
                this.modifierForm.level = HiddenTrouble.level;
            }
        },

        //详情，调用接口
        details() {
            API.hiddenTroubleList.update(this.modifierForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.init();
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error("链接失败，请检查网络！");
            })
        },

        //详情
        detailsModalDate(params) {
            this.detailsModal = true;
            if (typeof params.row != 'undefined') {
                const HiddenTrouble = params.row;
                this.modifierForm.pkId = HiddenTrouble.pkId;
                this.modifierForm.teamname = HiddenTrouble.teamname;
                this.modifierForm.username1 = HiddenTrouble.username1;
                this.modifierForm.username2 = HiddenTrouble.username2;
                this.modifierForm.hDate = HiddenTrouble.hDate;
                this.modifierForm.shopptype = HiddenTrouble.shopptype;
                this.modifierForm.hiddenDate = HiddenTrouble.hiddenDate;
                this.modifierForm.wangwangnum = HiddenTrouble.wangwangnum;
                this.modifierForm.hiddenContent = HiddenTrouble.hiddenContent;
                this.modifierForm.remark = HiddenTrouble.remark;
                this.modifierForm.frequency = HiddenTrouble.frequency;
                this.modifierForm.custtype = HiddenTrouble.custtype;
                this.modifierForm.childtype = HiddenTrouble.childtype;
                this.modifierForm.status = HiddenTrouble.status;
                this.modifierForm.isDelete = HiddenTrouble.isDelete;
                this.modifierForm.level = HiddenTrouble.level;
            }
        },

        //批量上传文件
        uploadAdd(params, showFileForm) {
            this.uploadFile = true;
            let complaintId = params.row.pkId;
            this.showFileForm.complaintId = complaintId;
            this.loading = false;
        },

        //上传成功之后的方法
        handleSuccess(res, file) {
            let _this = this;
            if (res.code == 0) {
                alert("上传中");
                // this.complaintId = data.data;
                let scenerestoration = file.response.data;
                this.url = scenerestoration.url;
                this.name = scenerestoration.name;
                let name = this.name;
                let url = this.url;
                this.showFileForm.url = url;
                this.showFileForm.name = name;
            } else {
                alert("上传失败");
            }
        },

        //调用上传文件接口
        fileAdd() {
            API.hiddenTroubleList.addFile(this.showFileForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.init();
                } else {
                    this.$Message.error(data.msg);
                }
            })
        },

        //文件列表
        showFileFormList(params) {
            this.fileModal = true;
            this.showFileForm.complaintId = params.row.pkId;
            API.hiddenTroubleList.selectFile(this.showFileForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data3 = data.data;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            this.loading = false;
        },

        //删除文件
        deleteList(showFileForm) {
            this.showFileForm.pkId = showFileForm.row.pkId;
            // console.log("pkId为：" + this.showFileForm.pkId);
            this.showDeleteFileModal = true;
        },

        /* 确定删除*/
        saveFileDelete() {
            // this.showDeleteFileModal = true;
            let pkId = this.showFileForm.pkId;
            let complaintId = this.showFileForm.complaintId;
            API.hiddenTroubleList.deleteFile(this.showFileForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    API.hiddenTroubleList.selectFile(this.showFileForm).then(({
                        data
                    }) => {
                        if (data && data.code == 0) {
                            this.data3 = data.data;
                        } else {
                            this.$Message.error(data.msg);
                        }
                    }).catch((data) => {
                        this.$Message.error('连接失败，请检查网络！');
                    });
                } else {
                    this.$Message.error(data.msg);
                };
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });

        },
        /*取消*/
        cancelFileDelete() {
            this.showDeleteFileModal = false;
        },

        addModal() {
            this.showAddModal = true;
        },

        cancel() {
            this.showAddModal = false;
        },
        cancelModifier() {
            this.modifierModal = false;
        },
        cancelDetails() {
            this.detailsModal = false;
        },
        history() {
            this.historyModal = false;
        },
        cancelHistory() {
            this.historyModal = false;
        },
        fileTable() {
            this.fileModal = false;
        },
        cancelFileList() {
            this.fileModal = false;
        },
    }
}
</script>

<style scoped>

</style>
