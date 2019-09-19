<template>
<div>
    <Row style="margin-top: 15px" type="flex">
        <Col span="4" style="margin-left: 5px">
        <span><Button type="primary" @click="addModal" icon="search">增加</Button></span>
        <span><Button type="error" @click="this.delete" icon="trash-a">批量删除</Button></span>
        </Col>
        <!-- <Col span="3">
          <Select @on-change="searchComplaint" v-model="params.teamId" placeholder="选择团队" style="width: 200px" clearable>
            <Option v-for="teamNameId in teamNameIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id" >
              {{teamNameId.teamname}}
            </Option>
          </Select>
      </col> -->
        <Col span="4">
        <Select @on-change="init" v-model="params.TScustomer" placeholder="选择店长" style="width: 200px" clearable filterable>
            <Option v-for="teamNameId in personnelIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id">
                {{teamNameId.username}}
            </Option>
        </Select>
        </col>
        <!-- <Col span="3">
          <Select @on-change="searchComplaint" v-model="params.technologyRecruitmentid" placeholder="选择车手" style="width: 200px">
            <Option v-for="teamNameId in personnelIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id">
              {{teamNameId.username}}
            </Option>
          </Select>
      </col> -->
        <Col span="4">
        <Select @on-change="init" v-model="params.PersonnelID" placeholder="选择招商顾问" style="width: 200px" clearable filterable>
            <Option v-for="teamNameId in personnelIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id">
                {{teamNameId.username}}
            </Option>
        </Select>
        </col>
        <Col span="4">
        <Select @on-change="init" v-model="params.TechnologyRecruitmentID" placeholder="选择车手" style="width: 200px" clearable filterable>
            <Option v-for="teamNameId in personnelIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id">
                {{teamNameId.username}}
            </Option>
        </Select>
        </col>
        <Col span="4" style="margin-left: 0px">
        <!-- 状态选择 -->
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
        <Col span="3">
        <Date-picker type="datetimerange" v-model="params.dateTime" format="yyyy-MM-dd HH:mm" @on-change="init" placeholder="选择日期和时间" style="width: 250px"></Date-picker>
        </Col>
    </Row>
    <Row style="margin-top:5px">
        <Col span="4" push=4>
        <Input v-model="params.frequency" placeholder="搜索投诉次数" :clearable="isClearAble" style="width:200px" @on-change="init" />
        </Col>
        <Col span="4" push=4>
        <Input v-model="params.TeamName" placeholder="搜索团队名" :clearable="isClearAble" style="width:200px" @on-change="init" />
        </Col>
        <Col span="4" push=4>
        <i-select v-model="params.channel" style="width: 200px" placeholder="请选择投诉渠道" @on-change="init" clearable filterable>
            <Option value="1">招商京东</Option>
            <Option value="2">招商淘宝</Option>
            <Option value="3">综管部</Option>
            <Option value="4">企划部</Option>
            <Option value="5">京东官方投诉</Option>
            <Option value="6">京东差评投诉</Option>
            <Option value="7">淘宝官方投诉</Option>
            <Option value="8">其他</Option>
        </i-select>
        </Col>
        <Col span="4" push=4>
        <Input v-model="params.keyword" style="width: 200px" placeholder="搜索客户名，投诉时间" :clearable="isClearAble" />
        </Col>
        <Col span="1" push=4>
        <span><Button type="primary" @click="init" icon="search">搜索</Button></span>
        </Col>
    </Row>
    <Row style="margin-top: 25px">
        <Table border ref="selection" :columns="columns1" :current="params.pageNum" @on-selection-change="selectionChange" :data="historyDatas" width=100%>
        </Table>
    </Row>
    <Row>
        <Col />
        <Button @click="handleSelectAll(true)">全选</Button>
        <Button @click="handleSelectAll(false)">取消全选</Button>
    </Row>

    <Row>
        <div style="float:right">
            <Page :total="totalCount" :page-size="pageSize" loading @on-change="pageChange" />
        </div>
    </Row>
    <!-- 添加 -->
    <Modal v-model="showAddModal" @on-ok="save" @on-cancel="cancel" width="850">
        <h3 slot="header" style="color:#2D8CF0">增加信息</h3>
        <Form :model="showAddForm" ref="form1" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser" :rules="addForm">
            <Row>
                <Col span="12">
                <FormItem label="投诉客户" prop="wangwangnum">
                    <Input @on-blur="yanzheng" v-model="showAddForm.wangwangnum" placeholder="请输入投诉客户" style="width: 300px" />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="投诉渠道" prop="channel">
                    <Select v-model="showAddForm.channel" style="width: 300px" placeholder="请选择投诉渠道" clearable>
                        <Option value="1">招商京东</Option>
                        <Option value="2">招商淘宝</Option>
                        <Option value="3">综管部</Option>
                        <Option value="4">企划部</Option>
                        <Option value="5">京东官方投诉</Option>
                        <Option value="6">京东差评投诉</Option>
                        <Option value="7">淘宝官方投诉</Option>
                        <Option value="8">其他</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="店铺近30天成交额" prop="turnover">
                    <Input v-model="showAddForm.turnover" placeholder="店铺近30天成交额" style="width: 300px" />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="店铺近30天成交笔数" prop="number">
                    <Input v-model="showAddForm.number" placeholder="店铺近30天成交笔数" style="width: 300px" />
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="店铺行业" prop="industry">
                    <Select v-model="showEditForm.industry" style="width: 300px" placeholder="请选择投诉渠道" clearable>
                        <Option value="1">3c数码配件</Option>
                        <Option value="2">MP3/MP4/ipod/录音笔</Option>
                        <Option value="3">ZIPPO/瑞士军刀/眼镜</Option>
                        <Option value="4">办公设备/耗材/相关服务</Option>
                        <Option value="5">保健品/膳食营养补充食品</Option>
                        <Option value="6">本地优化生活服务</Option>
                        <Option value="7">笔记本电脑</Option>
                        <Option value="8">彩妆/香水/美妆工具</Option>
                        <Option value="9">餐饮具</Option>
                        <Option value="10">餐饮美食</Option>
                        <Option value="11">茶/咖啡/冲印</Option>
                        <Option value="12">超市卡/商场购物卡</Option>
                        <Option value="13">成人用品/避孕/计生用品</Option>
                        <Option value="14">宠物/宠物食品及用品</Option>
                        <Option value="15">厨房/烹饪用具</Option>
                        <Option value="16">厨房电器</Option>
                        <Option value="17">传统滋补营养品</Option>
                        <Option value="18">床上用品</Option>
                        <Option value="19">大家电</Option>
                        <Option value="20">电脑硬件/显示器/电脑周边</Option>
                        <Option value="21">电玩/配件/游戏/攻略</Option>
                        <Option value="22">电影/演出/体育赛事</Option>
                        <Option value="23">电子/电工</Option>
                        <Option value="24">电子词典/电纸书/文化用品</Option>
                        <Option value="25">度假旅游/签证送关/旅游服务</Option>
                        <Option value="26">服饰配件/皮带/帽子/围巾</Option>
                        <Option value="27">服务市场</Option>
                        <Option value="28">个人护理/保健/按摩器材</Option>
                        <Option value="29">个性定制/设计服务/DIY</Option>
                        <Option value="30">购物提货券/蛋糕面包</Option>
                        <Option value="31">古董/邮币/字画/收藏</Option>
                        <Option value="32">国货精品数码</Option>
                        <Option value="33">国内机票/国际机票/增值服务</Option>
                        <Option value="34">户外/登山/野营/旅行用品</Option>
                        <Option value="35">基础建材</Option>
                        <Option value="36">家居饰品</Option>
                        <Option value="37">家庭/个人清洁用具</Option>
                        <Option value="0">其他</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="跟进人员" prop="followPersonel">
                    <Select v-model="showAddForm.followPersonel" placeholder="无责任人" style="width: 300px" clearable>
                        <Option v-for="personnelId in personnelIds" :label="personnelId.username" :value="personnelId.id" :key="personnelId.id">
                            {{personnelId.username}}
                        </Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="处理方案" prop="processingScheme">
                    <Input v-model="showAddForm.processingScheme" placeholder="处理方案" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px" />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="跟进过程" prop="followProcess">
                    <Input v-model="showAddForm.followProcess" placeholder="跟进过程" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px" />
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="投诉内容" prop="content">
                    <Input v-model="showAddForm.content" placeholder="请输入投诉内容" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px" />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="备注" prop="remark">
                    <Input v-model="showAddForm.remark" placeholder="备注" style="width: 300px" type="textarea" :autosize="{minRows: 5,maxRows: 5}" />
                </FormItem>
                </Col>
            </Row>
            <Row>
                <FormItem label="投诉日期" prop="hDate">
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="showAddForm.hDate" placeholder="Select date and time(Excluding seconds)" style="width: 300px"></DatePicker>
                </FormItem>
                <!-- <FormItem label="场景还原" prop="scenerestoration"> -->
                <!-- 远程上传 -->
                <!-- <Upload
                ref="upload" name="file"
                action="http://192.168.1.251:9090/mj-admin/sys/complaint/uploads"
                :on-success="handleSuccess"
                :on-format-error="handleFormatError">
              <i-button type="primary" icon="ios-cloud-upload-outline">上传文件</i-button>
          </Upload> -->
                <!-- 本地上传 -->
                <!-- <Upload
                multiple
                ref="upload" name="file"
                action="http://localhost:8090/sys/complaint/uploads"
                :on-success="handleSuccess"
                :on-format-error="handleFormatError"> -->
                <!-- :before-upload="handleUpload" -->
                <!-- <i-button type="primary" icon="ios-cloud-upload-outline" @click="toAdd">上传文件</i-button>
          </Upload> -->

                <!-- <template>
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
              <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :on-format-error="handleFormatError"
                  :before-upload="handleBeforeUpload"
                  :multiple="true"
                  action="http://localhost:8090/sys/complaint/uploads"
                  style="display: inline-block;width:58px;">
                  <div style="width: 58px;height:58px;line-height: 58px;">
                      <Icon type="ios-camera" size="30"></Icon>
                  </div>
              </Upload>
          </template>
       </FormItem> -->
            </Row>
            <FormItem>
                <!-- <Button @click="handleReset('showAddForm')">重置</Button> -->
                <Button @click="reset">重置</Button>
            </FormItem>
        </Form>
    </Modal>
    <!--上传文件-->
    <!-- <Modal v-model="ts"
           @on-ok="uploadFileEdit"
           @on-cancel="cancelFileEdit"
           draggable
           scrollable>
      <h3 slot="header" style="color:#2D8CF0">上传文件</h3>
          <template>
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
              <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :on-format-error="handleFormatError"
                  :before-upload="handleBeforeUpload"
                  :multiple="true"
                  action="http://192.168.1.112:9090/mj-admin/sys/complaint/uploads"
                  style="display: inline-block;width:58px;">
                  <div style="width: 58px;height:58px;line-height: 58px;">
                      <Icon type="ios-camera" size="30"></Icon>
                  </div>
              </Upload>
          </template> 
     </Modal> -->
    <Modal v-model="showModal" @on-ok="saveFileTable" @on-visible-change="resetData" @on-cancel="cancelFileTable" width="800">
        <h3 slot="header" style="color:#2D8CF0">历史记录</h3>
        <Table border ref="selection" :columns="columns2" :current="params.pageNum" @on-selection-change="selectionChange" :data="data2">
        </Table>
    </Modal>
    <!--根据判责id查看文件-->
    <Modal v-model="showFileModal" @on-ok="saveTable" @on-visible-change="resetData" @on-cancel="cancelTable" width="800">
        <h3 slot="header" style="color:#2D8CF0">历史记录</h3>
        <Upload ref="upload" :show-upload-list="false" :on-success="handleSuccess" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" :multiple="true" action="http://192.168.1.112:9090/mj-admin/sys/complaint/uploads" style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="30"></Icon>
            </div>
        </Upload>
        <Table border ref="selection" :columns="columns3" :current="params.pageNum" @on-selection-change="selectionChange" :data="data3">
        </Table>
    </Modal>

    <Modal v-model="reViewModal" @on-ok="saveEdit" @on-cancel="cancelEdit">
        <h3 slot="header" style="color:#2D8CF0">审核</h3>
        <Form :model="showEditForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser">
            <FormItem label="状态" prop="status">
                <RadioGroup v-model="showEditForm.status">
                    <Radio :label="0">待审核</Radio>
                    <Radio :label="1">已审核</Radio>
                    <Radio :label="2">待审定</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
    </Modal>
    <!-- 点击查看 -->
    <Modal v-model="showEditModalAll" @on-ok="saveEdits" @on-cancel="cancelEdit" width=650>
        <h3 slot="header" style="color:#2D8CF0">详情</h3>
        <Form :model="showEditForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser" inline>
            <FormItem label="客户名" prop="wangwangnum" v-if="showEditForm.wangwangnum != null">
                <Input disabled v-model="showEditForm.wangwangnum" style="width:180px" />
            </FormItem>
            <FormItem label="次数" prop="frequency" v-if="showEditForm.frequency != null">
                <Input disabled v-model="showEditForm.frequency" style="width:180px" />
            </FormItem>
            <FormItem label="客户类型" v-if="showEditForm.custtype != null">
                <div style="width:180px">
                    <Input disabled v-model="showEditForm.custtype" style="width:80px" />
                    <Input disabled v-model="showEditForm.childtype" style="width:80px" />
                </div>
            </FormItem>
            <FormItem label="服务期" prop="deadline" v-if="showEditForm.deadline != null">
                <Input disabled v-model="showEditForm.deadline" style="width:180px" />
            </FormItem>
            <FormItem label="招商顾问" prop="pname" v-if="showEditForm.pname != null">
                <Input disabled v-model="showEditForm.pname" style="width:180px" />
            </FormItem>
            <FormItem label="合同金额" prop="turnovermoney" v-if="showEditForm.turnovermoney != null">
                <Input disabled v-model="showEditForm.turnovermoney" style="width:180px" />
            </FormItem>
            <FormItem label="退款金额" prop="refundAmount" v-if="showEditForm.refundAmount != null">
                <Input disabled v-model="showEditForm.refundAmount" style="width:180px" />
            </FormItem>
            <FormItem label="退款渠道" prop="refundChannel" v-if="showEditForm.refundChannel != null">
                <select v-model="showEditForm.refundChannel" disabled style="width:180px;height:30px">
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
            <FormItem label="时间" prop="createTime" v-if="showEditForm.createTime != null">
                <i-col span="11">
                    <DatePicker type="datetime" readonly disabled format="yyyy-MM-dd HH:mm" v-model="showEditForm.createTime" style="width:180px"></DatePicker>
                </i-col>
            </FormItem>
            <FormItem label="店铺类型" prop="shopptype" v-if="showEditForm.shopptype != null">
                <Input disabled v-model="showEditForm.shopptype" style="width:180px" />
            </FormItem>
            <FormItem label="店长" prop="tename" v-if="showEditForm.tename != null">
                <Input disabled v-model="showEditForm.tename" style="width:180px" />
            </FormItem>
            <FormItem label="店长所属团队" prop="teamname" v-if="showEditForm.teamname != null">
                <Input disabled v-model="showEditForm.teamname" style="width:180px" />
            </FormItem>

            <!-- 投诉管理 -->
            <FormItem label="投诉渠道" prop="channel" v-if="showEditForm.channel != null">
                <select v-model="showEditForm.channel" disabled style="width:180px;height:30px" clearable>
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
            <FormItem label="近30天成交额" prop="turnover" v-if="showEditForm.turnover != null">
                <Input v-model="showEditForm.turnover" disabled placeholder="店铺近30天成交额" style="width:180px" />
            </FormItem>
            <FormItem label="近30天成交笔数" prop="number" v-if="showEditForm.number != null">
                <Input v-model="showEditForm.number" disabled placeholder="店铺近30天成交笔数" style="width:180px" />
            </FormItem>
            <FormItem label="判责结果" prop="result" v-if="showEditForm.result != null">
                <select v-model="showEditForm.result" disabled placeholder="暂未判责" filterable style="width:180px;height:30px" clearable>
                    <option value="0">微责</option>
                    <option value="1">无责</option>
                    <option value="2">重责</option>
                    <option value="3">轻责</option>
                    <option value="4">中责</option>
                    <option value="5">待定</option>
                </select>
            </FormItem>
            <FormItem label="店铺行业" prop="industry" v-if="showEditForm.industry != null">
                <select v-model="showEditForm.industry" disabled placeholder="请选择投诉渠道" clearable filterable style="width:180px;height:30px" clearable>
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
            <FormItem label="跟进人员" prop="followPersonel" v-if="showEditForm.followPersonel != null">
                <select v-model="showEditForm.followPersonel" placeholder="无责任人" style="width: 180px;height:30px" disabled>
                    <option v-for="personnelId in personnelIds" :label="personnelId.username" :value="personnelId.id" :key="personnelId.id">
                        {{personnelId.username}}
                    </option>
                </select>
            </FormItem>
            <FormItem label="处理方案" prop="processingScheme" v-if="showEditForm.processingScheme != null">
                <Input v-model="showEditForm.processingScheme" disabled placeholder="处理方案" type="textarea" style="width:180px" />
            </FormItem>
            <FormItem label="跟进过程" prop="followProcess" v-if="showEditForm.followProcess != null">
                <Input v-model="showEditForm.followProcess" disabled placeholder="跟进过程" type="textarea" style="width:180px" />
            </FormItem>
            <FormItem label="招商顾问" prop="username" v-if="showEditForm.personnelid != null">
                <Select v-model="showEditForm.personnelid" disabled placeholder="无招商顾问" style="width:180px">
                    <Option v-for="personnelId in personnelIds" :label="personnelId.username" :value="personnelId.id" :key="personnelId.id">
                        {{personnelId.username}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="客诉大类别" prop="parentName" v-if="showEditForm.level != null">
                <Select @on-change="selectLevel" v-model="showEditForm.level" disabled placeholder="Select your level" style="width:180px">
                    <Option v-for="levelId in levels" :label="levelId.parentName" :value="levelId.parentId" :key="levelId.parentId">
                        {{levelId.parentName}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="客诉小类别" prop="complaintName" v-if="showEditForm.level != null">
                <select v-model="showEditForm.sonLevel" disabled placeholder="Select your pkId" style="width:180px;height:30px">
                    <option v-for="complaintNameId in levelNames" :label="complaintNameId.complaintName" :value="complaintNameId.complaintIds" :key="complaintNameId.complaintIds">
                        {{complaintNameId.complaintName}}
                    </option>
                </select>
            </FormItem>
            <FormItem label="原因" prop="content" v-if="showEditForm.content != null">
                <Input v-model="showEditForm.content" disabled placeholder="请输入投诉内容" type="textarea" style="width:400px" />
            </FormItem>
            <FormItem label="原因" prop="refundCause" v-if="showEditForm.refundCause != null">
                <Input disabled v-model="showEditForm.refundCause" type="textarea" style="width:400px" />
            </FormItem>
            <FormItem label="备注" prop="remark" v-if="showEditForm.remark != null">
                <Input disabled v-model="showEditForm.remark" type="textarea" style="width:400px" />
            </FormItem>
            <FormItem label="外因" prop="externalCause" v-if="showEditForm.externalCause != null">
                <Input v-model="showEditForm.externalCause" type="textarea" style="width:400px" />
            </FormItem>
        </Form>
    </Modal>
    <!-- 点击修改 -->
    <Modal v-model="showEditModal" @on-ok="saveEdit" @on-cancel="cancelEdit" width="800">
        <h3 slot="header" style="color:#2D8CF0">修改信息</h3>
        <Form :model="showEditForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser">
            <Row>
                <Col span="12">
                <FormItem label="投诉客户" prop="wangwangnum">
                    <Input v-model="showEditForm.wangwangnum" disabled />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="投诉次数(第几次)" prop="frequency">
                    <Input v-model="showEditForm.frequency" disabled />
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="投诉日期" prop="hDate">
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="showEditForm.hDate" placeholder="Select date and time(Excluding seconds)" style="width: 280px"></DatePicker>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="店长" prop="username">
                    <Input v-model="showEditForm.username" disabled />
                    <!-- <Select v-model="showEditForm.tscustomer" placeholder="无店长">
              <Option v-for="tscustomerId in personnelIds" :label="tscustomerId.username" :value="tscustomerId.id" :key="tscustomerId.id">
                {{tscustomerId.username}}
              </Option>
            </Select> -->
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="投诉渠道" prop="channel">
                    <select v-model="showEditForm.channel" style="width: 280px;height:30px" disabled>
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
                    <Input v-model="showEditForm.teamname" disabled />

                    <!-- <Select v-model="showEditForm.tscustomer" placeholder="无团队">
              <Option v-for="teamNameId in teamNameIds" :label="teamNameId.teamname" :value="teamNameId.id" :key="teamNameId.id">
                {{teamNameId.teamname}}
              </Option>
            </Select> -->
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="客户类型" prop="shopptype">
                    <Input v-model="showEditForm.shopptype" disabled />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="车手:" prop="tename">
                    <Input v-model="showEditForm.tename" disabled placeholder="暂无对应车手" />
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="招商顾问" prop="username">
                    <Select v-model="showEditForm.personnelid" placeholder="无招商顾问" disabled>
                        <Option v-for="personnelId in personnelIds" :label="personnelId.username" :value="personnelId.id" :key="personnelId.id">
                            {{personnelId.username}}
                        </Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="跟进人员" prop="followPersonel">
                    <Select v-model="showEditForm.followPersonel" placeholder="无责任人" style="width: 300px" disabled>
                        <Option v-for="personnelId in personnelIds" :label="personnelId.username" :value="personnelId.id" :key="personnelId.id">
                            {{personnelId.username}}
                        </Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <!-- <Col span="12">
         <FormItem label="车手" prop="username">
          <Select v-model="showEditForm.technologyRecruitmentid" placeholder="无车手">
            <Option v-for="technologyRecruitmentId in personnelIds" :label="technologyRecruitmentId.username" :value="technologyRecruitmentId.id" :key="technologyRecruitmentId.id">
              {{technologyRecruitmentId.username}}
            </Option>
          </Select>
        </FormItem>
         </Col> -->
                <Col span="12">
                <FormItem label="近30天成交额" prop="turnover">
                    <Input v-model="showEditForm.turnover" placeholder="店铺近30天成交额" style="width: 300px" :clearable="isClearAble" />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="近30天成交笔数" prop="number">
                    <Input v-model="showEditForm.number" placeholder="店铺近30天成交笔数" style="width: 300px" :clearable="isClearAble" />
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="处理方案" prop="processingScheme">
                    <Input v-model="showEditForm.processingScheme" placeholder="处理方案" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px" :clearable="isClearAble" />
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="跟进过程" prop="followProcess">
                    <Input v-model="showEditForm.followProcess" placeholder="跟进过程" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px" :clearable="isClearAble" />
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="判责结果" prop="result" v-if="showEditForm.result != null">
                    <select v-model="showEditForm.result" disabled placeholder="暂未判责" filterable style="width:180px;height:30px">
                        <option value="0">微责</option>
                        <option value="1">无责</option>
                        <option value="2">重责</option>
                        <option value="3">轻责</option>
                        <option value="4">中责</option>
                        <option value="5">待定</option>
                    </select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="店铺行业" prop="industry">
                    <select v-model="showEditForm.industry" style="width: 280px;height:30px" placeholder="请选择投诉渠道" clearable filterable>
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
                </Col>
            </Row>
            <Row>
                <Col span="12">
                </Col>
            </Row>
            <Row>
                <FormItem label="投诉原因" prop="content">
                    <Input v-model="showEditForm.content" placeholder="请输入投诉内容" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :clearable="isClearAble" />
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="showEditForm.remark" placeholder="请输入投诉备注" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :clearable="isClearAble" />
                </FormItem>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="客诉大类别" prop="parentName">
                    <Select @on-change="selectLevel" v-model="showEditForm.level" placeholder="Select your level" style="width: 180px" clearable>
                        <Option v-for="levelId in levels" :label="levelId.parentName" :value="levelId.parentId" :key="levelId.parentId">
                            {{levelId.parentName}}
                        </Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="客诉小类别" prop="complaintName">
                    <select v-model="showEditForm.sonLevel" placeholder="Select your pkId" style="width: 180px;height:30px" clearable>
                        <option v-for="complaintNameId in levelNames" :label="complaintNameId.complaintName" :value="complaintNameId.complaintIds" :key="complaintNameId.complaintIds">
                            {{complaintNameId.complaintName}}
                        </option>
                    </select>
                </FormItem>
                </Col>
            </Row>
            <!-- <FormItem label="场景还原地址" prop="scenerestoration">
        <ul style="list-style:none">
            <li v-for="(item,index) in url" class="forteItem" :key="index"> -->
            <!-- <a :href="showEditForm.scenerestoration" target="_Blank">{{showEditForm.scenerestoration}}</a> -->
            <!-- <a :href="item" target="_Blank">{{item}}</a>
                <i-button type="primary" @click="deleteFile(item)">删除</i-button>
            </li>
          </ul> -->
            <!-- <Input v-model="showEditForm.scenerestoration"  :clearable="isClearAble" :autofocus="true"/> -->
            <!-- </FormItem> -->
            <!-- <Col span="12">
        <FormItem label="场景还原文件名" prop="sceneRestorationName">
        <Input v-model="showEditForm.sceneRestorationName" disabled/>
        </FormItem>
        </Col> -->
            <!-- <FormItem label="场景还原文件" prop="scenerestoration"> -->
            <!-- 远程上传 -->
            <!-- <Upload
                ref="upload" name="file"
                action="http://192.168.1.251:9090/mj-admin/sys/complaint/uploads"
                :on-success="handleSuccess"
                :on-format-error="handleFormatError">
              <i-button type="primary" icon="ios-cloud-upload-outline">上传文件</i-button>
          </Upload> -->
            <!-- 本地上传 -->
            <!-- <Upload
                multiple
                ref="upload" name="file"
                action="http://localhost:8090/sys/complaint/uploads"
                :on-success="handleSuccess"
                :on-format-error="handleFormatError">
              <i-button type="primary" icon="ios-cloud-upload-outline">上传文件</i-button>
          </Upload>
       </FormItem> -->
            <!-- <FormItem label="客诉大类别" prop="levelName">
          <Select @on-change="selectLevel" v-model="showEditForm.level" placeholder="Select your level">
            <Option v-for="levelId in levels" :label="levelId.levelName" :value="levelId.level" :key="levelId.level">
              {{levelId.levelName}}
            </Option>
          </Select>
        </FormItem> -->

            <!-- <FormItem label="客诉小类别" prop="complaintName">
          <Select v-model="showEditForm.complaintIds" placeholder="Select your pkId">
            <Option v-for="complaintNameId in levelNames" :label="complaintNameId.complaintName"
                    :value="complaintNameId.complaintIds" :key="complaintNameId.complaintIds">
              {{complaintNameId.complaintName}}
            </option>
          </Select>
        </FormItem>

        <FormItem label="判责结果" prop="result">
          <RadioGroup v-model="showEditForm.result">
            <Radio :label="0" >无责</Radio>
            <Radio :label="1" >有责</Radio>
            <Radio :label="2" >待定</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="判责结果" prop="status">
          <RadioGroup v-model="showEditForm.status">
            <Radio :label="0" >待审核</Radio>
            <Radio :label="1" >已审核</Radio>
            <Radio :label="2" >待审定</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="责任轻重" prop="responsibility">
          <RadioGroup v-model="showEditForm.responsibility">
            <Radio :label="0" >微责</Radio>
            <Radio :label="1" >轻责</Radio>
            <Radio :label="2" >中责</Radio>
            <Radio :label="3" >重责</Radio>
          </RadioGroup>
        </FormItem> -->

            <!-- <FormItem label="责任人id" prop="complaintId">
          <Select v-model="showEditForm.complaintid" placeholder="Select your level">
            <Option v-for="complaintId in complaintids" :label="complaintId.username" :value="complaintId.id" :key="complaintId.id">
              {{complaintId.username}}
            </Option>
          </Select>
        </FormItem> -->
        </Form>
    </Modal>

    <Modal v-model="showDeleteModal" @on-ok="saveDelete" @on-cancel="cancelDelete">
        <!--<h3 slot="header" style="color:red">确定删除吗</h3>-->
        <h2 style="color:red;text-align: center;font-size: 20px">确定删除吗</h2>
    </Modal>
    <!-- 删除文件 -->
    <Modal v-model="deleteModal" @on-ok="deletefiles" @on-cancel="cancelDeleteFile">
        <!--<h3 slot="header" style="color:red">确定删除吗</h3>-->
        <h2 style="color:red;text-align: center;font-size: 20px">确定删除改文件么</h2>
    </Modal>
    <!--添加提示-->
    <Modal v-model="confirmModal" @on-ok="confirmAdd" @on-cancel="confirmCancel">
        <h2 style="color:red;text-align: center;font-size: 20px">请核实是否添加数据完毕</h2>
    </Modal>
</div>
</template>

<script>
import API from "../../api";
import Vue from 'vue';
export default {
    name: "Complaint",
    data() {
        return {
            params: {
                keyword: '',
                result: -1,
                dateTime: '',
                TScustomer: null,
                TechnologyRecruitmentID: -1,
                PersonnelID: -1,
                channel: -1,
                frequency: '',
                TeamID: -1,
                TeamName: null
            },
            params1: {
                level: 0,
                parentId: 0,
            },
            showEditModal: false,
            showEditModalAll: false,
            reViewModal: false,
            showAddModal: false,
            //确定添加
            confirmModal: false,
            ajaxHistoryDatas: [],
            historyDatas: [],
            totalCount: 0,
            pageSize: 10,
            tscustomer: [],
            complaintids: [],
            teamNameIds: [],
            tscustomerIds: [],
            personnelIds: [],
            url: null,
            name: null,
            complaintId: 0,
            item: [1],
            uploadData: null,
            technologyRecruitmentIds: [],
            pageNumber: [], //表格页数
            length: [], //表格每页长度
            size: [], //批量删除时候选中的个数
            showModal: false,
            showFileModal: false,
            ts: false,
            showAddForm: {
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
            },
            showEditForm: {
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
            },
            //表单验证(如果为空就会提示)
            addForm: {
                wangwangnum: [{
                    required: true,
                    message: '请输入投诉客户',
                    trigger: 'blur'
                }],
                channel: [{
                    required: true,
                    message: '请选择投诉渠道',
                    trigger: 'blur'
                }],
                content: [{
                    required: true,
                    message: '请输入投诉内容',
                    trigger: 'blur'
                }]
            },
            loading: false,
            showDeleteModal: false,
            deleteModal: false,
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
                    title: '30天成交额',
                    align: 'center',
                    key: 'number'
                },
                {
                    title: '30天成交笔数',
                    align: 'center',
                    key: 'industry'
                },
                {
                    title: '店铺类型',
                    align: 'center',
                    key: 'shopptype'
                },
                {
                    title: '投诉次数(第几次)',
                    align: 'center',
                    key: 'frequency'
                },

                {
                    title: '投诉渠道',
                    key: 'channel',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.channel == 1 ? 'green' : (row.channel == 2 ? 'green' : (row.channel == 3 ? 'green' : (row.channel == 4 ? 'green' : (row.channel == 5 ? 'green' : (row.channel == 6 ? 'green' : (row.channel == 7 ? 'green' : 'green'))))));
                        const text = row.channel == 1 ? '招商京东' : (row.channel == 2 ? '招商淘宝' : (row.channel == 3 ? '综管部 ' : (row.channel == 4 ? '企划部' : (row.channel == 5 ? '京东官方投诉' : (row.channel == 6 ? '京东差评投诉 ' : (row.channel == 7 ? '淘宝官方投诉' : '其他'))))));

                        return h('Tag', {
                            props: {
                                color: color
                            }
                        }, text);
                    },
                    align: 'center'
                },

                {
                    title: '店长',
                    align: 'center',
                    key: 'username'
                    // key:'tscustomer'
                },
                {
                    title: '客诉内容',
                    align: 'center',
                    key: 'content',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                domProps: {
                                    title: params.row.content
                                }
                            }, params.row.content)
                        ])
                    }

                },
                {
                    title: '投诉日期',
                    align: 'center',
                    key: 'complaintdate',
                    sortable: true
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
                        let reViewBtn = h('Button', {
                            props: {
                                type: 'warning',
                                size: 'small'
                            },
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.reViewEditModalData(params);
                                }
                            }
                        }, '审核');
                        let deleteBtn = h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '8px'
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
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.lookModal(params);
                                }
                            }

                        }, '历史记录');
                        let lookBtn = h(
                            'Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'

                                },
                                style: {
                                    marginRight: '8px'
                                },
                                on: {
                                    click: () => {
                                        this.fileModal(params);
                                    }
                                }

                            }, '上传文件');
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
                                    click: () => {
                                        this.lookFileModal(params);
                                    }
                                }

                            }, '附件')
                        return h(
                            'div', [editBtn, deleteBtn, showBtn, lookFileBtn]
                        );
                    }
                }
            ],
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
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.result == 0 ? 'green' : (row.result == 1 ? 'red' : (row.result == 2 ? 'blue' : (row.result == 3 ? 'purple ' : (row.result == 4 ? 'pink' : 'orange'))));
                        const text = row.result == 0 ? '微责' : (row.result == 1 ? "无责" : (row.result == 2 ? '重责' : (row.result == 3 ? '轻责' : (row.result == 4 ? '中责' : '待定'))));
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
                    align: 'center',
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
                                    this.showData(params);
                                }
                            }
                        }, '查看');
                        return h(
                            'div', [editBtn]
                        );
                    }
                }
            ],
            columns3: [{
                    title: '文件名',
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '文件路径',
                    align: 'center',
                    render: (h, showEditForm) => {
                        return h('div', [
                            h('a', {
                                attrs: {
                                    target: "_blank",
                                    href: showEditForm.row.url,
                                },
                            }, showEditForm.row.url)
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
            isClearAble: true,
            isDisabled: true,
            loadingStatus: false,
            levels: [],
            levelNames: [],
            data1: [],
            data2: [],
            data3: [],
            pkIds: 0,
            urlId: [],
        }
    },
    //生命周期
    mounted() {
        // 初始化
        this.init();
        //  this.second();
    },
    created: function () {

    },
    methods: {
        reset() {
            this.$refs.form1.resetFields();
        },
        handleSelectAll(status) {
            this.$refs.selection.selectAll(status);
        },
        init() {
            // 数据初始化
            this.loading = true;
            API.complaintList.lists(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data1 = data.data.list;
                    this.totalCount = data.data.total;
                    this.length = data.data.list.length;
                    this.ajaxHistoryDatas = data.data.list;
                    this.totalCount = data.data.total;
                    if (this.ajaxHistoryDatas < this.pageSize) {
                        this.historyDatas = this.ajaxHistoryDatas;
                    } else {
                        this.historyDatas = this.ajaxHistoryDatas.slice(0, this.pageSize);
                    }
                    for (var i = 0; i < this.length; i++) {
                        // this.complaintId.push(data.data.list[i].pkId);
                        // console.log("id00000000000"+complaintId);
                        // this.second(data.data.list[i].tscustomer);
                    }
                    //二次调用

                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            /*遍历用户名*/
            API.complaintList.complaintNames(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    // this.technologyRecruitmentIds = data.data;
                    // this.tscustomerIds =data.data;
                    this.personnelIds = data.data;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            API.complaintList.teamNames(this.params).then(({
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
            this.loading = false;
        },

        pageChange(index) {
            // console.log("12121212121212");
            var _start = (index - 1) * this.pageSize;
            var _end = index * this.pageSize;
            this.historyDatas = this.ajaxHistoryDatas.slice(_start, _end);
        },
        // second:function(){
        //   // this.loading = true;
        //   // console.log(Id);
        //   // var userId = Id;
        //   //let id = {id:userId};
        //   // console.log(userId);
        //   console.log("=====================");
        //   console.log(this.tscustomer.length);
        //   var Id = 0;
        //   for(var i = 0;i<this.tscustomer.length;i++){
        //         Id = this.tscustomer[i];
        //         // console.log("Id为"+Id);
        //         console.log("22222222222222222222");
        //         // debugger
        //       }
        //       var userId = Id;
        //   console.log(Number(userId));
        //   console.log("5555555555555555555555");
        //   var params = {id:Number(userId)};
        //        API.complaintList.listById(params).then(({data}) => {
        //       console.log("打印状态吗"+data.code);
        //     if (data && data.code == 0) {
        //       this.data1 = data.data;
        //       console.log(this.data1+"data1为");
        //       this.totalCount = data.data.total;
        //       this.length=data.data.list.length;
        //     } else {
        //       this.$Message.error(data.msg);
        //     }
        //   }).catch((data) => {
        //     this.$Message.error('连接失败，请检查网络！');
        //   });
        //   this.loading = false;
        // },
        //获取大类id
        //   selectLevel(){
        //   console.log("获取大类呀!");
        //   // console.log(this.showEditForm.level);
        //   this.params1.parentId=this.showEditForm.level;
        //   //  console.log("this.params1.cityId="+this.params1.parentId);
        //   // console.log("7777777777777777777777777");
        //  //小类
        //   API.complaintList.getLevelName(this.params1).then(({data}) => {
        //     if (data && data.code == 0) {
        //       this.levelNames = data.data.list;
        //       console.log(this.levelNames)
        //     } else {
        //       this.$Message.error(data.msg);
        //     }
        //   }).catch((data) => {
        //     this.$Message.error('连接失败，请检查网络！');
        //   });

        // },
        //责任人名字
        // selectName(){
        //   this
        // },
        resetData(val) {
            if (!val) {
                this.showEditForm = {
                    wangwangnum: '',
                    channel: '',
                    content: '',
                    scenerestoration: '',
                    remark: '',
                    complaintdate: '',
                    sceneRestorationName: ''
                };

            }
        },
        addModal() {
            this.showAddModal = true;
        },
        //上传成功之后的方法
        //   toAdd(){
        //     let _this = this;
        //     if(_this.url[_this.item.length-1] instanceof Array ==false){
        //   _this.url[_this.item.length-1]=[];
        // }
        // _this.url[_this.item.length-1].push(file.response.data);
        //     this.item.push(this.item.length)
        //   },
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
                this.showEditForm.name = name;
                this.showEditForm.url = url;
                console.log("长度为" + scenerestoration);
                console.log(name);
                API.complaintList.addFile(this.showEditForm).then(({
                    data
                }) => {
                    if (data && data.code == 0) {
                        this.init();
                    } else {
                        this.$Message.error(data.msg);
                    }
                });
                API.complaintList.selectFiles(this.showEditForm).then(({
                    data
                }) => {
                    if (data && data.code == 0) {
                        console.log("刷新列表了");
                        this.data3 = data.data;
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$Message.error('连接失败，请检查网络！');
                });

                // console.log(_this.item.length-1);
                // if(_this.url[_this.item.length-1] instanceof Array ==false){
                //   _this.url[_this.item.length-1]=[];
                // }
                // _this.url[_this.item.length-1].push(file.response.data);
                // this.item.push(this.url.length);
                // console.log("长度为");
                // console.log(_this.url);
            } else {
                alert("上传失败");
            }
        },
        //上传错误回调
        handleFormatError(file) {
            this.$Notice.warning({
                title: 'The file format is incorrect',
                desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
        },
        //删除文件
        handleRemove(file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleBeforeUpload() {
            const check = this.item.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: 'Up to five pictures can be uploaded.'
                });
            }
            return check;
        },
        //点击删除文件
        deleteFileModalData(params) {
            //this.pkIds=[params.row.pkId];
            // this.pkIds=[ ];
            this.deleteModal = true;
            let pkIds = this.pkIds;
            if (typeof params.row != 'undefined') {
                // pkIds.push(params.row.pkId);
                this.pkIds = params.row.pkId;
                let pkIds = this.pkIds;
                console.log("循环啊");
                console.log(pkIds);
            } else {
                this.selection.forEach(v => {
                    pkIds.push(v.pkId)
                });
            };
        },
        /* 确定删除*/
        deletefiles() {
            let pkIds = this.pkIds;
            let param = {
                "pkIds": pkIds
            };
            API.complaintList.deleteFile(param).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    API.complaintList.selectFiles(this.showEditForm).then(({
                        data
                    }) => {
                        if (data && data.code == 0) {
                            this.data3 = data.data;
                            // this.params.complaintId='';
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
        //确定上传.关闭窗口
        uploadFileEdit() {
            this.showEditForm.url = this.url;
            let complaintId = this.complaintId;
            console.log("id为");
            console.log(complaintId);
            let name = this.name;
            this.showEditForm.name = name;
            this.showEditForm.complaintId = complaintId;
            API.complaintList.addFile(this.showEditForm).then(({
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
        cancelFileEdit() {
            this.ts = false
        },
        /*取消*/
        cancelDeleteFile() {
            this.deleteModal = false;
        },
        // //上传前的事件钩子
        // handleUpload(file){
        //     // 选择文件后 这里判断文件类型 保存文件 自定义一个keyid 值 方便后面删除操作
        //           let keyID = Math.random().toString().substr(2);
        //           url['keyID'] = keyID;
        //           // 保存文件到总展示文件数据里
        //           this.url.push(file);
        //           // 保存文件到需要上传的文件数组里
        //           this.scenerestoration.push(file)
        //           // 返回 falsa 停止自动上传 我们需要手动上传
        //           //如果需要手动上传文件，需要把这里注释放开并放开上面代码块中的被注释的两个按钮，就可以进行手动上传了
        //           //return false
        // },

        //用户验证
        yanzheng() {
            API.complaintList.exist(this.showEditForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.init();
                } else {
                    this.$Message.error("请选择正确用户");
                }
            })
        },
        //点击添加确定
        save() {
            this.confirmModal = true;
        },
        confirmAdd() {
            // let scenerestoration = JSON.stringify(this.url);
            // this.showEditForm.scenerestoration = scenerestoration;
            API.complaintList.insert(this.showAddForm).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    //上传文件封装成数组
                    //   if(this.url.length == 1){
                    //   this.scenerestoration = this.url[0].scenerestoration;
                    //   console.log(this.scenerestoration);
                    // }else if(this.url.length >1){
                    //   const urlList = [];
                    //   for(let j = 0;j<this.url.length;j++){
                    //     urlList.push(this.url[j].scenerestoration);
                    //     console.log("循环地址");
                    //     console.log(urlList);
                    //   }
                    //   this.scenerestoration  = urlList.join(",");
                    //   console.log("拼接地址哦!");
                    //   console.log(this.scenerestoration);
                    // }
                    this.init();
                } else {
                    this.$Message.error(data.msg);
                }
                this.$refs.form1.resetFields();
            }).catch((data) => {
                this.$Message.error('请完成所有数据添加');
            })
        },
        //取消添加
        confirmCancel() {
            this.showAddModal = true;
        },
        cancel() {
            this.showAddModal = false;

        },
        //点击修改
        showEditModalData(params) {
            this.showEditModal = true;
            //大类
            if (params.row.level != null) {
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
            /*遍历用户名*/
            API.complaintList.complaintNames(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    // this.technologyRecruitmentIds = data.data;
                    // this.tscustomerIds =data.data;
                    this.personnelIds = data.data;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            /*遍历团队名*/

            if (typeof params.row != 'undefined') {
                const Complaint = params.row;
                this.showEditForm.pkId = Complaint.pkId;
                console.log(this.showEditForm.pkId + "主键id为:")
                this.showEditForm.wangwangnum = Complaint.wangwangnum;
                this.showEditForm.channel = Complaint.channel;
                //数组转取出情景还原url
                // let scenerestoration = Complaint.scenerestoration;
                // this.url = JSON.parse(scenerestoration);
                // // this.showEditForm.scenerestoration = Complaint.scenerestoration;
                // this.showEditForm.sceneRestorationName = Complaint.sceneRestorationName;
                this.showEditForm.shopptype = Complaint.shopptype;
                this.showEditForm.remark = Complaint.remark;
                this.showEditForm.responsibility = Complaint.responsibility;
                this.showEditForm.frequency = Complaint.frequency;
                this.showEditForm.level = Complaint.level;
                this.showEditForm.sonLevel = Complaint.sonLevel;
                this.showEditForm.result = Complaint.result;
                this.showEditForm.teamname = Complaint.teamname;
                this.showEditForm.username = Complaint.username;
                this.showEditForm.content = Complaint.content;
                this.showEditForm.shopptype = Complaint.shopptype;
                this.showEditForm.department = Complaint.department;
                this.showEditForm.custtype = Complaint.custtype;
                this.showEditForm.worktype = Complaint.worktype;
                this.showEditForm.personnelid = Complaint.personnelid;
                this.showEditForm.technologyRecruitmentid = Complaint.technologyRecruitmentid;
                this.showEditForm.tscustomer = Complaint.tscustomer;
                // this.showEditForm.parentId = Complaint.parentId;
                this.showEditForm.complaintName = Complaint.complaintName;
                // this.showEditForm.complaintid = Complaint.complaintid;
                // this.showEditForm.sonId = Complaint.sonId;
                this.showEditForm.status = Complaint.status;
                this.showEditForm.hDate = Complaint.complaintdate;
                this.showEditForm.complaintdate = Complaint.complaintdate;
                this.showEditForm.tename = Complaint.tename;

                this.showEditForm.turnover = Complaint.turnover;
                this.showEditForm.number = Complaint.number;
                this.showEditForm.industry = Complaint.industry;
                this.showEditForm.followPersonel = Complaint.followPersonel;
                this.showEditForm.followProcess = Complaint.followProcess;
                this.showEditForm.processingScheme = Complaint.processingScheme;

                this.showEditForm.pname = Complaint.pname;
                this.showEditForm.tename = Complaint.tename;
            }
        },
        reViewEditModalData(params) {
            this.reViewModal = true;
            if (typeof params.row != 'undefined') {
                const Complaint = params.row;
                this.showEditForm.pkId = Complaint.pkId;
                this.showEditForm.status = Complaint.status;
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
                console.log("循环啊");
                console.log(pkIds);
            } else {
                this.selection.forEach(v => {
                    pkIds.push(v.pkId)
                });
            };
        },
        /* 确定删除*/
        saveDelete() {
            let pkIds = this.pkIds;
            let param = {
                "pkIds": pkIds
            };
            API.complaintList.less(param).then(({
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
        // 选择状态改变
        selectionChange(data) {
            this.size = data.length
            this.selection = data;
        },
        saveEdit() {
            API.complaintList.update(this.showEditForm).then(({
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
            this.showEditModalAll = false;
        },
        //上传文件（不用了）
        fileModal(params) {
            this.ts = true;
            this.params.id = params.row.pkId;
            let complaintId = this.params.id;
            this.complaintId = complaintId;
            console.log(complaintId + "获取的id为");
            // this.uploadData = Vue.set(vm.uploadData,'uploadData',complaintId);
            // this.uploadData = params.row.complaintId;
            // let uploadData =this.uploadData;
            // // this.uploadData={},
            // // uploadData.push(complaintId);
            // console.log(uploadData);
            this.params.pageNumber = 1;
            this.loading = false;
        },
        //查看文件
        lookFileModal(params) {
            this.showFileModal = true;
            this.params.complaintId = params.row.pkId;
            this.showEditForm.complaintId = params.row.pkId;
            this.pageNumber = 1;
            this.loading = true;
            /*data是接口返回的data*/
            API.complaintList.selectFiles(this.params).then(({
                data
            }) => {
                if (data && data.code == 0) {
                    this.data3 = data.data;
                    this.params.complaintId = '';
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch((data) => {
                this.$Message.error('连接失败，请检查网络！');
            });
            this.loading = false;
        },
        saveFileTable() {
            this.showFileModal = false;
        },
        cancelFileTable() {
            this.showFileModal = false;
        },
        lookModal(params) {

            this.showModal = true;
            this.params.wangwangnum = params.row.wangwangnum;
            this.params.pageNum = 1;
            // 数据初始化
            this.loading = true;
            /*data是接口返回的data*/
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
                this.$Message.error('连接失败，请检查网络！');
            });
            this.loading = false;
        },
        saveTable() {
            this.showModal = false;
        },
        cancelTable() {
            this.showModal = false;
        },
        //点击客诉大类别
        selectLevel() {
            this.showEditForm.parentId = this.showEditForm.level;
            this.params1.parentId = this.showEditForm.parentId;
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
        //点击详情
        showData(params) {
            this.showEditModalAll = true;
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
                const Complaint = params.row;
                this.showEditForm.pkId = Complaint.pkId;
                this.showEditForm.wangwangnum = Complaint.wangwangnum;
                this.showEditForm.refundChannel = Complaint.refundChannel;
                this.showEditForm.remark = Complaint.remark;
                this.showEditForm.refundAmount = Complaint.refundAmount;
                this.showEditForm.result = Complaint.result;
                this.showEditForm.isDelete = Complaint.isDelete;
                this.showEditForm.hDate = Complaint.refundDate;
                this.showEditForm.createTime = Complaint.createTime;
                this.showEditForm.refundCause = Complaint.refundCause;
                this.showEditForm.custtype = Complaint.custtype;
                this.showEditForm.childtype = Complaint.childtype;
                this.showEditForm.turnovermoney = Complaint.turnovermoney;
                this.showEditForm.teamname = Complaint.teamname;
                this.showEditForm.serverdeadline = Complaint.serverdeadline;
                this.showEditForm.serverdeadlineend = Complaint.serverdeadlineend;
                this.showEditForm.deadline = Complaint.deadline;
                this.showEditForm.username1 = Complaint.username1;
                this.showEditForm.username2 = Complaint.username2;
                this.showEditForm.shopptype = Complaint.shopptype;
                this.showEditForm.level = Complaint.level;
                this.showEditForm.sonLevel = Complaint.sonLevel;
                this.showEditForm.externalCause = Complaint.externalCause;
                this.showEditForm.parentId = Complaint.parentId;
                this.showEditForm.complaintdate = Complaint.complaintdate;
                this.showEditForm.username = Complaint.username;
                this.showEditForm.channel = Complaint.channel;
                this.showEditForm.tename = Complaint.tename;
                console.log("店长为:" + Complaint.tename);
                this.showEditForm.turnover = Complaint.turnover;
                this.showEditForm.number = Complaint.number;
                this.showEditForm.industry = Complaint.industry;
                this.showEditForm.followPersonel = Complaint.followPersonel;
                console.log(this.showEditForm.followPersonel + "跟进人员为");
                this.showEditForm.processingScheme = Complaint.processingScheme;
                this.showEditForm.followProcess = Complaint.followProcess;
                this.showEditForm.content = Complaint.content;

                this.showEditForm.remarks = Complaint.remarks;
                this.showEditForm.responsibility = Complaint.responsibility;
                this.showEditForm.frequency = Complaint.frequency;
                this.showEditForm.department = Complaint.department;
                this.showEditForm.worktype = Complaint.worktype;
                this.showEditForm.personnelid = Complaint.personnelid;
                this.showEditForm.technologyRecruitmentid = Complaint.technologyRecruitmentid;
                this.showEditForm.tscustomer = Complaint.tscustomer;
                this.showEditForm.complaintName = Complaint.complaintName;
                this.showEditForm.pname = Complaint.pname;
            }
        },
        //点击确定详情
        saveEdits() {
            API.responsibilityList.update(this.showEditForm).then(({
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

<style>
.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
