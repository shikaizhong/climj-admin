<template>
<div>
    <!-- 筛选，判断 -->
    <Row style="margin-top: 15px" type="flex">
        <!-- 增加按钮 -->
        <Col span="4" push=1>
        <span><Button type="primary" @click="addModal" icon="search">增加</Button></span>
        <!-- 状态选择 -->
        <i-select @on-change="inits" v-model="params.result" placeholder="选择状态" filterable :clearable="isClearAble" style="width:210px">
            <Option value="0">微责</Option>
            <Option value="1">无责</Option>
            <Option value="2">重责</Option>
            <Option value="3">中责</Option>
            <Option value="4">轻责</Option>
            <!-- <Option value="5">待定</Option> -->
        </i-select>
        <!-- <span ><Button  type="error"  @click="this.delete" icon="trash-a">批量删除</Button></span> -->
        </Col>
        <!-- 日期查询 -->
        <Col span="4" push=1>
        <Date-picker type="datetimerange" v-model="params.dateTime" format="yyyy-MM-dd HH:mm" @on-change="inits" placeholder="选择日期和时间" style="width: 300px"></Date-picker>
        </Col>
        <Col span="4" push=3>
        <Input v-model="params.wangwangnum" @on-change="inits" placeholder="请输入客户名"  clearable filterable/>
        </Col>
        <Col span="4" push=5>
        <Input v-model="params.shopptype" @on-change="inits" placeholder="请输入店铺类型"  :clearable="isClearAble" />
        </Col>
    </Row>
    <Row style="margin-top:5px">
        <!-- 查询 -->
        <Col span="4" push=5>
        <Input v-model="params.username1" @on-change="inits" placeholder="请输入店长"  clearable filterable />
        </Col>
        <Col span="4" push=7>
        <Input v-model="params.username2" @on-change="inits" placeholder="请输入招商顾问"  clearable filterable />
        </Col>
        <Col span="4" push=9>
        <Input v-model="params.TeamName" @on-change="inits" placeholder="请输入团队"  clearable filterable />
        </Col>

        <!-- 搜索按钮 -->
        <Col span="1" push=10>
        <span><Button type="primary" @click="inits" icon="search">搜索</Button></span>
        </Col>
    </Row>

    <!-- 界面表格 -->
    <Row style="margin-top: 25px">
        <Table border ref="selection" :columns="columns1" :current="params.pageNum" :data="data1" width=100%>
        </Table>
    </Row>
    <!-- <Row>
            <Col/>
            <Button @click="handleSelectAll(true)">全选</Button>
            <Button @click="handleSelectAll(false)">取消全选</Button>
        </Row> -->

    <!-- 分页 -->
    <Row>
        <div style="float:right">
            <Page :total="totalCount" :page-size="params.pageSize" loading @on-change="pageChange" @on-page-size-change="sizeChange" />
        </div>
    </Row>


    <!-- 增加退款弹窗，点击增加按钮弹出 -->
    <Modal v-model="showAddModal" @on-ok="save" @on-cancel="cancel">
        <Form :model="showAddForm" ref="form1" resetFields label-position="right" :label-width="100" @submit.native.prevent="saveEditUser" :rules="addForm">
            <FormItem label="退款客户" prop="wangwangnum">
                <Input v-model="showAddForm.wangwangnum" placeholder="请输入退款客户" style="width: 300px" @on-blur="add" :clearable="isClearAble" />
            </FormItem>
            <FormItem label="退款日期" prop="hDate">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="showAddForm.hDate" placeholder="退款时间，若不填，获取当前日期时间" style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem label="退款金额" prop="refundAmount">
                <Input v-model="showAddForm.refundAmount" placeholder="请输入退款金额" style="width: 300px" :clearable="isClearAble" />
            </FormItem>
            <FormItem label="退款渠道" prop="refundChannel">
                <Select v-model="showAddForm.refundChannel" style="width: 300px" placeholder="请选择退款渠道">
                    <Option value="1">SEM在线订购</Option>
                    <Option value="2">支付宝转账</Option>
                    <Option value="3">网银转账</Option>
                    <Option value="4">定制市场订购</Option>
                    <Option value="5">现金</Option>
                    <Option value="6">POS机</Option>
                    <Option value="7">京东在线订购</Option>
                    <Option value="8">微信支付</Option>
                </Select>
            </FormItem>
            <FormItem label="退款原因" prop="refundCause">
                <Input v-model="showAddForm.refundCause" placeholder="请输入退款原因" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px" :clearable="isClearAble" />
            </FormItem>
             <!-- <FormItem label="外因" prop="externalCause">
                <Input v-model="showAddForm.externalCause" placeholder="请输入退款原因" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px" :clearable="isClearAble" />
            </FormItem> -->
            <!-- <FormItem label="场景还原" prop="scenarioReduction">
                <Upload ref="upload" name="file" action="http://localhost:8090/sys/refund/upload" :on-success="handleSuccess" :on-format-error="handleFormatError">
                    <i-button type="primary" icon="ios-cloud-upload-outline">上传文件</i-button>
                </Upload>
            </FormItem> -->
            <FormItem label="备注" prop="remark">
                <Input v-model="showAddForm.remark" placeholder="备注" style="width: 300px" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :clearable="isClearAble" />
            </FormItem>
            <FormItem>
                <!-- <Button @click="handleReset('showAddForm')">重置</Button> -->
                <Button @click="reset">重置</Button>
            </FormItem>
        </Form>
    </Modal>

    <!-- 历史记录，点击历史记录按钮弹出 -->
    <Modal v-model="showModal" @on-ok="saveTable" @on-visible-change="resetData" @on-cancel="cancelTable" width=50%>
        <h3 slot="header" style="color:#2D8CF0">历史记录</h3>
        <Table border ref="selection" :columns="columns2" :current="params.pageNum" @on-selection-change="selectionChange" :data="data2" width=100%>
        </Table>
    </Modal>

    <!-- 详情 -->
    <Modal v-model="showEditModalAll" @on-ok="saveEdits" @on-cancel="cancelEdit" width=752>
        <h3 slot="header" style="color:#2D8CF0">详情</h3>
        <Form :model="showEditForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser" inline>
            <div style="width:210px;float:left">
                <FormItem label="服务期" prop="deadline" v-if="showEditForm.deadline != null">
                    <Input disabled v-model="showEditForm.deadline" style="width:120px" />
                </FormItem>
                <FormItem label="招商顾问" prop="pname" v-if="showEditForm.pname != null">
                    <Input disabled v-model="showEditForm.pname" style="width:120px" />
                </FormItem>
                <FormItem label="合同金额" prop="turnovermoney" v-if="showEditForm.turnovermoney != null">
                    <Input disabled v-model="showEditForm.turnovermoney" style="width:120px" />
                </FormItem>
                <FormItem label="退款金额" prop="refundAmount" v-if="showEditForm.refundAmount != null">
                    <Input disabled v-model="showEditForm.refundAmount" style="width:120px" />
                </FormItem>
            </div>
            <div style="width:270px;float:left">
                <FormItem label="退款客户" prop="wangwangnum" v-if="showEditForm.wangwangnum != null">
                    <Input disabled v-model="showEditForm.wangwangnum" style="width:150px" />
                </FormItem>

                <FormItem label="客户类型" v-if="showEditForm.custtype != null">
                    <div>
                        <Input disabled v-model="showEditForm.custtype" style="width:75px" />
                        <Input disabled v-model="showEditForm.childtype" style="width:75px" />
                    </div>
                </FormItem>

                <FormItem label="退款渠道" prop="refundChannel" v-if="showEditForm.refundChannel != null">
                    <select v-model="showEditForm.refundChannel" disabled style="width: 160px;height:35px">
                        <option value="1">SEM在线订购</option>
                        <option value="2">支付宝转账</option>
                        <option value="3">网银转账</option>
                        <option value="4">定制市场订购</option>
                        <option value="5">现金</option>
                        <option value="6">POS机</option>
                        <option value="7">京东在线订购</option>
                        <option value="8">微信支付</Option>
                    </select>
                </FormItem>
                <FormItem label="退款时间" prop="hDate" v-if="showEditForm.hDate != null">
                    <i-col span="11">
                        <DatePicker type="datetime" readonly disabled format="yyyy-MM-dd HH:mm" v-model="showEditForm.hDate" style="width:160px"></DatePicker>
                    </i-col>
                </FormItem>
            </div>
            <div style="width:240px;float:left">
                <FormItem label="店铺类型" prop="shopptype" v-if="showEditForm.shopptype != null">
                    <Input disabled v-model="showEditForm.shopptype" style="width:120px" />
                </FormItem>

                <FormItem label="店长" prop="tename" v-if="showEditForm.tename != null">
                    <Input disabled v-model="showEditForm.tename" style="width:120px" />
                </FormItem>
                <FormItem label="店长所属团队" prop="teamname" v-if="showEditForm.teamname != null">
                    <Input disabled v-model="showEditForm.teamname" style="width:120px" />
                </FormItem>

            </div>
            <div style="width:500px">
                <FormItem label="退款原因" prop="refundCause" v-if="showEditForm.refundCause != null">
                    <Input disabled v-model="showEditForm.refundCause" style="width:500px" type="textarea" />
                </FormItem>
                <FormItem label="备注" prop="remark" v-if="showEditForm.remark != null">
                    <Input disabled v-model="showEditForm.remark" style="width:500px" type="textarea" />
                </FormItem>
            </div>
            <Row>
             <Col span="12">
                    <FormItem label="客诉大类别" prop="parentName" v-if="showEditForm.level != null">
                        <Select @on-change="selectLevel" v-model="showEditForm.level" placeholder="Select your level" style="width: 200px">
                            <Option v-for="levelId in levels" :label="levelId.parentName" :value="levelId.parentId" :key="levelId.parentId">
                            {{levelId.parentName}}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="客诉小类别" prop="complaintName" v-if="showEditForm.level != null">
                        <Select v-model="showEditForm.sonLevel" placeholder="Select your pkId" style="width: 200px">
                            <Option v-for="complaintNameId in levelNames" :label="complaintNameId.complaintName"
                                    :value="complaintNameId.complaintIds" :key="complaintNameId.complaintIds">
                            {{complaintNameId.complaintName}}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
             <FormItem label="外因" prop="externalCause" v-if="showEditForm.externalCause != null">
                    <Input v-model="showEditForm.externalCause" style="width:500px" type="textarea" />
                </FormItem>
        </Form>
    </Modal>

    <!-- 修改，点击修改按钮弹出 -->
    <Modal v-model="showEditModal" @on-ok="saveEdit" @on-cancel="cancelEdit" width=762>
        <h3 slot="header" style="color:#2D8CF0">修改信息</h3>
        <Form :model="showEditForm" ref="form2" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser" inline>
            <div style="width:210px;float:left">
                <FormItem label="服务期" prop="deadline">
                    <Input disabled v-model="showEditForm.deadline" style="width:120px" />
                </FormItem>
                <FormItem label="招商顾问" prop="username2">
                    <Input disabled v-model="showEditForm.username2" style="width:120px" />
                </FormItem>
                <FormItem label="合同金额" prop="turnovermoney">
                    <Input disabled v-model="showEditForm.turnovermoney" style="width:120px" />
                </FormItem>
                <FormItem label="退款金额" prop="refundAmount">
                    <Input v-model="showEditForm.refundAmount" style="width:120px" />
                </FormItem>
                <!-- <FormItem label="场景还原" prop="scenarioReduction">
                    <Upload ref="upload" name="file" action="http://localhost:8090/sys/refund/upload" :on-success="handleSuccess" :on-format-error="handleFormatError">
                        <i-button type="primary" icon="ios-cloud-upload-outline">上传文件</i-button>
                    </Upload>
                </FormItem> -->
            </div>
            <div style="width:270px;float:left">
                <FormItem label="退款客户" prop="wangwangnum">
                    <Input disabled v-model="showEditForm.wangwangnum" style="width:150px" />
                </FormItem>

                <FormItem label="客户类型">
                    <div>
                        <Input disabled v-model="showEditForm.custtype" style="width:75px" />
                        <Input disabled v-model="showEditForm.childtype" style="width:75px" />
                    </div>
                </FormItem>

                <FormItem label="退款渠道" prop="refundChannel">
                    <select v-model="showEditForm.refundChannel" style="width: 160px;height:35px">
                        <option value="1">SEM在线订购</option>
                        <option value="2">支付宝转账</option>
                        <option value="3">网银转账</option>
                        <option value="4">定制市场订购</option>
                        <option value="5">现金</option>
                        <option value="6">POS机</option>
                        <option value="7">京东在线订购</option>
                        <option value="8">微信支付</Option>
                    </select>
                </FormItem>
                <FormItem label="退款日期" prop="hDate">
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="showEditForm.hDate" style="width:200px"></DatePicker>
                </FormItem>

            </div>
            <div style="width:240px;float:left">
                <FormItem label="店铺类型" prop="shopptype">
                    <Input disabled v-model="showEditForm.shopptype" style="width:120px" />
                </FormItem>

                <FormItem label="店长" prop="username1">
                    <Input disabled v-model="showEditForm.username1" style="width:120px" />
                </FormItem>
                <FormItem label="所属团队" prop="teamname">
                    <Input disabled v-model="showEditForm.teamname" style="width:120px" />
                </FormItem>

            </div>
            <div style="width:500px">
                <FormItem label="退款原因" prop="refundCause">
                    <Input v-model="showEditForm.refundCause" style="width:500px" type="textarea" />
                </FormItem>
                <!-- <FormItem label="外因" prop="externalCause">
                    <Input v-model="showEditForm.externalCause" style="width:500px" type="textarea" />
                </FormItem> -->
                <FormItem label="备注" prop="remark">
                    <Input v-model="showEditForm.remark" style="width:500px" type="textarea" />
                </FormItem>
            </div>
            <!-- <FormItem label="场景还原" prop="scenarioReduction">
                <a :href='showEditForm.scenarioReduction' target="_blank">{{showEditForm.scenarioReduction}}</a>
            </FormItem> -->
            <!-- <FormItem>
                <Button @click="reset1">重置</Button>
            </FormItem> -->
        </Form>
        
        <!-- <h5>场景还原</h5>
        <Table border ref="fileList" :columns="columns3" :data="data3" width=100%></Table> -->
    </Modal>

    <!-- 文件列表 -->
    <Modal v-model="fileModal" @on-ok="fileTable" @on-visible-change="resetDate1" @on-cancel="cancelFileList" width=30%>
        <h3 slot="header" style="color:#2D8CF0">文件列表</h3>
        <template>
            <Upload ref="upload" name="file" :show-upload-list="false" :on-success="handleSuccess" :multiple="true" action="http://192.168.1.112:9090/mj-admin/sys/refund/uploads" style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="30"></Icon>
                </div>
            </Upload>
        </template>
        <Table border ref="selection" :columns="columns3" :data="data3" width=100%>
        </Table>
    </Modal>

    <!-- 删除，确认删除 -->
    <Modal v-model="showDeleteModal" width=15 @on-ok="saveDelete" @on-cancel="cancelDelete">
        <!--<h3 slot="header" style="color:red">确定删除吗</h3>-->
        <h2 style="color:red;text-align: center;font-size: 20px">确定删除吗</h2>

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
export default { //主方法
    name: "Refund",
    name1: "Files",
    data() {
        return {
            params: {
                pageNum: 1,
                pageSize: 10,
                wangwangnum: '',
                shopptype: '',
                username1: '',
                username2: '',
                TeamName: '',
                dateTime:'',
                // startTime: '',
                // endTime: '',
                result: -1,
                TScustomer:'',
                PersonnelID:-1,
            },
            params1: {
                level: 0,
            },
            showEditModal: false, //不显示
            showEditModalAll: false, //不显示
            reViewModal: false, //不显示
            showAddModal: false, //不显示
            totalCount: 0,
            ts: false,
            // tscustomer:[],
            pageNumber: [], //表格页数
            length: [], //表格每页长度
            size: [], //批量删除时候选中的个数
            showModal: false, //不显示
            fileModal: false,
            //客诉大类别
            levels:[],
            //客诉小类别
            levelNames:[],
            showAddForm: {
                wangwangnum: '',
                refundDate: '',
                refundAmount: '',
                refundChannel: '',
                refundCause: '',
                remark: '',
                hDate:'',
                // externalCause:'',
            },
            showEditForm: {
                pkId: '',
                wangwangnum: '',
                refundDate: '',
                refundAmount: '',
                refundChannel: '',
                refundCause: '',
                remark: '',
                custtype: '',
                childtype: '',
                turnovermoney: '',
                shopptype: '',
                deadline: '',
                username1: '',
                username2: '',
                // technologyrecruitmentid:'',
                teamname: '',
                result: '',
                isDelete: '',
                deadline: '',
                level:'',
                sonLevel:'',
                parentId:'',
                externalCause:'',
                tename:'',
                pname:'',
            },
            complaintIds:{
                pkId: '',
                parentId: '',
                complaintName:'',
                parentName:'',
            },
            showFileForm: {
                url: '',
                name: '',
                complaintId: '',
            },

            //表单验证(如果为空就会提示)
            addForm: {
                wangwangnum: [{
                        required: true,
                        message: '请输入退款客户',
                        trigger: 'blur'
                    },
                    // {validator:validAccess,trigger:'blur'}
                ],
                refundAmount: [{
                        required: true,
                        message: '请输入退款金额',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[1-9]\d*$/,
                        message: '该字段为正整数',
                        trigger: 'blur'
                    }
                ],
                refundChannel: [{
                    required: true,
                    message: '请选择退款渠道',
                    trigger: 'blur'
                }]
            },
            loading: false,
            showDeleteModal: false,
            showDeleteFileModal: false,

            //主表格
            columns1: [{
                    title: '序号',
                    width: 80,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: '客户名',
                    align: 'center',
                    key: 'wangwangnum'
                },
                {
                    title: '退款日期',
                    align: 'center',
                    key: 'refundDate'
                },
                {
                    title: '退款金额',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'block'
                                }
                            }, params.row.refundAmount + "元"),
                        ]);
                    },
                    // key: 'refundAmount'
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
                    title: '退款原因',
                    align: 'center',
                    ellipsis: true,
                    key: 'refundCause',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'span', {
                                    style: {

                                    },
                                    //就是这里加的属性
                                    domProps: {
                                        title: params.row.refundCause,
                                    }
                                },
                                params.row.refundCause,
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

            //历史记录表格
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
                    title: '判责结果',
                    align: 'center',
                    render: (h, params) => {
                    const row = params.row;
                    const color=row.result==0 ? 'green' :(row.result ==1 ? 'red':(row.result ==2 ? 'blue':(row.result == 3 ? 'purple ':(row.result == 4 ? 'pink':'orange'))));
                    const text=row.result==0 ? '微责' :(row.result ==1 ? "无责":(row.result == 2 ? '重责':(row.result == 3 ? '轻责': (row.result == 4 ? '中责':'待定'))));
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
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        let detailsBtn = h('Button', {
                            props: {
                                type: 'warning',
                                size: 'small'
                            },
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.showEditModalDataAll(params);
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

            isClearAble: true,
            isDisabled: true,
            loadingStatus: false,
            data1: [],
            data2: [],
            data3: [],
            // data4: [],
            pkIds: []
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
        //新增重置
        reset() {
            this.$refs.form1.resetFields();
        },
        reset1(){
            this.$refs.form2.resetFields();
        },
         inits() {
            // 数据初始化
            this.loading = true;
            API.refundList.lists(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data1 = data.data.list;
                    // console.log("第一个data1为:"+this.data1);
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
        init() {
            // 数据初始化
            this.loading = true;
            API.refundList.lists(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data1 = data.data.list;
                    // console.log("第一个data1为:"+this.data1);
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
        resetData(val) {
            if (!val) {
                this.showEditForm = {
                    pkId: '',
                    wangwangnum: '',
                    refundDate: '',
                    refundAmount: '',
                    refundChannel: '',
                    refundCause: '',
                    remark: '',
                    custtype: '',
                    childtype: '',
                    turnovermoney: '',
                    shopptype: '',
                    deadline: '',
                    username1: '',
                    username2: '',
                    // technologyrecruitmentid:'',
                    teamname: '',
                    result: '',
                    isDelete: '',
                    deadline: '',
                };
            }
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
        addModal() {
            this.showAddModal = true;
        },

        //批量上传文件
        uploadAdd(params, showFileForm) {
            this.ts = true;
            let complaintId = params.row.pkId;
            this.showFileForm.complaintId = complaintId;
            this.loading = false;
        },

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
                API.refundList.addFile(this.showFileForm).then(({
                    data
                }) => {
                    if (data && data.code == 0) {
                        this.init();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
                API.refundList.listFile(this.showFileForm).then(({
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

        save() {
            API.refundList.insert(this.showAddForm).then(({
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
            API.refundList.ByWang(this.showAddForm).then(({
                data
            }) => {
                if (data.code == 200003) {} else {
                    this.$Message.error(data.msg);
                }
            })
        },

        //调用上传文件接口
        fileAdd() {
            API.refundList.addFile(this.showFileForm).then(({
                data
            }) => {
                // console.log("222222222:"+this.showFileForm.refundId);
                if (data && data.code == 0) {
                    this.init();
                } else {
                    this.$Message.error(data.msg);
                }
            })
        },

        //调用修改接口
        saveEdit() {
            // console.log("进入修改");
            API.refundList.update(this.showEditForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.init();
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            })
        },
        cancelEdit() {
            this.showEditModal = false;
        },
        cancelEdit() {
            this.fileModal = false;
        },
        cancel() {
            this.showAddModal = false;
        },

        //详情
        showEditModalDataAll(params) {
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
            this.showEditModalAll = true;
            if (typeof params.row != 'undefined') {
                const Refund = params.row;
                this.showEditForm.pkId = Refund.pkId;
                this.showEditForm.wangwangnum = Refund.wangwangnum;
                this.showEditForm.refundChannel = Refund.refundChannel;
                this.showEditForm.scenarioReduction = Refund.scenarioReduction;
                this.showEditForm.remark = Refund.remark;
                this.showEditForm.refundAmount = Refund.refundAmount;
                this.showEditForm.result = Refund.result;
                this.showEditForm.isDelete = Refund.isDelete;
                this.showEditForm.hDate = Refund.refundDate;
                this.showEditForm.refundCause = Refund.refundCause;
                this.showEditForm.level = Refund.level;
                this.showEditForm.custtype = Refund.custtype;
                this.showEditForm.childtype = Refund.childtype;
                this.showEditForm.turnovermoney = Refund.turnovermoney;
                this.showEditForm.teamname = Refund.teamname;
                this.showEditForm.serverdeadline = Refund.serverdeadline;
                this.showEditForm.serverdeadlineend = Refund.serverdeadlineend;
                this.showEditForm.deadline = Refund.deadline;
                this.showEditForm.username1 = Refund.username1;
                this.showEditForm.username2 = Refund.username2;
                this.showEditForm.shopptype = Refund.shopptype;
                this.showEditForm.level = Refund.level;
                this.showEditForm.sonLevel = Refund.sonLevel;
                this.showEditForm.externalCause = Refund.externalCause;
                this.showEditForm.parentId = Refund.parentId;
                this.showEditForm.externalCause = Refund.externalCause;
            }
        },

        //修改
        showEditModalData(params) {
            this.showEditModal = true;
            this.showFileForm.complaintId = params.row.pkId;
            this.params1.parentId=this.showEditForm.level;
            if (typeof params.row != 'undefined') {
                const Refund = params.row;
                this.showEditForm.pkId = Refund.pkId;
                this.showEditForm.wangwangnum = Refund.wangwangnum;
                this.showEditForm.refundChannel = Refund.refundChannel;
                this.showEditForm.scenarioReduction = Refund.scenarioReduction;
                this.showEditForm.remark = Refund.remark;
                this.showEditForm.refundAmount = Refund.refundAmount;
                this.showEditForm.result = Refund.result;
                this.showEditForm.isDelete = Refund.isDelete;
                this.showEditForm.refundDate = Refund.refundDate;
                this.showEditForm.hDate = Refund.refundDate;
                this.showEditForm.refundCause = Refund.refundCause;
                this.showEditForm.level = Refund.level;
                this.showEditForm.custtype = Refund.custtype;
                this.showEditForm.childtype = Refund.childtype;
                this.showEditForm.turnovermoney = Refund.turnovermoney;
                this.showEditForm.teamname = Refund.teamname;
                this.showEditForm.serverdeadline = Refund.serverdeadline;
                this.showEditForm.serverdeadlineend = Refund.serverdeadlineend;
                this.showEditForm.deadline = Refund.deadline;
                this.showEditForm.username1 = Refund.username1;
                this.showEditForm.username2 = Refund.username2;
                this.showEditForm.shopptype = Refund.shopptype;
                this.showEditForm.tename = Refund.username1;
                this.showEditForm.pname = Refund.username2;
                console.log("shia kjfj"+this.showEditForm.tename);
            }
        },

        /* 删除模块，弹出弹框*/
        delete(params) {
            //this.pkIds=[params.row.pkId];
            this.pkIds = [];
            this.showDeleteModal = true;
            let pkIds = this.pkIds;
            if (typeof params.row != 'undefined') {
                pkIds.push(params.row.pkId);
            } else {
                this.selection.forEach(v => {
                    pkIds.push(v.pkIds)
                });
            };
        },

        /* 确定删除*/
        saveDelete() {
            let pkIds = this.pkIds;
            let param = {
                "pkIds": pkIds
            };
            API.refundList.less(param).then(({
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
        cancelDelete() {
            this.showDeleteModal = false;
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
            // console.log("333333333333333333333conplaintId值为:"+complaintId);
            API.refundList.deleteFile(this.showFileForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    // console.log("data11111111:" + pkId);
                    // console.log("refundId为：" + refundId);
                    // this.ini1();
                    // console.log("wkjrfioqwejkruwjfiowjf");
                    API.refundList.listFile(this.showFileForm).then(({
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

        // 选择状态改变
        selectionChange(data) {
            this.size = data.length
            this.selection = data;
        },

        showFileFormList(params) {
            this.fileModal = true;
            this.showFileForm.complaintId = params.row.pkId;
            // console.log("4444444444444444444444refundId为：" + this.showFileForm.refundId);
            API.refundList.listFile(this.showFileForm).then(({
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

        //通过wangwangnum查询
        lookModal(params) {
            this.showModal = true;
            this.params.wangwangnum = params.row.wangwangnum;
            // console.log(this.params.wangwangnum+"sefh iowrw jkojrjjjjjjjjj");
            this.params.pageNum = 1;
            // 数据初始化
            this.loading = true;
            /*data是接口返回的data*/
            API.complaintList.listByWangWangNum(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data2 = data.data;
                    console.log("data2"+this.data2);
                    this.params.wangwangnum = '';
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            this.loading = false;
        },
        saveTable() {
            this.showModal = false;
        },
        fileTable() {
            this.fileModal = false;
        },
        cancelTable() {
            this.showModal = false;
        },
        cancelFileList() {
            this.fileModal = false;
        },
        //点击客诉大类别
            selectLevel(params){
            this.params1.parentId=this.showEditForm.level;
            this.showEditForm.parentId = this.params1.parentId;
            this.showEditForm.pkId = this.showEditForm.sonLevel;
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
            API.responsibilityList.update(this.showEditForm).then(({data}) => {
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
