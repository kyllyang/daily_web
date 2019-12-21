<template>
  <Form ref="formData" :model="formData" :rules="formRule" :label-width="100">
    <Row>
      <Col span="12">
        <FormItem label="编号" prop="code">
          <Input type="text" v-model="formData.code"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="名称" prop="name">
          <Input type="text" v-model="formData.name"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="IT部负责人" prop="customerPrincipalCode">
          <Select v-model="formData.customerPrincipalCode" filterable clearable>
            <Option v-for="(item, index) in customerPrincipalList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
              <span style="float:right;color:#ccc">{{ item.companyName }}</span>
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="状态" prop="status">
          <Select v-model="formData.status" placeholder="全部" clearable>
            <Option v-for="(item, index) in statusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="服务公司" prop="companyCodes">
          <Select v-model="formData.companyCodes" multiple filterable clearable>
            <Option v-for="(item, index) in companyList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="维护团队" prop="teamCode">
          <Select v-model="formData.teamCode" clearable>
            <Option v-for="(item, index) in teamList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
              <span style="float:right;color:#ccc">{{ item.principalName }}</span>
            </Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="SVN信息" prop="svnInfo">
          <Input type="textarea" :rows="4" v-model="formData.svnInfo"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="数据库信息" prop="dbInfo">
          <Input type="textarea" :rows="4" v-model="formData.dbInfo"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="业务描述" prop="businessInfo">
          <Input type="textarea" :rows="4" v-model="formData.businessInfo"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="框架描述" prop="frameworkInfo">
          <Input type="textarea" :rows="4" v-model="formData.frameworkInfo"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="上线时间" prop="onTime">
          <DatePicker :value="formData.onTime" format="yyyy-MM-dd" type="date" @on-change="getOnTimeTime"></DatePicker>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="废弃时间" prop="offTime">
          <DatePicker :value="formData.offTime" format="yyyy-MM-dd" type="date" @on-change="getOffTimeTime"></DatePicker>
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
import { listCustomerEmployee } from '@/api/daily/customer-employee'
import { listCustomerCompany } from '@/api/daily/customer-company'
import { findOrgTeam } from '@/api/daily/org-team'
import { checkByBackend, createProjectSystem, updateProjectSystem, getProjectSystem } from '@/api/daily/project-system'

export default {
  data () {
    return {
      statusDataDicts: [],
      customerPrincipalList: [],
      companyList: [],
      teamList: [],
      formData: {
        id: null,
        code: '',
        name: '',
        customerPrincipalCode: '',
        status: '',
        svnInfo: '',
        dbInfo: '',
        businessInfo: '',
        frameworkInfo: '',
        onTime: '',
        offTime: '',
        companyCodes: [],
        teamCode: ''
      },
      formRule: {
        code: [
          { type: 'string', required: true, max: 100, message: '不能为空，且最大长度不能超过100个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', required: true, max: 50, message: '不能为空，且最大长度不能超过50个字符', trigger: 'blur' }
        ],
        svnInfo: [
          { type: 'string', max: 400, message: '最大长度不能超过400个字符', trigger: 'blur' }
        ],
        dbInfo: [
          { type: 'string', max: 400, message: '最大长度不能超过400个字符', trigger: 'blur' }
        ],
        businessInfo: [
          { type: 'string', max: 400, message: '最大长度不能超过400个字符', trigger: 'blur' }
        ],
        frameworkInfo: [
          { type: 'string', max: 400, message: '最大长度不能超过400个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    getOnTimeTime (time) {
      this.formData.onTime = time
    },
    getOffTimeTime (time) {
      this.formData.offTime = time
    },
    loadStatusDataDict () {
      getDataDictByCode('SYSTEM_STATUS').then(res => {
        this.statusDataDicts = res.data
      })
    },
    loadCustomerPrincipalList () {
      listCustomerEmployee({}).then(res => {
        this.customerPrincipalList = res.data
      })
    },
    loadCompanyList () {
      listCustomerCompany({}).then(res => {
        this.companyList = res.data
      })
    },
    loadTeamList () {
      findOrgTeam({}).then(res => {
        this.teamList = res.data
      })
    },
    loadForm () {
      getProjectSystem(this.$route.params.id).then(res => {
        this.formData = res.data
      })
    },
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          checkByBackend(this.formData).then(res => {
            if (this.$route.params.id) {
              updateProjectSystem(this.formData).then(res => {
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
              createProjectSystem(this.formData).then(res => {
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
    this.loadStatusDataDict()
    this.loadCustomerPrincipalList()
    this.loadCompanyList()
    this.loadTeamList()

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
