<template>
<div>
    <!-- 筛选，判断 -->
    <Row style="margin-top: 15px" type="flex">
        <!-- 增加按钮 -->
        <Col span="2" push=1>
        <span><Button type="primary" @click="addModal" icon="search">增加</Button></span>
        <!-- <span ><Button  type="error"  @click="this.delete" icon="trash-a">批量删除</Button></span> -->
        </Col>

        <!-- 状态选择 -->
        <Col span="4" push=1>
        <i-select @on-change="init" v-model="params.result" placeholder="选择状态" filterable :clearable="isClearAble" style="width:210px">
            <Option value="0">微责</Option>
            <Option value="1">无责</Option>
            <Option value="2">重责</Option>
            <Option value="3">中责</Option>
            <Option value="4">轻责</Option>
            <Option value="5">待定</Option>
        </i-select>
        </Col>

        <!-- 日期查询 -->
        <Col span="4" push=1>
        <Date-picker type="datetimerange" v-model="params.dateTime" format="yyyy-MM-dd HH:mm" @on-change="search" placeholder="选择日期和时间" style="width: 300px"></Date-picker>
        </Col>

        <!-- <Col>
                <i-col>
                    <Date-picker type="daterange" :options="options2" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
                </i-col>
            </Col>   -->

        <!-- 查询 -->
        <Col span="4" push=2>
        <Input v-model="params.wangwangnum" style="width:200px" @on-change="search" placeholder="请输入客户名" clearable />
        </Col>
        <Col span="4" push=2>
        <Input v-model="params.shopptype" style="width:200px" @on-change="search" placeholder="请输入店铺类型" clearable />
        </Col>
    </Row>
    <Row style="margin-top:5px">
        <Col span="4" push=3>
        <Input v-model="params.username1" style="width:200px" @on-change="search" placeholder="请输入店长" clearable />
        </Col>
        <Col span="4" push=3>
        <Input v-model="params.username2" style="width:200px" @on-change="search" placeholder="请输入招商顾问" clearable/>
        </Col>
        <Col span="4" push=4>
        <Input v-model="params.teamname" style="width:200px" @on-change="search" placeholder="请输入团队" clearable/>
        </Col>
        <Col span="4" push=4>
        <Input v-model="params.frequency" style="width:200px" @on-change="search" placeholder="请输入隐患次数" clearable />
        </Col>
        <!-- 搜索按钮 -->
        <Col span="4" style="margin-left: 5px" push=3>
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
                <FormItem label="客户名" prop="wangwangnum" v-if="modifierForm.wangwangnum != null">
                    <Input disabled v-model="modifierForm.wangwangnum" style="width:150px" />
                </FormItem>
                <FormItem label="客户类型" v-if="modifierForm.custtype != null">
                    <div>
                        <Input disabled v-model="modifierForm.custtype" style="width:75px" />
                        <Input disabled v-model="modifierForm.childtype" style="width:75px" />
                    </div>
                </FormItem>
                <FormItem label="隐患日期" prop="createTime" v-if="modifierForm.createTime != null">
                    <DatePicker type="datetime" readonly disabled format="yyyy-MM-dd HH:mm" v-model="modifierForm.createTime" style="width:180px"></DatePicker>
                </FormItem>
                <FormItem label="招商顾问" prop="pname" v-if="modifierForm.pname != null">
                    <Input disabled v-model="modifierForm.pname" style="width:120px" />
                </FormItem>
            </div>
            <div style="width:240px;float:left">
                <FormItem label="隐患次数" prop="frequency" v-if="modifierForm.frequency != null">
                    <Input disabled v-model="modifierForm.frequency" style="width:120px" />
                </FormItem>
                <FormItem label="店长" prop="tename" v-if="modifierForm.tename != null">
                    <Input disabled v-model="modifierForm.tename" style="width:120px" />
                </FormItem>
                <FormItem label="所属团队" prop="teamname" v-if="modifierForm.teamname != null">
                    <Input disabled v-model="modifierForm.teamname" style="width:120px" />
                </FormItem>
                <FormItem label="店铺类型" prop="shopptype" v-if="modifierForm.shopptype != null">
                    <Input disabled v-model="modifierForm.shopptype" style="width:120px" />
                </FormItem>
            </div>
            <FormItem label="隐患内容" prop="hiddenContent" v-if="modifierForm.hiddenContent != null">
                <Input disabled v-model="modifierForm.hiddenContent" type="textarea" style="width:400px" />
            </FormItem>
            <FormItem label="备注" prop="remark" v-if="modifierForm.remark != null">
                <Input disabled v-model="modifierForm.remark" type="textarea" style="width:400px" />
            </FormItem>
            <Row>
             <Col span="12">
                    <FormItem label="客诉大类别" prop="parentName" v-if="modifierForm.level != null">
                        <Select @on-change="selectLevel" v-model="modifierForm.level" placeholder="Select your level" style="width: 200px">
                            <Option v-for="levelId in levels" :label="levelId.parentName" :value="levelId.parentId" :key="levelId.parentId">
                            {{levelId.parentName}}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="客诉小类别" prop="complaintName" v-if="modifierForm.level != null">
                        <Select v-model="modifierForm.sonLevel" placeholder="Select your pkId" style="width: 200px">
                            <Option v-for="complaintNameId in levelNames" :label="complaintNameId.complaintName"
                                    :value="complaintNameId.complaintIds" :key="complaintNameId.complaintIds">
                            {{complaintNameId.complaintName}}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
             <FormItem label="外因" prop="externalCause" v-if="modifierForm.externalCause != null">
                    <Input v-model="modifierForm.externalCause" style="width:500px" type="textarea" />
                </FormItem>
        </Form>
    </Modal>

    <!-- 文件列表 -->
    <Modal v-model="fileModal" @on-ok="fileTable" @on-visible-change="resetDate1" @on-cancel="cancelFileList" width=30%>
        <h3 slot="header" style="color:#2D8CF0">文件列表</h3>
        <template>
            <Upload ref="upload" name="file" :show-upload-list="false" :on-success="handleSuccess" :multiple="true" action="http://192.168.1.112:9090/mj-admin/sys/hidden/uploads" style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="30"></Icon>
                </div>
            </Upload>
        </template>
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
                dateTime:'',
                // startTime: '',
                // endTime: '',
                result: -1
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
                pname: '',
                tename: '',
                teamname: '',
                result: '',
                isDelete: '',
                hiddenDate:'',
                createTime:'',
                level:'',
                sonLevel:'',
                parentId:'',
                externalCause:'',
                tename:'',
                pname:'',
            },
            showFileForm: {
                url: '',
                name: '',
                complaintId: '',
            },
            pageNumber: [], //表格页数
            length: [], //表格每页长度
             //客诉大类别
            levels:[],
            //客诉小类别
            levelNames:[],

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
                    key: 'result',
                    render: (h, params) => {
                        const result = params.row.result;
                        const color = result == 0 ? '#68838B' : (result == 1 ? '#20B2AA' : (result == 2 ? '#FF0000' : (result == 3 ? '#8B008B' : (result == 4 ? '#BC8F8F' : '#63B8FF'))));
                        const text = result == 0 ? '微责' : (result == 1 ? '无责' : (result == 2 ? '重责' : (result == 3 ? '中责' : (result == 4 ? '轻责' : '待定'))));
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
                            'div', [editBtn, deleteBtn, showBtn, fileBtn]
                        );
                    }
                }
            ],
            //详情表格
            columns2: [
                {
                    title: '类型',
                    align: 'center',
                    render: (h, params) => {
                    const row = params.row;
                    const color=row.type==0 ? 'green' :(row.type ==1 ? 'red':(row.type ==2 ?'blue':'purple'));
                    const text=row.type==0 ? '投诉' :(row.type ==1 ? "隐患":(row.type ==2? '退款':'其他'));
                    return h('Tag', {
                    props: {
                        color: color
                    }
                    }, text);
                    },
                    align: 'center'
                },
                {
                    title: '状态',
                    key: 'result',
                    render: (h, params) => {
                        const result = params.row.result;
                        const color = result == 0 ? '#68838B' : (result == 1 ? '#20B2AA' : (result == 2 ? '#FF0000' : (result == 3 ? '#8B008B' : (result == 4 ? '#BC8F8F' : '#63B8FF'))));
                        const text = result == 0 ? '微责' : (result == 1 ? '无责' : (result == 2 ? '重责' : (result == 3 ? '中责' : (result == 4 ? '轻责' : '待定'))));
                        return h('Tag', {
                            props: {
                                color: color
                            }
                        }, text);
                    },
                    align: 'center'
                },
                {
                    title: '日期',
                    align: 'center',
                    key: 'createTime'
                },
                {
                    title: '客户',
                    align: 'center',
                    key: 'wangwangnum'
                },
                {
                    title: '次数(第几次)',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'block'
                                }
                            }, "该用户的第"+params.row.frequency + "次"),
                        ]);
                    },
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
            complaintIds:{
                pkId: '',
                parentId: '',
                complaintName:'',
                parentName:'',
            },
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
            API.complaintList.listByWangWangNum(this.params).then(({
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
                console.log("修改时间为1:"+ HiddenTrouble.hiddenDate);
                this.modifierForm.hDate = HiddenTrouble.hiddenDate;
                console.log("修改时间为2:"+this.modifierForm.hDate);
                this.modifierForm.wangwangnum = HiddenTrouble.wangwangnum;
                this.modifierForm.hiddenContent = HiddenTrouble.hiddenContent;
                this.modifierForm.remark = HiddenTrouble.remark;
                this.modifierForm.frequency = HiddenTrouble.frequency;
                this.modifierForm.custtype = HiddenTrouble.custtype;
                this.modifierForm.childtype = HiddenTrouble.childtype;
                this.modifierForm.result = HiddenTrouble.result;
                this.modifierForm.isDelete = HiddenTrouble.isDelete;
                this.modifierForm.level = HiddenTrouble.level;
                this.modifierForm.sonLevel = HiddenTrouble.sonLevel;
                this.modifierForm.parentId = HiddenTrouble.parentId;
                this.modifierForm.externalCause = HiddenTrouble.externalCause;
            }
        },

        //详情，调用接口
        details() {
             //大类
            API.complaintList.selectLevel(this.params).then(({data}) => {
                console.log("进来喽哦");
                if (data && data.code == 0) {
                this.levels = data.data;
                console.log("大类");
                console.log(this.levels);
                } else {
                this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
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
                this.modifierForm.tename = HiddenTrouble.tename;
                this.modifierForm.pname = HiddenTrouble.pname;
                this.modifierForm.hDate = HiddenTrouble.hDate;
                this.modifierForm.createTime =HiddenTrouble.createTime;
                this.modifierForm.shopptype = HiddenTrouble.shopptype;
                this.modifierForm.hiddenDate = HiddenTrouble.hiddenDate;
                this.modifierForm.wangwangnum = HiddenTrouble.wangwangnum;
                this.modifierForm.hiddenContent = HiddenTrouble.hiddenContent;
                this.modifierForm.remark = HiddenTrouble.remark;
                this.modifierForm.frequency = HiddenTrouble.frequency;
                this.modifierForm.custtype = HiddenTrouble.custtype;
                this.modifierForm.childtype = HiddenTrouble.childtype;
                this.modifierForm.result = HiddenTrouble.result;
                this.modifierForm.isDelete = HiddenTrouble.isDelete;
                this.modifierForm.pname =  HiddenTrouble.username2;
                this.modifierForm.tename = HiddenTrouble.username1;
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
        //上传
        //上传成功之后的方法
        handleSuccess(res, file) {
            let _this = this;
            if (res.code == 0) {
                alert("上传中");
                let scenerestoration = file.response.data;
                this.url = scenerestoration.url;
                this.name = scenerestoration.name;
                this.showFileForm.url = this.url;
                this.showFileForm.name = this.name;
                API.hiddenTroubleList.addFile(this.showFileForm).then(({
                    data
                }) => {
                    if (data && data.code == 0) {
                        this.init();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
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
         //点击客诉大类别
            selectLevel(params){
            this.params1.parentId=this.modifierForm.level;
            this.modifierForm.parentId = this.params1.parentId;
            this.modifierForm.pkId = this.modifierForm.sonLevel;
            //小类
            API.complaintList.getLevelName(this.params1).then(({data}) => {
                if (data && data.code == 0) {
                this.levelNames = data.data.list;
                } else {
                this.$Message.error(data.msg);
                }
                }).catch((data) => {
                    this.$Message.error('当前没有判责');
                    });
            },
        //点击详情确定可以修改客诉信息
        saveEdits(){
            API.responsibilityList.update(this.modifierForm).then(({data}) => {
                    if (data && data.code == 0) {
                    this.init();
                    } else {
                    this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                })
        }
    }
}
</script>

<style scoped>

</style>
