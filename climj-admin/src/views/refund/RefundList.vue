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
        <i-select @on-change="inits" v-model="params.status" placeholder="选择状态" filterable style="width:120px" :clearable="isClearAble">
            <Option value="0">待审核</Option>
            <Option value="1">已审核</Option>
            <Option value="2">待审定</Option>
            <Option value="-1">全部</Option>
        </i-select>
        </Col>

        <!-- 日期查询 -->
        <Col span="3">
        <DatePicker type="date" style="width:210px" format="yyyy-MM-dd HH:mm:ss" v-model="params.startTime" @on-change="init" placeholder="请选择开始时间"></DatePicker>
        </Col>
        <Col span="3">
        <DatePicker type="date" style="width:210px" format="yyyy-MM-dd HH:mm:ss" v-model="params.endTime" @on-change="init" placeholder="请选择结束时间"></DatePicker>
        </Col>

        <!-- <Col>
                <i-col>
                    <Date-picker type="daterange" :options="options2" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
                </i-col>
            </Col>   -->

        <!-- 查询 -->
        <Col span="2" style="margin-left: 10px">
        <Input v-model="params.wangwangnum" style="width:120px" @on-change="inits" placeholder="请输入客户名"  clearable filterable/>
        </Col>
        <Col span="2" style="margin-left: 10px">
        <Input v-model="params.shopptype" style="width:120px" @on-change="inits" placeholder="请输入店铺类型"  :clearable="isClearAble" />
        </Col>
        <Col span="2" style="margin-left: 10px">
        <Input v-model="params.username1" style="width:120px" @on-change="inits" placeholder="请输入店长"  clearable filterable />
        </Col>
        <Col span="2" style="margin-left: 10px">
        <Input v-model="params.username2" style="width:120px" @on-change="inits" placeholder="请输入招商顾问"  clearable filterable />
        </Col>
        <Col span="2" style="margin-left: 10px">
        <Input v-model="params.teamname" style="width:120px" @on-change="inits" placeholder="请输入团队"  clearable filterable />
        </Col>

        <!-- 搜索按钮 -->
        <Col span="1" style="margin-left: 5px">
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

    <!--上传文件-->
    <Modal v-model="ts" @on-ok="fileAdd" @on-cancel="cancelEdit">
        <h3 slot="header" style="color:#2D8CF0">上传文件</h3>

        <template>
            <Upload ref="upload" name="file" :show-upload-list="false" :on-success="handleSuccess" :multiple="true" action="http://192.168.1.112:9090/mj-admin/sys/refund/uploads" style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="30"></Icon>
                </div>
            </Upload>
        </template>

        <!-- <template>
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <Upload ref="upload" :show-upload-list="false" :on-success="handleSuccess" name="file" :multiple="true" action="http://localhost:8090/sys/refund/uploads" 
                    style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="30"></Icon>
                    <p>点击或将文件拖拽到这里上传</p>
                </div>
            </Upload>
        </template> -->
    </Modal>

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
    <Modal v-model="showEditModalAll" @on-ok="saveEdit" @on-cancel="cancelEdit" width=752>
        <h3 slot="header" style="color:#2D8CF0">详情</h3>
        <Form :model="showEditForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser" inline>
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
                    <Input disabled v-model="showEditForm.refundAmount" style="width:120px" />
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
                <FormItem label="退款时间" prop="hDate">
                    <i-col span="11">
                        <DatePicker type="datetime" readonly disabled format="yyyy-MM-dd HH:mm" v-model="showEditForm.hDate" style="width:160px"></DatePicker>
                    </i-col>
                </FormItem>
            </div>
            <div style="width:240px;float:left">
                <FormItem label="店铺类型" prop="shopptype">
                    <Input disabled v-model="showEditForm.shopptype" style="width:120px" />
                </FormItem>

                <FormItem label="店长" prop="username1  ">
                    <Input disabled v-model="showEditForm.username1" style="width:120px" />
                </FormItem>
                <FormItem label="所属团队" prop="teamname">
                    <Input disabled v-model="showEditForm.teamname" style="width:120px" />
                </FormItem>

            </div>
            <div style="width:500px">
                <FormItem label="退款原因" prop="refundCause">
                    <Input disabled v-model="showEditForm.refundCause" style="width:500px" type="textarea" />
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input disabled v-model="showEditForm.remark" style="width:500px" type="textarea" />
                </FormItem>
            </div>
            <!-- <FormItem label="场景还原" prop="scenarioReduction">
                <a :href='showEditForm.scenarioReduction' target="_blank">{{showEditForm.scenarioReduction}}</a>
            </FormItem> -->
        </Form>
        <!-- <h5>场景还原</h5>
        <Table border ref="selection" :columns="columns1" :current="params.pageNum" :data="data1" width=100%></Table> -->
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
    <Modal v-model="fileModal" @on-ok="fileTable" @on-visible-change="resetDate1" @on-cancel="cancelFileList" width=50%>
        <h3 slot="header" style="color:#2D8CF0">历史记录</h3>
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
                teamname: '',
                startTime: '',
                endTime: '',
                status: -1
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
                status: '',
                isDelete: '',
                deadline: '',
                // externalCause:'',
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
                            'div', [editBtn, deleteBtn, uploadBtn, showBtn, fileBtn]
                        );

                    }
                }
            ],

            //历史记录表格
            columns2: [{
                    title: '客户',
                    align: 'center',
                    key: 'wangwangnum'
                },
                {
                    title: '店长',
                    align: 'center',
                    key: 'username1'
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
                    // key:'refundAmount'
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
                                    style: {},
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
                    title: '退款时间',
                    align: 'center',
                    key: 'refundDate'
                },
                {
                    title: '审核状态',
                    align: 'center',
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

        // init1() {
        //     //列表数据初始化
        //     this.loading = true;
        //     console.log("2222222222222222223333333333")
        //     let refundId = this.showFileForm.refundId;
        //     API.refundList.listFile(this.showFileForm).then(({
        //         data
        //     }) => {
        //         console.log("id为外：" + this.showFileForm.refundId);
        //         if (data && data.code == 0) {
        //             this.data3 = data.data.list;
        //             console.log("id为内：" + this.showFileForm.refundId);
        //             // this.init1();
        //         } else {
        //             this.$Message.error(data.msg);
        //         }
        //     }).catch((data) => {
        //         this.$Message.error('连接失败，请检查网络！');
        //     });
        //     this.loading = false;
        // },

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
                    status: '',
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
            // this.params.id = params.row.pkId;
            let complaintId = params.row.pkId;
            this.showFileForm.complaintId = complaintId;
            console.log("11111111111111111111111complaintId为:"+complaintId);
            // params2.refundId = refundId;
            // console.log("111111111111:" + refundId);
            // console.log("fowrjoejri30918498240:" + this.showFileForm.refundId);
            //调用addFile，将id传给file数据库
            //  API.complaintList.listById(this.params).then(({data}) =>{
            //    if (data && data.code == 0) {
            //     this.data3 = data.data;
            //     this.params.id='';
            //   } else {
            //     this.$Message.error(data.msg);
            //   }
            // }).catch((data) => {
            //   this.$Message.error('连接失败，请检查网络！');
            // });
            this.loading = false;
        },

        //获取上传的pk_id，调用添加接口

        //上传
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
                this.showFileForm.url = this.url;
                // let refundId = this.refundId;
                // console.log("name为" + name);
                // console.log("id为"+refundId);
                // console.log("url为："+url);
                this.showFileForm.name = name;
                // this.showFileForm.refundId =refundId;
            } else {
                alert("上传失败");
            }
        },
        //上传错误回调
        // handleFormatError(file) {
        //     this.$Notice.warning({
        //         title: 'The file format is incorrect',
        //         desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        //     });
        // },
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
            this.showEditModalAll = true;
            if (typeof params.row != 'undefined') {
                const Refund = params.row;
                this.showEditForm.pkId = Refund.pkId;
                this.showEditForm.wangwangnum = Refund.wangwangnum;
                this.showEditForm.refundChannel = Refund.refundChannel;
                this.showEditForm.scenarioReduction = Refund.scenarioReduction;
                this.showEditForm.remark = Refund.remark;
                this.showEditForm.refundAmount = Refund.refundAmount;
                this.showEditForm.status = Refund.status;
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
                // this.showEditForm.externalCause = Refund.externalCause;
            }
        },

        //修改
        showEditModalData(params) {
            this.showEditModal = true;
            this.showFileForm.complaintId = params.row.pkId;
            // console.log("值为:"+params.row.pkId);
            // console.log("22222222222222222222conplaintId值为:"+this.showFileForm.complaintId);
            if (typeof params.row != 'undefined') {
                const Refund = params.row;
                this.showEditForm.pkId = Refund.pkId;
                this.showEditForm.wangwangnum = Refund.wangwangnum;
                this.showEditForm.refundChannel = Refund.refundChannel;
                this.showEditForm.scenarioReduction = Refund.scenarioReduction;
                this.showEditForm.remark = Refund.remark;
                this.showEditForm.refundAmount = Refund.refundAmount;
                this.showEditForm.status = Refund.status;
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
                // this.showEditForm.externalCause = Refund.externalCause;
                // console.log("修改:退款金额为1111111111111111111:"+Refund.turnovermoney);
                // console.log("修改:退款金额为2222222222222222222:"+this.showEditForm.turnovermoney);
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
            API.refundList.listByWangWangNum(this.params).then(({
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
    }
}
</script>

<style scoped>

</style>
