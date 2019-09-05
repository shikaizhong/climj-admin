<template>
    <div>
        <Row style="margin-top: 15px" type="flex" justify="space-around" class="code-row-bg">
            <Col span="4" push=2>
                <Select @on-change="searchComplaint" v-model="params.TScustomer" placeholder="选择店长" clearable filterable>
                    <Option v-for="teamNameId in personnelIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id">
                    {{teamNameId.username}}
                    </Option>
                </Select>
            </Col>
            <Col span="4" push=1>
                <Select @on-change="searchComplaint" v-model="params.PersonnelID" placeholder="选择签约人" clearable filterable>
                    <Option v-for="teamNameId in personnelIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id">
                    {{teamNameId.username}}
                    </Option>
                </Select>
            </Col>
            <Col span="4" push=1>
                <Input placeholder="选择店长组别"  v-model="params.TeamName"  size="large"  @click="searchComplaint" clearable/>
            </Col>
            <Col span="4">
                <Select placeholder="判责结果:" style="width: 300px;height:35px" v-model="params.result"  @on-change="searchComplaint">
                        <Option value="0">微责</Option>
                        <Option value="1">无责</Option>
                        <Option value="2">待定</Option>
                        <Option value="3">轻责</Option>
                        <Option value="4">中责</Option>
                        <Option value="5">重责</Option>
                    </Select>
            </Col>
        </Row>
        <Row style="margin-top: 15px" type="flex" justify="start" class="code-row-bg">
            <Col span="2">
                <Select placeholder="请选择判责类型:" filterable v-model="params.type">
                        <Option value="0">投诉</Option>
                        <Option value="1">隐患</Option>
                        <Option value="2">退款</Option>
                    </Select>
            </Col>
            <Col span="2" push=1>
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="params.startTime=$event" placeholder="开始时间" style="width: 200px"></DatePicker>
            </Col>
            <Col span="2" push=1>
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="params.endTime=$event" placeholder="结束时间" style="width: 200px"></DatePicker>
            </Col>
            <Col span="4" push=2>
                <Input placeholder="客诉大类别" v-model="params.parentName" @click="searchComplaint"  size="large" clearable/>
            </Col>
            <Col span="4" push=3>
                <Input placeholder="搜索客诉级别" v-model="params.grade"  @click="searchComplaint" size="large" clearable/>
            </Col>
            <Col span="4" push=4>
                 <Input placeholder="搜索店铺名"  size="large" style="width: auto" />
            </Col>
            <Col span="4" push=3>
                 <span ><Button type="primary"  @click="searchComplaint" icon="search">搜索</Button></span>
            </Col>
        </Row>
        <!--table数据-->
         <Row style="margin-top: 25px">
            <Table border ref="selection"
                    :columns="columns1"
                    :current="params.pageNum"
                    @on-selection-change="selectionChange"
                    :data="data1" width=100%>
            </Table>
        </Row>
        <Row>
            <div style="float:right">
                <Page :total="totalCount" :page-size="params.pageSize"
                    loading show-sizer @on-change="pageChange"
                    @on-page-size-change="sizeChange"/>
            </div>
        </Row>
        <!--修改-->
        <Modal v-model="showEditModal"
           @on-ok="saveEdit"
           @on-cancel="cancelEdit"
           width=900
           draggable
           scrollable>
           <h3 slot="header" style="color:#2D8CF0">修改信息</h3>
           <Form :model="showEditForm"  label-position="right" :label-width="100" @submit.native.prevent="saveEditUser">
            <Col span="12">
                <FormItem  label="客户:" prop="wangwangnum" >
                   <input style="width: 300px"  v-model="showEditForm.wangwangnum" disabled/>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="客诉大类别" prop="parentName" >
                    <Select @on-change="selectLevel" v-model="showEditForm.level" placeholder="Select your level" style="width: 300px">
                        <Option v-for="levelId in levels" :label="levelId.parentName" :value="levelId.parentId" :key="levelId.parentId">
                        {{levelId.parentName}}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12">
                 <FormItem label="客诉小类别" prop="complaintName" >
                    <Select v-model="showEditForm.sonLevel" placeholder="Select your pkId" style="width: 300px">
                        <Option v-for="complaintNameId in levelNames" :label="complaintNameId.complaintName"
                                :value="complaintNameId.complaintIds" :key="complaintNameId.complaintIds">
                        {{complaintNameId.complaintName}}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem  label="客诉点总结:" prop="summary" >
                    <Input placeholder="请输入客诉点总结" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px"  v-model="showEditForm.summary"/>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem  label="判定依据说明" prop="basic" >
                    <Input placeholder="请输入判定依据说明" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px"  v-model="showEditForm.basic"/>
                </FormItem>
            </Col>
            <Col span="12">  
                <FormItem  label="判责结果:" prop="result" >
                     <select placeholder="判责结果:" style="width: 300px;height:35px" v-model="showEditForm.result">
                        <option value="0">微责</option>
                        <option value="1">无责</option>
                        <option value="2">待定</option>
                        <option value="3">轻责</option>
                        <option value="4">中责</option>
                        <option value="5">重责</option>
                    </select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="责任人" prop="responsibilityer">
                    <Select v-model="showEditForm.responsibilityer" placeholder="无责任人" style="width: 300px" >
                        <Option v-for="personnelId in personnelIds" :label="personnelId.username" :value="personnelId.id" :key="personnelId.id">
                        {{personnelId.username}}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem  label="客诉级别:" prop="grade" >
                     <select placeholder="客诉级别:" style="width: 300px;height:35px" v-model="showEditForm.grade">
                        <option value="0">一级</option>
                        <option value="1">二级</option>
                        <option value="2">三级</option>
                    </select>
                </FormItem>
            </Col>
            <!-- <Col span="12">
                <FormItem  label="是否退款:" prop="isRefund"  v-model="showEditForm.isRefund">
                    <RadioGroup>
                        <Radio :label="0" >否</Radio>
                        <Radio :label="1" >是</Radio>
                    </RadioGroup>
                </FormItem>
            </Col> -->
            <Col span="12">
                <FormItem  label="签约人:" prop="pname">
                   <input  style="width: 300px" v-model="showEditForm.pname" placeholder="暂无数据" disabled/>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem  label="签约人组别:" prop="pteamname" >
                   <input  style="width: 300px" v-model="showEditForm.pteamname" placeholder="暂无数据" disabled/>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem  label="店长:" prop="tename" >
                   <input  style="width: 300px" v-model="showEditForm.tename"/>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem  label="店长组别:" prop="teamname" >
                   <input  style="width: 300px" v-model="showEditForm.teamname" disabled/>
                </FormItem>
            </Col>
           
            <Col span="12">
                <FormItem  label="处理方案:" prop="deal" >
                    <Input placeholder="请输入处理方案" type="textarea" :autosize="{minRows: 5,maxRows: 5}"  style="width: 300px" v-model="showEditForm.deal"/>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem  label="判责人员:" prop="responsibilityor" >
                   <select placeholder="判责人员:" style="width: 300px;height:35px" v-model="showEditForm.responsibilityor">
                        <option value="187">蔓越莓</option>
                        <option value="277">四叶草</option>
                    </select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="签单日期" prop="serverdeadline">
                    <DatePicker type="datetime" format="yyyy-MM-dd " v-model="showEditForm.serverdeadline" disabled placeholder="Select date and time(Excluding seconds)" style="width: 300px"></DatePicker>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="判责日期" prop="hDate">
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="showEditForm.hDate" placeholder="Select date and time(Excluding seconds)" style="width: 300px"></DatePicker>
                    <!-- <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" @on-change="modifierForm.hiddenDate=$event" placeholder="Select date and time(Excluding seconds)" style="width: 300px"></DatePicker> -->
                </FormItem>
            </Col>
           </Form>
        </Modal>
        <!--判责-->
        <Modal v-model="reViewModal"
           @on-ok="reViewEdit"
           draggable
           scrollable
           @on-cancel="cancelEdit">
            <h3 slot="header" style="color:#2D8CF0">判责</h3>
            <Form :model="showEditForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser">
                    <FormItem label="状态:" prop="result">
                        <RadioGroup  placeholder="判责结果:" v-model="showEditForm.result">
                            <Radio  :label="0">微责</Radio >
                            <Radio  :label="1">无责</Radio >
                            <Radio  :label="2">待定</Radio >
                            <Radio  :label="3">轻责</Radio>
                            <Radio  :label="4">中责</Radio >
                            <Radio  :label="5">重责</Radio >
                        </RadioGroup>
                    </FormItem> 
            </Form>
        </Modal>
        <!--上传判责依据-->
        <Modal v-model="ts"
           @on-ok="uploadFileEdit"
           draggable
           scrollable
           @on-cancel="cancelFileEdit">
           <h3 slot="header" style="color:#2D8CF0">上传文件</h3>
           <template>
              <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :on-format-error="handleFormatError"
                  :multiple="true"
                  action="http://192.168.1.112:9090/mj-admin/sys/complaint/uploads" 
                  style="display: inline-block;width:58px;">
                  <div style="width: 58px;height:58px;line-height: 58px;">
                      <Icon type="ios-camera" size="30"></Icon>
                  </div>
              </Upload>
          </template> 
        </Modal>
        <!--根据判责id查看判责依据-->
        <Modal v-model="showFileModal"
                width="800">
            <h3 slot="header" style="color:#2D8CF0">查看判责依据文件</h3>
            <Table border ref="selection"
                    :columns="columns3"
                    :current="params.pageNum"
                    @on-selection-change="selectionChange"
                    :data="data3"
                    >
            </Table>
        </Modal>
         <!-- 删除判责依据文件 -->
        <Modal v-model="deleteModal"
            width=15
            @on-ok="deletefiles"
            @on-cancel="cancelDeleteFile">
        <h2 style="color:red;text-align: center;font-size: 20px">确定删除改文件么</h2>
        </Modal>
        <!--点击详情-->
       <Modal v-model="detailsModal"
           @on-ok="detailsEdit"
           @on-cancel="detailscancelEdit"
           width="800" v-if="params.type == 0">
            <h3 slot="header" style="color:#2D8CF0">查看投诉详情</h3>
            <Form :model="complaintIds" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser">
                <Col span="12">
                    <FormItem  label="投诉客户" prop="wangwangnum" >
                        <Input v-model="complaintIds.wangwangnum" disabled/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem  label="投诉次数(第几次)" prop="frequency">
                        <Input v-model="complaintIds.frequency" disabled/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="投诉日期" prop="complaintdate">
                        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="complaintIds.complaintdate" placeholder="Select date and time(Excluding seconds)" style="width: 280px" disabled></DatePicker>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="店长" prop="username">
                        <Input v-model="complaintIds.username" disabled/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="投诉渠道" prop="channel">
                        <select v-model="complaintIds.channel" style="width: 280px;height:35px" disabled>
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
                </Col>
                <Col span="12">
                    <FormItem label="所属团队" prop="teamname">
                        <Input v-model="complaintIds.teamname" disabled/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem  label="客户类型" prop="shopptype" >
                        <Input v-model="complaintIds.shopptype" disabled/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem  label="车手:" prop="tename">
                        <Input v-model="complaintIds.tename" disabled placeholder="暂无对应车手"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="判责结果" prop="status" >
                        <select v-model="complaintIds.status" placeholder="选择状态" filterable  style="width: 280px;height:35px" disabled>
                            <option value="0">待审核</option>
                            <option value="1">已审核</option>
                            <option value="2">待审定</option>
                        </select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="招商顾问" prop="username">
                        <Select v-model="complaintIds.personnelid" placeholder="无招商顾问" disabled>
                            <Option v-for="personnelId in personnelIds" :label="personnelId.username" :value="personnelId.id" :key="personnelId.id">
                                {{personnelId.username}}
                            </Option>
                        </Select>
                </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="投诉原因" prop="content">
                        <Input v-model="complaintIds.content" placeholder="请输入投诉内容" type="textarea" :autosize="{minRows: 5,maxRows: 5}" disabled/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem  label="备注" prop="remarks" >
                        <Input v-model="complaintIds.remarks"   placeholder="请输入投诉备注" type="textarea" :autosize="{minRows: 5,maxRows: 5}" disabled/>
                    </FormItem>
                </Col>
            </form>
        </Modal>
        <!--点击查看隐患详情-->
        <Modal v-model="detailsModal" @on-ok="detailsEdit" @on-cancel="detailscancelEdit" width=600  v-if="params.type == 1">
            <h3 slot="header" style="color:#2D8CF0">详情</h3>
            <Form :model="modifierForm" label-position="right" :label-width="100" @submit.native.prevent="saveModifier" inline>
                <div style="width:270px;float:left">
                    <FormItem label="客户名" prop="wangWangNum">
                        <Input disabled v-model="modifierForm.wangWangNum" style="width:150px" />
                    </FormItem>
                    <FormItem label="客户类型">
                        <div>
                            <Input disabled v-model="modifierForm.custtype" style="width:75px" />
                            <Input disabled v-model="modifierForm.childtype" style="width:75px" />
                        </div>
                    </FormItem>
                    <FormItem label="隐患日期" prop="hiddenDate">
                        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="modifierForm.hiddenDate=$event" style="width:150px" />
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
        <!--点击查看退款详情-->
        <Modal v-model="detailsModal" @on-ok="detailsEdit" @on-cancel="detailscancelEdit" width=752  v-if="params.type == 2">
            <h3 slot="header" style="color:#2D8CF0">退款详情</h3>
                <Form :model="refundForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser" inline>
                    <div style="width:210px;float:left">
                        <FormItem label="服务期" prop="deadline">
                            <Input disabled v-model="refundForm.deadline" style="width:120px" />
                        </FormItem>
                        <FormItem label="招商顾问" prop="username2">
                            <Input disabled v-model="refundForm.username2" style="width:120px" />
                        </FormItem>
                        <FormItem label="合同金额" prop="turnovermoney">
                            <Input disabled v-model="refundForm.turnovermoney" style="width:120px" />
                        </FormItem>
                        <FormItem label="退款金额" prop="refundAmount">
                            <Input v-model="refundForm.refundAmount" style="width:120px" />
                        </FormItem>
                    </div>
                    <div style="width:270px;float:left">
                        <FormItem label="退款客户" prop="wangWangNum">
                            <Input disabled v-model="refundForm.wangWangNum" style="width:150px" />
                        </FormItem>

                        <FormItem label="客户类型">
                            <div>
                                <Input disabled v-model="refundForm.custtype" style="width:75px" />
                                <Input disabled v-model="refundForm.childtype" style="width:75px" />
                            </div>
                        </FormItem>

                        <FormItem label="退款渠道" prop="refundChannel">
                            <select v-model="refundForm.refundChannel" style="width: 160px;height:35px">
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
                        <FormItem label="退款时间" prop="refundDate">
                            <i-col span="11">
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="refundForm.refundDate=$event" style="width:160px"></DatePicker>
                            </i-col>
                        </FormItem>
                    </div>
                    <div style="width:240px;float:left">
                        <FormItem label="店铺类型" prop="shopptype">
                            <Input disabled v-model="refundForm.shopptype" style="width:120px" />
                        </FormItem>

                        <FormItem label="店长" prop="username1  ">
                            <Input disabled v-model="refundForm.username1" style="width:120px" />
                        </FormItem>
                        <FormItem label="所属团队" prop="teamname">
                            <Input disabled v-model="refundForm.teamname" style="width:120px" />
                        </FormItem>
                    </div>
                    <div style="width:500px">
                        <FormItem label="退款原因" prop="refundCause">
                            <Input v-model="refundForm.refundCause" style="width:500px" type="textarea" />
                        </FormItem>
                        <FormItem label="备注" prop="remark">
                            <Input v-model="refundForm.remark" style="width:500px" type="textarea" />
                        </FormItem>
                    </div>
                </Form>
        </Modal>
    </div>
</template>
<script>
import API from "../../api";
import Vue from 'vue';
export default {
    name: "responsibilityList",
    data(){
        return{
            params:{
                pageNum: 1,
                pageSize: 10,
                keyword: '',
                type: 0,
                PersonnelID:-1,
                TScustomer:null,
                TeamName:null,
                startTime:'',
                endTime:'',
                result:-1,
                parentName:null,
                grade:null,
            },
            params1:{
                level:0,
            },
             columns1:[
                {
                    title: '客诉类别',
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const color=row.level==1 ? 'green' :(row.level ==2 ? 'red':(row.level ==3 ? 'blue':(row.level ==4 ? 'purple':(row.level == 5 ? 'pink':(row.level == 6 ? 'orange':(row.level == 7 ? 'bronze':(row.level == 8 ? 'green':(row.level == 9 ? 'red':(row.level == 10?'blue':'red')))))))));
                        const text=row.level==1 ? '直通车不专业' :(row.level ==2 ? '作图':(row.level ==3 ? '服务不专业 ':(row.level ==4 ? '服务态度不好':(row.level == 5 ? '店长进度慢':(row.level == 6 ? '店长沟通不好 ':(row.level == 7 ? '服务流量':(row.level == 8 ? '服务转化':(row.level == 9 ?'店铺排名':(row.level == 10 ? '直通车没人管':'其它')))))))));
                        return h('Tag', {
                        props: {
                            color: color
                        }
                        }, text);
                        },
                        align: 'center'
                },
                {
                    title: '客诉小类别',
                    align: 'center',
                    render: (h, params) => {
                            const row = params.row;
                            const color=row.sonLevel==8 ? 'green' :(row.sonLevel ==9 ? 'red':(row.sonLevel ==10 ? 'blue':(row.sonLevel ==11 ? 'purple':(row.sonLevel == 12 ? 'pink':(row.sonLevel == 13 ? 'orange':(row.sonLevel == 14 ? 'bronze':(row.sonLevel == 15 ? 'green':(row.sonLevel == 16 ? 'red':(row.sonLevel == 17 ? 'orange':(row.sonLevel == 18 ? 'bronze':(row.sonLevel == 19 ? 'green':(row.sonLevel == 20 ? 'red':(row.sonLevel == 21 ? 'orange':(row.sonLevel == 22 ? 'bronze':(row.sonLevel == 23 ? 'green':(row.sonLevel == 24 ? 'red':(row.sonLevel == 25 ? 'orange':(row.sonLevel == 26 ? 'bronze':(row.sonLevel == 27 ? 'green':(row.sonLevel == 28 ? 'red':(row.sonLevel == 29 ? 'orange':(row.sonLevel == 30 ? 'bronze':(row.sonLevel == 31 ? 'green':(row.sonLevel == 32 ? 'red':(row.sonLevel == 33 ?'blue':'red')))))))))))))))))))))))));
                            const text=row.sonLevel==8 ? '投产低' :(row.sonLevel ==9 ? '没效果':(row.sonLevel ==10 ? '没人管 ':(row.sonLevel ==11 ? '不专业':(row.sonLevel == 12 ? '进度慢':(row.sonLevel == 13 ? '只会开车 ':(row.sonLevel == 14 ? '只会刷单':(row.sonLevel == 15 ? '方案无实际意义':(row.sonLevel == 16 ?'不主动':(row.sonLevel ==17 ? '不积极 ':(row.sonLevel ==18 ? '不用心':(row.sonLevel == 19 ? '不负责':(row.sonLevel == 20 ? '不回复 ':(row.sonLevel == 21 ? '不告知':(row.sonLevel == 22 ? '做事拖拉':(row.sonLevel == 23 ?'不及时反馈':(row.sonLevel ==24 ? '表达不清晰 ':(row.sonLevel ==25 ? '理解能力差':(row.sonLevel == 26 ? '沟通不愉悦':(row.sonLevel == 27 ? '无流量 ':(row.sonLevel == 28 ? '流量下降':(row.sonLevel == 29 ? '未达预期':(row.sonLevel == 30 ?'无转化':(row.sonLevel ==31 ? '转化下降 ':(row.sonLevel ==32 ? '未达到预期':(row.sonLevel== 33 ?'店铺排名下降':'其它')))))))))))))))))))))))));
                            return h('Tag', {
                            props: {
                                color: color
                            }
                            }, text);
                            },
                            align: 'center'
                },
                {
                    title: '判责类型',
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
                    title: '判责日期',
                    align: 'center',
                    key: 'createTime',
                    sortable: true
                },
                {
                    title: '客户名',
                    align: 'center',
                    key: 'wangwangnum'
                },
                {
                    title: '店铺类型',
                    align: 'center',
                    key: 'shopptype'
                },
                {
                    title: '判责结果',
                    align: 'center',
                    render: (h, params) => {
                    const row = params.row;
                    const color=row.result==0 ? 'green' :(row.result ==1 ? 'red':(row.result ==2 ? 'blue':(row.result == 3 ? 'purple ':(row.result == 4 ? 'pink':'orange'))));
                    const text=row.result==0 ? '微责' :(row.result ==1 ? "无责":(row.result == 2 ? '待定':(row.result == 3 ? '轻责': (row.result == 4 ? '中责':'重责'))));
                    return h('Tag', {
                    props: {
                        color: color
                    }
                    }, text);
                    },
                    align: 'center'
                },
                {
                    title: '判责人',
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const color=row.responsibilityor==187 ? 'green' :(row.responsibilityor ==277 ? 'red':'purple');
                        const text=row.responsibilityor==187 ? '蔓越莓' :(row.responsibilityor ==277 ? "四叶草":'其它');
                        return h('Tag', {
                        props: {
                            color: color
                        }
                        }, text);
                        },
                        align: 'center'
                },
                {
                    title: '投诉渠道',
                    key: 'channel',
                    render: (h, params) => {
                        const row = params.row;
                        const color=row.channel==1 ? 'green' :(row.channel ==2 ? 'red':(row.channel ==3 ? 'blue':(row.channel ==4 ? 'purple':(row.channel == 5 ? 'pink':(row.channel == 6 ? 'orange':(row.channel == 7 ? 'bronze':'rainbow'))))));
                        const text=row.channel==1 ? '招商京东' :(row.channel ==2 ? '招商淘宝':(row.channel ==3 ? '综管部 ':(row.channel ==4 ? '企划部':(row.channel == 5 ? '京东官方投诉':(row.channel == 6 ? '京东差评投诉 ':(row.channel == 7 ? '淘宝官方投诉':'其他'))))));
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
                    align: 'center',
                    fixed: 'right',
                    width: 300,
                    render: (h, params) => {
                         let editBtn = h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                this.showEditModalData(params);
                                }
                            }
                            }, '修改');
                         let detailsBtn = h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: ()=>{
                                this.details(params);
                                }
                            }
                            }, '查看详情');
                            let reViewBtn = h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '8px'
                                },
                                on: {
                                    click: ()=>{
                                    this.reViewEditModalData(params);
                                    }
                                }
                                }, '判责');
                            let lookBtn = h(
                                'Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'

                                    },
                                    style: {
                                        marginRight: '8px'
                                    },
                                    on: {
                                        click: () =>{
                                        this.fileModal(params);
                                        }
                                    }
                                    }, '上传判责依据');
                                    let lookFileBtn = h(
                                        'Button', {
                                        props: {
                                            type: 'success',
                                            size: 'small'

                                        },
                                        style: {
                                            marginRight: '8px'
                                        },
                                        on: {
                                            click: () =>{
                                            this.lookFileModal(params);
                                            }
                                        }

                                        }, '查看依据')
                            return h(
                            'div', [editBtn,detailsBtn,reViewBtn,lookBtn,lookFileBtn]
                            );
                    }
                },
            ],
            columns3:[
                 {
                    title: '文件名',
                    align: 'center',
                    key: 'name'
                 },
                 {
                     title: '文件路径',
                     align: 'center',
                    render:(h,showEditForm)=>{
                        return h('div',[
                        h('a',{
                            attrs:{
                            target:"_blank",
                            href: showEditForm.row.url,
                            },
                        },showEditForm.row.url)
                        ])
                    }
                 },
                 {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        let deleteFileBtn = h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => {
                            this.deleteFileModalData(params);
                            }
                        }
                        }, '删除');
                        return h(
                        'div', [deleteFileBtn]
                        );
                    }
             }
            ],
            data1:[
                // {
                //     levelname: '服务不专业',
                //     complaintname: '只会刷单',
                //     type: '1',
                //     complaintTime: '2019-08-13 15:26:58',
                //     wangwangnum: '麦佳蚕豆',
                //     shopptype: "京东",
                //     result: 2,
                //     responsibilityer: '麦佳蚕豆',
                //     channel: 5,
                // },
            ],
            data3:[
                // {
                //     name:'*********',
                //     url: '***************',
                // },
            ],
            url:null,
            name:null,
            pkIds:0,
            complaintId:0,
            totalCount:0,
            pkId:0,
            showEditModal:false,
            showDeleteModal:false,
            reViewModal:false,
            ts:false,
            showFileModal:false,
            deleteModal:false,
            showAddModal:false,
            detailsModal: false,
            //点击投诉详情
            complaintIds:{
                pkId: '',
                wangwangnum: '',
                complaintdate: '',
                channel: '',
                scenerestoration: '',
                remarks: '',
                frequency: '',
                content: '',
                shopptype: '',
                department: '',
                isStop: '',
                custtype: '',
                worktype: '',
                status: '',
                tscustomer: '',
                parentId: '',
                teamname:'',
                tename:'',
                isDelete: '',
                createTime: '',
                complaintid: '',
                personnelid: '',
                technologyRecruitmentid: '',
                complaintIds: '',
                username:'',
                sceneRestorationName:'',
                url:'',
                name:'',
                complaintId:'',
                hDate:'',
            },
            //点击隐患详情
            modifierForm: {
                pkId: '',
                wangWangNum: '',
                hiddenDate: '',
                hiddenContent: '',
                remark: '',
                frequency: '',
                custtype: '',
                childtype: '',
                shopptype: '',
                username1: '',
                username2: '',
                teamname: '',
                status: '',
                isDelete: '',
                level: '',
                hDate:'',
            },
            //点击投诉详情
            refundForm:{
                pkId: '',
                wangWangNum: '',
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
                hDate:'',
            },
            //客诉大类别
            levels:[],
            //客诉小类别
            levelNames:[],
            //责任人
            personnelIds:[],
            showEditForm:{
                pkId:'',
                level:'',
                sonLevel:'',
                result:'',
                responsibilityer:'',
                grade:'',
                createTime:'',
                responsibilityor:'',
                complaintId:'',
                type:'',
                summary:'',
                basic:'',
                deal:'',
                complaintdate:'',
                channel:'',
                wangwangnum:'',
                parentId:'',
                parentName:'',
                complaintName:'',
                tscustomer:'',
                tename:'',
                teamname:'',
                shopptype:'',
                serverdeadline:'',
                personnelid:'',
                pname:'',
                pteamname:'',
            },
        }
    },
    //生命周期
      mounted(){
        // 初始化
        this.init();
      },
       created:function(){

      },
       methods:{
           init() {
                // 数据初始化
                this.loading = true;
                API.responsibilityList.lists(this.params).then(({data}) => {
                    if (data && data.code == 0) {
                    this.data1 = data.data.list;
                    this.totalCount = data.data.total;
                    this.length=data.data.list.length;
                    } else {
                    this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                });
                 /*遍历用户名*/
                API.complaintList.complaintNames(this.params).then(({data}) => {
                    if (data && data.code == 0) {
                    this.personnelIds =data.data;
                    } else {
                    this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                });
                this.loading = false;
            },
            //搜索
            searchComplaint(){
                  // 数据初始化
                this.loading = true;
                API.responsibilityList.lists(this.params).then(({data}) => {
                    if (data && data.code == 0) {
                    this.data1 = data.data.list;
                    this.totalCount = data.data.total;
                    this.length=data.data.list.length;
                    } else {
                    this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                });
                 /*遍历用户名*/
                API.complaintList.complaintNames(this.params).then(({data}) => {
                    if (data && data.code == 0) {
                    this.personnelIds =data.data;
                    } else {
                    this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                });
                this.loading = false;
            },
           selectionChange(data){
                this.size=data.length
                this.selection = data;
           },
           pageChange(num){
                this.params.pageNum = num;
                this.pageNumber=num;
                this.init();
           },
           sizeChange(size){
                        this.params.pageSize = size;
                        this.init();
           },
           //点击修改
           showEditModalData(params){
            this.showEditModal = true;
            this.params.complaintId = params.row.pkId;
            let complaintId = this.params.complaintId;
            this.showEditForm.complaintId = complaintId;
            console.log(this.showEditForm.complaintId+"添加的id为");
            //大类
            API.complaintList.selectLevel(this.params).then(({data}) => {
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
             if (typeof params.row != 'undefined') {
                 const responsibilityList = params.row;
                 this.showEditForm.pkId = responsibilityList.pkId;
                 this.showEditForm.level = responsibilityList.level;
                 this.showEditForm.sonLevel = responsibilityList.sonLevel;
                 this.showEditForm.result = responsibilityList.result;
                 this.showEditForm.responsibilityer = responsibilityList.responsibilityer;
                 this.showEditForm.grade = responsibilityList.grade;
                 this.showEditForm.createTime = responsibilityList.createTime;
                 this.showEditForm.hDate = responsibilityList.createTime;
                 this.showEditForm.responsibilityor = responsibilityList.responsibilityor;
                 this.showEditForm.summary = responsibilityList.summary;
                 this.showEditForm.basic = responsibilityList.basic;
                 this.showEditForm.complaintdate = responsibilityList.complaintdate;
                 this.showEditForm.channel = responsibilityList.channel;
                 this.showEditForm.wangwangnum = responsibilityList.wangwangnum;
                 this.showEditForm.parentId = responsibilityList.parentId;
                 this.showEditForm.parentName = responsibilityList.parentName;
                 this.showEditForm.complaintName = responsibilityList.complaintName;
                 this.showEditForm.tscustomer = responsibilityList.tscustomer;
                 this.showEditForm.tename = responsibilityList.tename;
                 this.showEditForm.teamname = responsibilityList.teamname;
                 this.showEditForm.shopptype = responsibilityList.shopptype;
                 this.showEditForm.serverdeadline = responsibilityList.serverdeadline;
                 this.showEditForm.personnelid = responsibilityList.personnelid;
                 this.showEditForm.pname = responsibilityList.pname;
                 this.showEditForm.pteamname = responsibilityList.pteamname;
                 this.showEditForm.deal = responsibilityList.deal;
             }
           },
           //确定修改
           saveEdit(){
               let paramss = this.params.type;
               this.showEditForm.type = paramss;
                API.responsibilityList.update(this.showEditForm).then(({data}) => {
                    console.log(this.showEditForm.complaintNam+"修改后的时间");
                    if (data && data.code == 0) {
                    this.init();
                    } else {
                    this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                })
           },
           //取消修改
            cancelEdit(){
            this.showEditModal = false;
            },
            //点击删除
            delete(params){
                this.showDeleteModal = true;
            },
            //确定删除
            saveDelete(){
            },
            //取消删除
            cancelDelete(){
                this.showDeleteModal =false;
            },
            //点击判责
            reViewEditModalData(params){
                this.reViewModal = true;
                this.params.pkId = params.row.complaintId;
                let complaintId = this.params.pkId;
                this.showEditForm.complaintId = complaintId;
                console.log(this.showEditForm.complaintId+"添加的id为");
                if (typeof params.row != 'undefined') {
                    const responsibilityList = params.row;
                    this.showEditForm.result = responsibilityList.result;
              }
            },   
            //确定判责
            reViewEdit(){
                API.responsibilityList.update(this.showEditForm).then(({data}) => {
                    console.log(this.showEditForm.result+"修改后的判责结果");
                    if (data && data.code == 0) {
                    this.init();
                    } else {
                    this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                })
            },         
            //点击上传依据
            fileModal(params){
                this.ts = true;
                this.params.id = params.row.pkId;
                let complaintId = this.params.id;
                this.complaintId = complaintId;
                this.params.pageNumber = 1;
                this.loading = false;
            },
            //确定上传
            uploadFileEdit(){
                this.showEditForm.url = this.url;
                let complaintId = this.complaintId;
                console.log("id为");
                console.log(complaintId);
                let name = this.name;
                this.showEditForm.name =name;
                this.showEditForm.complaintId =complaintId;
                let paramss = this.params.type;
                //投诉上传
                if(paramss == 0){
                        API.complaintList.addFile(this.showEditForm).then(({data}) => {
                        if (data && data.code == 0) {
                        this.init();
                        } else {
                        this.$Message.error(data.msg);
                        }
                    }).catch((data) => {
                        this.$Message.error('连接失败，请检查网络！');
                    })
                    //隐患上传
                }else if(paramss == 1){
                     API.hiddenTroubleList.addFile(this.showEditForm).then(({data}) => {
                        if (data && data.code == 0) {
                            this.init();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    })
                    //退款上传
                }else{
                     API.refundList.addFile(this.showFileForm).then(({data}) => {
                        if (data && data.code == 0) {
                            this.init();
                        } else {
                            this.$Message.error(data.msg);
                        }
                    })
                }   
            },
            //取消上传
            cancelFileEdit(){
                this.ts =false;
            },
            //点击查看上传依据
            lookFileModal(params){
                this.showFileModal = true;
                this.params.complaintId = params.row.pkId;
                this.showEditForm.complaintId = params.row.pkId;
                this.pageNumber =1;
                this.loading = true;
                /*data是接口返回的data*/
                API.complaintList.selectFiles(this.params).then(({data}) => {
                    if (data && data.code == 0) {
                    this.data3 = data.data;
                    this.params.complaintId='';
                    } else {
                    this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                });
                this.loading = false;
            },
            //点击删除指定的判责依据
            deleteFileModalData(params){
                this.deleteModal = true;
                let pkIds=this.pkIds;
                if (typeof params.row != 'undefined') {
                    // pkIds.push(params.row.pkId);
                    this.pkIds = params.row.pkId;
                    let pkIds = this.pkIds;
                    console.log("循环啊");
                    console.log(pkIds);
                }else {
                    this.selection.forEach( v => {
                    pkIds.push(v.pkId)
                    });
                };
            },
            //确定删除判责依据
            deletefiles(){
                 let pkIds=this.pkIds;
                let param = {
                    "pkIds": pkIds
                };
                API.complaintList.deleteFile(param).then(({data}) => {
                    if (data && data.code == 0) {
                         API.complaintList.selectFiles(this.showEditForm).then(({data}) => {
                            if (data && data.code == 0) {
                            this.data3 = data.data;
                            this.params.complaintId='';
                            } else {
                            this.$Message.error(data.msg);
                            }
                        }).catch((data) => {
                            this.$Message.error('连接失败，请检查网络！');
                        })
                    } else {
                    this.$Message.error(data.msg);
                    };
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                });
                
            },
            //取消删除判责依据
            cancelDeleteFile(){
                this.deleteModal = false;
            },
            //点击查看详情
            details(params){
                this.detailsModal = true;
                let paramss = this.params.type;
                console.log(paramss+"type为");  
                //0是投诉
                if(paramss == 0){
                    this.params.pkId = params.row.pkId;
                    console.log(params.row.pkId+"id为")
                    API.responsibilityList.selectById(this.params).then(({data}) => {
                        if (data && data.code == 0) {
                                this.complaintIds =data.data.list[0];
                                this.params.pkId=''
                        } else {
                        this.$Message.error(data.msg);
                        }
                    }).catch((data) => {
                        this.$Message.error('连接失败，请检查网络！');
                    });
                    this.loading = false;
                //1是隐患
                }else if(paramss ==1){
                    this.params.pkId = params.row.pkId;
                    console.log(params.row.pkId+"id为")
                    API.responsibilityList.selectById(this.params).then(({data}) => {
                        if (data && data.code == 0) {
                                this.modifierForm =data.data.list[0];
                                console.log(this.modifierForm+"实体为");    
                                this.params.pkId=''
                        } else {
                        this.$Message.error(data.msg);
                        }
                    }).catch((data) => {
                        this.$Message.error('连接失败，请检查网络！');
                    });
                    this.loading = false;
                //2是退款
                }else{
                    this.params.pkId = params.row.pkId;
                    console.log(params.row.pkId+"id为")
                    API.responsibilityList.selectById(this.params).then(({data}) => {
                        if (data && data.code == 0) {
                                this.refundForm = data.data.list[0];
                                console.log(this.refundForm+"实体为");
                                this.params.pkId=''
                        } else {
                        this.$Message.error(data.msg);
                        }
                    }).catch((data) => {
                        this.$Message.error('连接失败，请检查网络！');
                    });
                    this.loading = false;
                }
            },
            //点击确定按钮
            detailsEdit(){ 
                 this.detailsModal = false;
            },
            //点击取消按钮
            detailscancelEdit(){
                 this.detailsModal = false;
            },
            //点击客诉大类别
            selectLevel(){
            this.params1.parentId=this.showEditForm.level;
            console.log(this.showEditForm.parentId+"获取的父id为");
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
            //上传成功
            handleSuccess(res,file){
                if (res.code == 0) {
                alert("上传中");
                    let scenerestoration = file.response.data;
                    this.url = scenerestoration.url;
                    this.name = scenerestoration.name;
                    let name = this.name;
                    let url =this.url;
                } else {
                    alert("上传失败");
                }
                },
             //上传错误回调
            handleFormatError (file) {
                    this.$Notice.warning({
                        title: 'The file format is incorrect',
                        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                    });
                },
       },
}
</script>
<style scoped>

</style>