<template>
<div>
    <!-- 筛选，判断 -->
    <Row style="margin-top: 15px" type="flex">
        <!-- 增加按钮 -->
        <Col span="2">
        <span><Button type="primary" @click="addModal" icon="search">增加</Button></span>
        <!-- <span ><Button  type="error"  @click="this.delete" icon="trash-a">批量删除</Button></span> -->
        </Col>

        <!-- 状态选择 -->
        <Col span="4">
        <i-select @on-change="init" v-model="params.result" placeholder="选择状态" filterable :clearable="isClearAble" style="width:170px">
            <Option value="0">微责</Option>
            <Option value="1">无责</Option>
            <Option value="2">重责</Option>
            <Option value="3">中责</Option>
            <Option value="4">轻责</Option>
            <Option value="5">待定</Option>
        </i-select>
        </Col>

        <!-- <Col>
                <i-col>
                    <Date-picker type="daterange" :options="options2" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
                </i-col>
            </Col>   -->

        <!-- 查询 -->
        <Col span="4">
        <Input v-model="params.wangwangnum" style="width:170px" @on-change="init" placeholder="请输入客户名" clearable />
        </Col>
        <Col span="4">
        <!-- <Input v-model="params.shopptype" style="width:170px" @on-change="init" placeholder="请输入店铺类型" clearable /> -->
         <Select @on-change="init" v-model="params.shopptype" placeholder="选择店铺类别" style="width: 170px" clearable filterable>
            <Option v-for="shopptype in shopptypes" :label="shopptype.shopptype" :value="shopptype.shopptype" :key="shopptype.shopptype" >
              {{shopptype.shopptype}}
            </Option>
          </Select>
        </Col>
        <!-- 日期查询 -->
        <Col span="4">
        <Date-picker type="datetimerange" v-model="params.dateTime" format="yyyy-MM-dd HH:mm" @on-change="init" placeholder="选择日期和时间" style="width: 300px"></Date-picker>
        </Col>
    </Row>
    <Row style="margin-top:5px">
        <Col span="4" push=2>
        <!-- <Input v-model="params.username1" style="width:170px" @on-change="init" placeholder="请输入店长" clearable /> -->
         <Select @on-change="init" v-model="params.TScustomer" placeholder="选择店长" style="width:170px" clearable filterable>
            <Option v-for="teamNameId in personnelIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id">
                {{teamNameId.username}}
            </Option>
        </Select>
        </Col>
        <Col span="4" push=2>
        <!-- <Input v-model="params.username2" style="width:170px" @on-change="init" placeholder="请输入招商顾问" clearable /> -->
         <Select @on-change="init" v-model="params.PersonnelID" placeholder="选择招商顾问" style="width: 170px" clearable filterable>
            <Option v-for="teamNameId in personnelIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id">
                {{teamNameId.username}}
            </Option>
        </Select>
        </Col>
        <Col span="4" push=2>
        <!-- <Input v-model="params.TeamName" style="width:170px" @on-change="init" placeholder="请输入团队" clearable /> -->
        <Select @on-change="init" v-model="params.TeamName" placeholder="选择团队" style="width: 170px" clearable filterable>
            <Option v-for="teamNameId in teamNameIds" :label="teamNameId.teamname" :value="teamNameId.teamname" :key="teamNameId.teamname" >
              {{teamNameId.teamname}}
            </Option>
          </Select>
        </Col>
        <Col span="4" push=2>
        <Input v-model="params.frequency" style="width:170px" @click="init" placeholder="请输入隐患次数" clearable />
        </Col>
        <!-- 搜索按钮 -->
        <Col span="4" push=2>
        <span><Button type="primary" @click="init" icon="search">搜索</Button></span>
        </Col>
    </Row>

    <!-- 主页面的表格 -->
    <Row style="margin-top: 25px">
        <Table border ref="selection" :columns="columns1" :data="historyData" width=100%>
        </Table>
    </Row>

    <!-- 分页 -->
    <Row>
        <div style="float:right">
            <Page :total="totalCount" :page-size="pageSize" :current="pageCurrent" show-total  @on-change="changepage"></Page>
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
    <!--添加提示-->
    <!--添加提示-->
    <Modal v-model="confirmModal" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span v-show="this.a == 200001">您输入的信息有误</span>
            <span v-show="this.a == 200003">您输入的信息无异常</span>
        </p>
        <div v-show="this.a == 200001" style="text-align:center">
            <span>系统不存在该用户</span>
        </div>
        <div v-show="this.a == 200003" style="text-align:center">
            <span>此用户可添加</span>
        </div>
        <div slot="footer">
            <Button type="success" @click="confirmAdd" v-show="this.a == 200003">确定</Button>
            <Button type="error" @click="confirmCancel" v-show="this.a == 200001">取消</Button>
        </div>
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
                <FormItem label="判责结果" prop="result">
                    <select v-model="modifierForm.result" disabled placeholder="选择状态" filterable style="width:120px;height:30px">
                        <option value="0">微责</option>
                        <option value="1">无责</option>
                        <option value="2">重责</option>
                        <option value="3">轻责</option>
                        <option value="4">中责</option>
                        <option value="5">待定</option>
                        <option value="null">待定</option>
                    </select>
                </FormItem>
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
            <FormItem label="客诉大类别" prop="parentName">
                <Select @on-change="selectLevel" v-model="modifierForm.level" placeholder="Select your level" style="width: 300px">
                    <Option v-for="levelId in levels" :label="levelId.parentName" :value="levelId.parentId" :key="levelId.parentId">
                        {{levelId.parentName}}
                    </Option>
                </Select>
            </FormItem>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="客诉小类别" prop="complaintName">
                    <select v-model="modifierForm.sonLevel" placeholder="暂无小类别" style="width: 300px;height:30px">
                        <option v-for="complaintNameId in levelNames" :label="complaintNameId.complaintName" :value="complaintNameId.complaintIds" :key="complaintNameId.complaintIds">
                            {{complaintNameId.complaintName}}
                        </option>
                    </select>
                </FormItem>
                </Col>
            </Row>
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
    <Modal v-model="detailsModal" @on-ok="details" @on-cancel="cancelDetails" width=650>
        <h3 slot="header" style="color:#2D8CF0">详情</h3>
        <Form :model="modifierForm" label-position="right" :label-width="100" @submit.native.prevent="saveModifier" inline>
            <FormItem label="客户名" prop="wangwangnum" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <Input disabled v-model="modifierForm.wangwangnum" style="width:180px" />
            </FormItem>
            <FormItem label="次数" prop="frequency" v-if="modifierForm.type ==0 | modifierForm.type==1">
                <Input disabled v-model="modifierForm.frequency" style="width:180px" />
            </FormItem>
            <FormItem label="客户类型" v-if="modifierForm.type==1 | modifierForm.type==2">
                <div style="width:180px">
                    <Input disabled v-model="modifierForm.custtype" style="width:80px" />
                    <Input disabled v-model="modifierForm.childtype" style="width:80px" />
                </div>
            </FormItem>
            <FormItem label="服务期" prop="deadline" v-if="modifierForm.type==2">
                <Input disabled v-model="modifierForm.deadline" style="width:180px" />
            </FormItem>
            <FormItem label="招商顾问" prop="pname" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <Input disabled v-model="modifierForm.pname" style="width:180px" />
            </FormItem>
            <FormItem label="合同金额" prop="turnovermoney" v-if="modifierForm.type==2">
                <Input disabled v-model="modifierForm.turnovermoney" style="width:180px" />
            </FormItem>
            <FormItem label="退款金额" prop="refundAmount" v-if="modifierForm.type==2">
                <Input disabled v-model="modifierForm.refundAmount" style="width:180px" />
            </FormItem>
            <FormItem label="退款渠道" prop="refundChannel" v-if="modifierForm.type==2">
                <select v-model="modifierForm.refundChannel" disabled style="width:180px;height:30px">
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
            <FormItem label="时间" prop="createTime" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <i-col span="11">
                    <DatePicker type="datetime" readonly disabled format="yyyy-MM-dd HH:mm" v-model="modifierForm.createTime" style="width:180px"></DatePicker>
                </i-col>
            </FormItem>
            <FormItem label="店铺类型" prop="shopptype" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <Input disabled v-model="modifierForm.shopptype" style="width:180px" />
            </FormItem>
            <FormItem label="店长" prop="tename" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <Input disabled v-model="modifierForm.tename" style="width:180px" />
            </FormItem>
            <FormItem label="店长所属团队" prop="teamname" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <Input disabled v-model="modifierForm.teamname" style="width:180px" />
            </FormItem>
            <FormItem label="车手" prop="carname" v-if="modifierForm.type ==0">
                <Input disabled v-model="modifierForm.carname" style="width:180px" />
            </FormItem>
            <!-- 投诉管理 -->
            <FormItem label="投诉渠道" prop="channel" v-if="modifierForm.type ==0">
                <select v-model="modifierForm.channel" disabled style="width:180px;height:30px">
                    <option value="1">招商京东</option>
                    <option value="2">招商淘宝</option>
                    <option value="3">综管部</option>
                    <option value="4">企划部</option>
                    <option value="5">京东官方投诉</option>
                    <option value="6">京东差评投诉</option>
                    <option value="7">淘宝官方投诉</option>
                    <option value="8">其他</Option>
                </select>
            </FormItem>
            <FormItem label="近30天成交额" prop="turnover" v-if="modifierForm.type ==0">
                <Input v-model="modifierForm.turnover" disabled placeholder="店铺近30天成交额" style="width:180px" />
            </FormItem>
            <FormItem label="近30天成交笔数" prop="number" v-if="modifierForm.type ==0">
                <Input v-model="modifierForm.number" disabled placeholder="店铺近30天成交笔数" style="width:180px" />
            </FormItem>
            <FormItem label="判责结果" prop="result" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <select v-model="modifierForm.result" disabled placeholder="判责结果" filterable style="width:180px;height:30px">
                    <option value="0">微责</option>
                    <option value="1">无责</option>
                    <option value="2">重责</option>
                    <option value="3">轻责</option>
                    <option value="4">中责</option>
                    <option value="null">待定</option>
                    <option value="5">待定</option>
                </select>
            </FormItem>
            <FormItem label="店铺行业" prop="industry" v-if="modifierForm.type ==0">
                <select v-model="modifierForm.industry" disabled placeholder="请选择投诉渠道" clearable filterable style="width:180px;height:30px">
                    <option value="1">3c数码配件</option>
                    <option value="2">MP3/MP4/ipod/录音笔</option>
                    <option value="3">ZIPPO/瑞士军刀/眼镜</option>
                    <option value="4">办公设备/耗材/相关服务</option>
                    <option value="5">保健品/膳食营养补充食品</option>
                    <option value="6">本地优化生活服务</option>
                    <option value="7">笔记本电脑</option>
                    <option value="8">彩妆/香水/美妆工具</option>
                    <option value="9">餐饮具</option>
                    <option value="10">餐饮美食</option>
                    <option value="11">茶/咖啡/冲印</option>
                    <option value="12">超市卡/商场购物卡</option>
                    <option value="13">成人用品/避孕/计生用品</option>
                    <option value="14">宠物/宠物食品及用品</option>
                    <option value="15">厨房/烹饪用具</option>
                    <option value="16">厨房电器</option>
                    <option value="17">传统滋补营养品</option>
                    <option value="18">床上用品</option>
                    <option value="19">大家电</option>
                    <option value="20">电脑硬件/显示器/电脑周边</option>
                    <option value="21">电玩/配件/游戏/攻略</option>
                    <option value="22">电影/演出/体育赛事</option>
                    <option value="23">电子/电工</option>
                    <option value="24">电子词典/电纸书/文化用品</option>
                    <option value="25">度假旅游/签证送关/旅游服务</option>
                    <option value="26">服饰配件/皮带/帽子/围巾</option>
                    <option value="27">服务市场</option>
                    <option value="28">个人护理/保健/按摩器材</option>
                    <option value="29">个性定制/设计服务/DIY</option>
                    <option value="30">购物提货券/蛋糕面包</option>
                    <option value="31">古董/邮币/字画/收藏</option>
                    <option value="32">国货精品数码</option>
                    <option value="33">国内机票/国际机票/增值服务</option>
                    <option value="34">户外/登山/野营/旅行用品</option>
                    <option value="35">基础建材</option>
                    <option value="36">家居饰品</option>
                    <option value="37">家庭/个人清洁用具</option>
                    <option value="0">其他</option>
                </select>
            </FormItem>
            <FormItem label="跟进人员" prop="followPersonel" v-if="modifierForm.type ==0">
                <select v-model="modifierForm.followPersonel" disabled placeholder="无责任人" style="width:180px;height:30px">
                    <option v-for="personnelId in personnelIds" :label="personnelId.username" :value="personnelId.id" :key="personnelId.id">
                        {{personnelId.username}}
                    </option>
                </select>
            </FormItem>
            <FormItem label="处理方案" prop="processingScheme" v-if="modifierForm.type ==0">
                <Input v-model="modifierForm.processingScheme" disabled placeholder="处理方案" type="textarea" style="width:180px" />
            </FormItem>
            <FormItem label="跟进过程" prop="followProcess" v-if="modifierForm.type ==0">
                <Input v-model="modifierForm.followProcess" disabled placeholder="跟进过程" type="textarea" style="width:180px" />
            </FormItem>
            <!-- <FormItem label="招商顾问" prop="username" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <Select v-model="modifierForm.personnelid" disabled placeholder="无招商顾问" style="width:180px">
                    <Option v-for="personnelId in personnelIds" :label="personnelId.username" :value="personnelId.id" :key="personnelId.id">
                        {{personnelId.username}}
                    </Option>
                </Select>
            </FormItem> -->
            <FormItem label="客诉大类别" prop="parentName" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <Select @on-change="selectLevel" v-model="modifierForm.level" disabled placeholder="Select your level" style="width:180px">
                    <Option v-for="levelId in levels" :label="levelId.parentName" :value="levelId.parentId" :key="levelId.parentId">
                        {{levelId.parentName}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="客诉小类别" prop="complaintName" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <select v-model="modifierForm.sonLevel" disabled placeholder="Select your pkId" style="width:180px;height:30px">
                    <option v-for="complaintNameId in levelNames" :label="complaintNameId.complaintName" :value="complaintNameId.complaintIds" :key="complaintNameId.complaintIds">
                        {{complaintNameId.complaintName}}
                    </option>
                </select>
            </FormItem>
            <FormItem label="原因" prop="content" v-if="modifierForm.type ==0 | modifierForm.type==1">
                <Input v-model="modifierForm.content" disabled placeholder="请输入投诉内容" type="textarea" style="width:400px" />
            </FormItem>
            <FormItem label="原因" prop="refundCause" v-if="modifierForm.type==2">
                <Input disabled v-model="modifierForm.refundCause" type="textarea" style="width:400px" />
            </FormItem>
            <FormItem label="备注" prop="remark" v-if="modifierForm.type ==0 | modifierForm.type==1 | modifierForm.type==2">
                <Input disabled v-model="modifierForm.remark" type="textarea" style="width:400px" />
            </FormItem>
            <!-- <FormItem label="外因" prop="externalCause" v-if="modifierForm.type ==0">
                <Input v-model="modifierForm.externalCause" type="textarea" style="width:400px" />
            </FormItem> -->
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
                wangwangnum: '',
                shopptype: '',
                username1: '',
                username2: '',
                TeamName: '',
                frequency: '',
                dateTime: '',
                PersonnelID: -1,
                TScustomer: '',
                result: -1
            },
            params1: {
                level: 0,
                parentId: 0,
            },
            totalCount: 0,
            pageSize:10,
            pageNum:1,
            pageCurrent:1,
            ajaxHistoryData:[],
            historyData:[],
            shopptypes:[],
            //状态码
            a: 0,
            showAddModal: false, //不显示
            loading: false,
            //添加按钮刚开始不显示
            confirmModal: false,
            modifierModal: false,
            removeModal: false,
            historyModal: false,
            detailsModal: false,
            uploadFile: false,
            fileModal: false,
            showDeleteFileModal: false,
            showAddForm: {
                wangwangnum: '',
                hDate: '',
                hiddenContent: '',
                remark: '',
            },
            modifierForm: {
                //退款
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
                teamname: '',
                result: '',
                isDelete: '',
                deadline: '',
                level: '',
                sonLevel: '',
                parentId: '',
                externalCause: '',
                tename: '',
                pname: '',
                frequency: '',
                hiddenContent: '',
                carname: '',

                //隐患
                hDate: '',
                hiddenDate: '',
                createTime: '',

                //投诉
                complaintdate: '',
                username: '',
                channel: '',
                turnover: '',
                number: '',
                industry: '',
                followPersonel: '',
                processingScheme: '',
                followProcess: '',
                content: '',

                scenerestoration: '',
                department: '',
                isStop: '',
                worktype: '',
                tscustomer: '',
                complaintid: '',
                personnelid: '',
                technologyRecruitmentid: '',
                complaintIds: '',
                sceneRestorationName: '',
                url: '',
                name: '',
                complaintId: '',
                type: '',
            },
            showFileForm: {
                url: '',
                name: '',
                complaintId: '',
            },
            pageNumber: [], //表格页数
            length: [], //表格每页长度
            //客诉大类别
            levels: [],
            //客诉小类别
            levelNames: [],

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
                            }, "该用户的第" + params.row.frequency + "次隐患"),
                        ]);
                    },
                },
                {
                    title: '店长',
                    align: 'center',
                    key: 'username1'
                },
                {
                    title: '判责结果',
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
            columns2: [{
                    title: '类型',
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.type == 0 ? 'green' : (row.type == 1 ? 'red' : (row.type == 2 ? 'blue' : 'purple'));
                        const text = row.type == 0 ? '投诉' : (row.type == 1 ? "隐患" : (row.type == 2 ? '退款' : '其他'));
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
                            }, "该用户的第" + params.row.frequency + "次"),
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
                    title: '文件名',
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '文件路径',
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

                            }, showFileFrom.row.url)
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
            personnelIds: [],
            //团队名
            teamNameIds:[],
            complaintIds: {
                pkId: '',
                parentId: '',
                complaintName: '',
                parentName: '',
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

        reset() {
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
        //数据初始化
        init() {
            // 数据初始化
            this.loading = true;
            API.hiddenTroubleList.lists(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data1 = data.data.list;
                    this.totalCount = data.data.total;
                    this.length = data.data.list.length;
                    //新增分页
                     //新增分页
                    this.ajaxHistoryData= this.data1;
                    console.log("数据为："+this.ajaxHistoryData);
                    var _start = ( this.pageCurrent - 1 ) * this.pageSize;
                    var _end = this.pageCurrent * this.pageSize;
                    this.historyData = this.ajaxHistoryData.slice(_start,_end);
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            //遍历用户名
            API.complaintList.complaintNames(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.personnelIds = data.data;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            //仅仅遍历团队名
            API.hiddenTroubleList.selectOnleTeam(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.teamNameIds = data.data;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            //大类
            API.complaintList.selectLevel(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.levels = data.data;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
             //店铺类型
            API.hiddenTroubleList.selectShopType(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.shopptypes = data.data;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            this.loading = false;
        },

        pageShow(){
            // 保存取到的所有数据
            this.ajaxHistoryData= this.data1;
            console.log("数据为："+this.ajaxHistoryData);
            var _start = ( this.pageCurrent - 1 ) * this.pageSize;
            var _end = this.pageCurrent * this.pageSize;
            this.historyData = this.ajaxHistoryData.slice(_start,_end);
        },

        changepage(index){
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.historyData = this.ajaxHistoryData.slice(_start,_end);
            this.pageCurrent=index;
        },


        /* 删除模块，弹出弹框*/
        delete(params) {
            //this.pkIds=[params.row.pkId];
            this.pkIds = [];
            this.removeModal = true;
            let pkIds = this.pkIds;
            if (typeof params.row != 'undefined') {
                pkIds.push(params.row.pkId);
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
            this.params.pageNum = 1;
            // 数据初始化
            this.loading = true;
            API.complaintList.listByWangWangNum(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data2 = data.data;
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
        //点击确定添加
        save() {
            this.confirmModal = true;
        },
        //调用添加接口
        confirmAdd() {
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
                this.$Message.error('请完成所有数据添加!');
            })
            this.confirmModal = false;
        },
        //退出确定
        confirmCancel() {
            this.showAddModal = true;
            this.confirmModal = false;
        },
        //调用查看旺旺名是否存在接口
        add() {
            API.hiddenTroubleList.ByWang(this.showAddForm).then(({
                data
            }) => {
                this.a = data.code;
                if (data.code == 200001) {
                    // this.$Message.error("系统不存在该用户");
                } else {
                    this.$Message.success("该用户可添加");
                }
            })
        },

        //点击修改
        modifier() {
            // const strs = this.index
            API.hiddenTroubleList.update(this.modifierForm).then(({
                data
            }) => {

                if (data && data.code == 0) {
                //     API.hiddenTroubleList.lists(this.params).then(({
                //         data
                //     }) => {
                //         if (data && data.code == 0) {
                //             this.data1 = data.data.list;
                //             this.totalCount = data.data.total;
                //             this.length = data.data.list.length;
                //             //新增分页
                //             this.ajaxHistoryDatas = data.data.list;
                //             this.totalCount = data.data.total;
                            // if (this.ajaxHistoryDatas.length <= this.pageSize) {
                            //     // this.historyDatas = this.ajaxHistoryDatas.slice(0, this.pageSize);
                            //     this.historyDatas = this.ajaxHistoryDatas;
                            //     var kaishi = (this.nums - 1) * this.pageSize;
                            //     var jieshu = (this.nums) * this.pageSize;
                            //     console.log(jieshu)
                            //     this.historyDatas = this.ajaxHistoryDatas.slice(0, this.pageSize);

                            // } else {
                            //     this.historyDatas = this.ajaxHistoryDatas;
                            //     var kaishi = (this.nums - 1) * this.pageSize;

                            //     var jieshu = (this.nums) * this.pageSize;
                            //     console.log(jieshu)
                            //     this.historyDatas = this.ajaxHistoryDatas.slice(kaishi, jieshu);
                            // }
                        // } else {
                        //     this.$Message.error(data.msg);
                        // }
                    // }).catch((data) => {
                    //     this.$Message.error('连接失败，请检查网络！');
                    // });
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
            this.showFileForm.pkId = params.row.pkId;
            if (params.row.level != null) {
                //大类
                API.complaintList.selectLevel(this.params).then(({
                    data
                }) => {
                    if (data && data.code == 0) {
                        this.levels = data.data;
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                });
                this.params1.parentId = params.row.level;
                //小类
                API.complaintList.getLevelName(this.params1).then(({
                    data
                }) => {
                    if (data && data.code == 0) {
                        this.levelNames = data.data;
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('当前没有判责');
                });
            }
            if (typeof params.row != 'undefined') {
                const HiddenTrouble = params.row;
                this.modifierForm.pkId = HiddenTrouble.pkId;
                this.modifierForm.teamname = HiddenTrouble.teamname;
                this.modifierForm.username1 = HiddenTrouble.username1;
                this.modifierForm.username2 = HiddenTrouble.username2;
                this.modifierForm.shopptype = HiddenTrouble.shopptype;
                this.modifierForm.hiddenDate = HiddenTrouble.hiddenDate;
                this.modifierForm.hDate = HiddenTrouble.hiddenDate;
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

        //点击客诉大类别
        selectLevel() {
            this.modifierForm.parentId = this.modifierForm.level;
            this.params1.parentId = this.modifierForm.parentId;
            //小类
            if (this.params1.parentId != null) {
                API.complaintList.getLevelName(this.params1).then(({
                    data
                }) => {
                    if (data && data.code == 0) {
                        this.levelNames = data.data;
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('当前没有判责');
                });
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
            this.modifierForm.complaintId = params.row.pkId;
            this.modifierForm.pkId = params.row.pkId;
            if (params.row.level != null) {
                //大类
                API.complaintList.selectLevel(this.params).then(({
                    data
                }) => {
                    if (data && data.code == 0) {
                        this.levels = data.data;
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                });
                this.params1.parentId = params.row.level;
                //小类
                API.complaintList.getLevelName(this.params1).then(({
                    data
                }) => {
                    if (data && data.code == 0) {
                        this.levelNames = data.data;
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('当前没有判责');
                });
            }
            if (typeof params.row != 'undefined') {
                const HiddenTrouble = params.row;
                this.modifierForm.pkId = HiddenTrouble.pkId;
                this.modifierForm.wangwangnum = HiddenTrouble.wangwangnum;
                this.modifierForm.refundChannel = HiddenTrouble.refundChannel;
                this.modifierForm.remark = HiddenTrouble.remark;
                this.modifierForm.refundAmount = HiddenTrouble.refundAmount;
                this.modifierForm.result = HiddenTrouble.result;
                this.modifierForm.isDelete = HiddenTrouble.isDelete;
                this.modifierForm.hDate = HiddenTrouble.refundDate;
                this.modifierForm.createTime = HiddenTrouble.createTime;
                this.modifierForm.refundCause = HiddenTrouble.refundCause;
                this.modifierForm.custtype = HiddenTrouble.custtype;
                this.modifierForm.childtype = HiddenTrouble.childtype;
                this.modifierForm.turnovermoney = HiddenTrouble.turnovermoney;
                this.modifierForm.teamname = HiddenTrouble.teamname;
                this.modifierForm.serverdeadline = HiddenTrouble.serverdeadline;
                this.modifierForm.serverdeadlineend = HiddenTrouble.serverdeadlineend;
                this.modifierForm.deadline = HiddenTrouble.deadline;
                this.modifierForm.username1 = HiddenTrouble.username1;
                this.modifierForm.username2 = HiddenTrouble.username2;
                this.modifierForm.shopptype = HiddenTrouble.shopptype;
                this.modifierForm.level = HiddenTrouble.level;
                this.modifierForm.sonLevel = HiddenTrouble.sonLevel;
                this.modifierForm.externalCause = HiddenTrouble.externalCause;
                this.modifierForm.parentId = HiddenTrouble.parentId;
                this.modifierForm.complaintdate = HiddenTrouble.complaintdate;
                this.modifierForm.username = HiddenTrouble.username;
                this.modifierForm.channel = HiddenTrouble.channel;
                this.modifierForm.tename = HiddenTrouble.tename;
                this.modifierForm.turnover = HiddenTrouble.turnover;
                this.modifierForm.number = HiddenTrouble.number;
                this.modifierForm.industry = HiddenTrouble.industry;
                this.modifierForm.followPersonel = HiddenTrouble.followPersonel;
                this.modifierForm.processingScheme = HiddenTrouble.processingScheme;
                this.modifierForm.followProcess = HiddenTrouble.followProcess;
                this.modifierForm.content = HiddenTrouble.content;

                this.modifierForm.remarks = HiddenTrouble.remarks;
                this.modifierForm.responsibility = HiddenTrouble.responsibility;
                this.modifierForm.frequency = HiddenTrouble.frequency;
                this.modifierForm.department = HiddenTrouble.department;
                this.modifierForm.worktype = HiddenTrouble.worktype;
                this.modifierForm.personnelid = HiddenTrouble.personnelid;
                this.modifierForm.technologyRecruitmentid = HiddenTrouble.technologyRecruitmentid;
                this.modifierForm.tscustomer = HiddenTrouble.tscustomer;
                this.modifierForm.complaintName = HiddenTrouble.complaintName;
                this.modifierForm.pname = HiddenTrouble.pname;
                this.modifierForm.carname = HiddenTrouble.carname;
                this.modifierForm.type = HiddenTrouble.type;
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
        //点击详情确定可以修改客诉信息
        saveEdits() {
            API.responsibilityList.update(this.modifierForm).then(({
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
        }
    }
}
</script>

<style scoped>

</style>
