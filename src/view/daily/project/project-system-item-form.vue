<template>
  <Form ref="formData" :model="formData" :rules="formRule" :label-width="100">
    <Row>
      <Col span="12">
        <FormItem label="所属系统" prop="systemCode">
          <Select v-model="formData.systemCode" filterable clearable @on-change="loadCode">
            <Option v-for="(item, index) in systemList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
              <span style="float:right;color:#ccc">{{ item.companyNameText }}</span>
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="编号" prop="code">
          <Input type="text" v-model="formData.code"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="名称" prop="name">
          <Input type="text" v-model="formData.name"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="提出部门" prop="fromDepartment">
          <Input type="text" v-model="formData.fromDepartment"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="信息接口人" prop="customerItCodes">
          <Select v-model="formData.customerItCodes" multiple filterable clearable>
            <Option v-for="(item, index) in customerEmployeeList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
              <span style="float:right;color:#ccc">{{ item.companyName }}</span>
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="业务接口人" prop="customerBizCodes">
          <Select v-model="formData.customerBizCodes" multiple filterable clearable>
            <Option v-for="(item, index) in customerEmployeeList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
              <span style="float:right;color:#ccc">{{ item.companyName }}</span>
            </Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="项目负责人" prop="principalCodes">
          <Select v-model="formData.principalCodes" multiple filterable clearable>
            <Option v-for="(item, index) in orgEmployeeList" :value="item.code" :label="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="项目成员" prop="employeeCodes">
          <Select v-model="formData.employeeCodes" multiple filterable clearable>
            <Option v-for="(item, index) in orgEmployeeList" :value="item.code" :label="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="是否上线" prop="onlineStatus">
          <Select v-model="formData.onlineStatus" clearable>
            <Option v-for="(item, index) in onlineStatusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="项目状态" prop="projectStatus">
          <Select v-model="formData.projectStatus" clearable>
            <Option v-for="(item, index) in projectStatusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="结算状态" prop="settleStatus">
          <Select v-model="formData.settleStatus" clearable>
            <Option v-for="(item, index) in settleStatusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="计划上线时间" prop="planOnlineDate">
          <DatePicker :value="formData.planOnlineDate" format="yyyy-MM-dd" type="date" @on-change="getPlanOnlineDateTime"></DatePicker>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="实际上线时间" prop="realOnlineDate">
          <DatePicker :value="formData.realOnlineDate" format="yyyy-MM-dd" type="date" @on-change="getRealOnlineDateTime"></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="备注" prop="remark">
          <Input type="textarea" :rows="4" v-model="formData.remark"></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem>
      <Button type="primary" @click="handleSubmit()">保存</Button>
      <Button type="primary" @click="handleReset()" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>
<script>
import { mapMutations } from 'vuex'
import { getDataDictByCode } from '@/api/daily/evo-sys'
import { listProjectSystem } from '@/api/daily/project-system'
import { listCustomerEmployee } from '@/api/daily/customer-employee'
import { listOrgEmployee } from '@/api/daily/org-employee'
import { getCode, checkByBackend, createProjectSystemItem, updateProjectSystemItem, getProjectSystemItem } from '@/api/daily/project-system-item'

export default {
  data () {
    return {
      onlineStatusDataDicts: [],
      projectStatusDataDicts: [],
      settleStatusDataDicts: [],
      systemList: [],
      customerEmployeeList: [],
      orgEmployeeList: [],
      formData: {
        id: null,
        systemCode: '',
        code: '',
        name: '',
        fromDepartment: '',
        customerItCodes: [],
        customerBizCodes: [],
        principalCodes: [],
        employeeCodes: [],
        onlineStatus: '',
        projectStatus: '',
        settleStatus: '',
        planOnlineDate: '',
        realOnlineDate: '',
        remark: ''
      },
      formRule: {
        systemCode: [
          { type: 'string', required: true, message: '不能为空', trigger: 'blur' }
        ],
        code: [
          { type: 'string', required: true, max: 100, message: '不能为空，且最大长度不能超过100个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', required: true, max: 50, message: '不能为空，且最大长度不能超过50个字符', trigger: 'blur' }
        ],
        fromDepartment: [
          { type: 'string', max: 50, message: '最大长度不能超过50个字符', trigger: 'blur' }
        ],
        customerItCodes: [
          { required: true, message: '不能为空' }
        ],
        customerBizCodes: [
          { required: true, message: '不能为空' }
        ],
        principalCodes: [
          { required: true, message: '不能为空' }
        ],
        employeeCodes: [
          { required: true, message: '不能为空' }
        ],
        onlineStatus: [
          { type: 'string', required: true, message: '不能为空' }
        ],
        projectStatus: [
          { type: 'string', required: true, message: '不能为空' }
        ],
        settleStatus: [
          { type: 'string', required: true, message: '不能为空' }
        ],
        planOnlineDate: [
          { type: 'string', required: true, message: '不能为空' }
        ],
        remark: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    getPlanOnlineDateTime (time) {
      this.formData.planOnlineDate = time
    },
    getRealOnlineDateTime (time) {
      this.formData.realOnlineDate = time
    },
    loadOnlineStatusDataDict () {
      getDataDictByCode('PROJECT_ONLINE').then(res => {
        this.onlineStatusDataDicts = res.data
      })
    },
    loadProjectStatusDataDict () {
      getDataDictByCode('PROJECT_STATUS').then(res => {
        this.projectStatusDataDicts = res.data
      })
    },
    loadSettleStatusDataDict () {
      getDataDictByCode('SETTLE_STATUS').then(res => {
        this.settleStatusDataDicts = res.data
      })
    },
    loadSystemList () {
      listProjectSystem({}).then(res => {
        this.systemList = res.data
      })
    },
    loadCustomerEmployeeList () {
      listCustomerEmployee({}).then(res => {
        this.customerEmployeeList = res.data
      })
    },
    loadOrgEmployeeList () {
      listOrgEmployee({ all: true }).then(res => {
        this.orgEmployeeList = res.data
      })
    },
    loadCode () {
      if (this.formData.systemCode) {
        getCode(this.formData.systemCode).then(res => {
          this.formData.code = res.data
        })
      } else {
        this.formData.code = ''
      }
    },
    loadForm () {
      getProjectSystemItem(this.$route.params.id).then(res => {
        this.formData = res.data
      })
    },
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          checkByBackend(this.formData).then(res => {
            if (this.$route.params.id) {
              updateProjectSystemItem(this.formData).then(res => {
                this.$Modal.success({
                  title: '成功',
                  content: '保存成功！',
                  onOk: () => {
                    this.closeTag({
                      name: this.$router.currentRoute.name,
                      params: {
                        id: this.$route.params.id
                      }
                    })
                  }
                })
              }).catch(err => {
                this.$Modal.error({
                  title: '错误',
                  content: '保存失败！<br/>' + err.response.status + ':' + err.response.data.code + ':' + err.response.data.message
                })
              })
            } else {
              createProjectSystemItem(this.formData).then(res => {
                this.$Modal.success({
                  title: '成功',
                  content: '保存成功！',
                  onOk: () => {
                    this.closeTag({
                      name: this.$router.currentRoute.name
                    })
                  }
                })
              }).catch(err => {
                this.$Modal.error({
                  title: '错误',
                  content: '保存失败！<br/>' + err.response.status + ':' + err.response.data.code + ':' + err.response.data.message
                })
              })
            }
          }).catch(err => {
            this.$Modal.error({
              title: '错误',
              content: '保存失败！<br/>' + err.response.status + ':' + err.response.data.code + ':' + err.response.data.message
            })
          })
        } else {
          this.$Modal.warning({
            title: '警告',
            content: '表单验证失败，请检查！'
          })
        }
      })
    },
    handleReset () {
      this.$refs['formData'].resetFields()
    }
  },
  mounted () {
    this.loadOnlineStatusDataDict()
    this.loadProjectStatusDataDict()
    this.loadSettleStatusDataDict()
    this.loadSystemList()
    this.loadCustomerEmployeeList()
    this.loadOrgEmployeeList()

    if (this.$route.params.id) {
      this.loadForm()
    }
  }
}
</script>
<style>
  .icon-img {
    width: 24px;
    height: 24px;
  }
</style>
