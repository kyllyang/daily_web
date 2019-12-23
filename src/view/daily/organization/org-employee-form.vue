<template>
  <Form ref="formData" :model="formData" :rules="formRule" :label-width="100">
    <Divider>基本信息</Divider>
    <Row>
      <Col span="12">
        <FormItem label="编号" prop="code">
          <Input type="text" v-model="formData.code"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="姓名" prop="name">
          <Input type="text" v-model="formData.name" @on-keyup="generateUsername()"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="用户名称" prop="username">
          <Input type="text" v-model="formData.username"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="员工状态" prop="status">
          <Select v-model="formData.status" clearable>
            <Option v-for="(item, index) in statusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row v-show="formComponent.password.show">
      <Col span="12">
        <FormItem label="密码" prop="password">
          <Tooltip content="默认密码123456" placement="top-start">
            <Input type="password" v-model="formData.password"></Input>
          </Tooltip>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="确认密码" prop="confirmPassword">
          <Input type="password" v-model="formData.confirmPassword"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="手机" prop="phone">
          <Input type="text" v-model="formData.phone"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="邮箱" prop="mailbox">
          <Input type="text" v-model="formData.mailbox"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="formData.sex">
            <Radio v-for="(item, index) in sexDataDicts" :label="item.key" :key="index">
              <Img class="icon-img" :src="item.img"></Img>
            </Radio>
          </RadioGroup>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="生日" prop="birth">
          <DatePicker :value="formData.birth" format="yyyy-MM-dd" type="date" @on-change="getBirthTime"></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="入职时间" prop="inTime">
          <DatePicker :value="formData.inTime" format="yyyy-MM-dd" type="date" @on-change="getInTimeTime"></DatePicker>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="离职时间" prop="outTime">
          <DatePicker :value="formData.outTime" format="yyyy-MM-dd" type="date" @on-change="getOutTimeTime"></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <Divider>团队信息</Divider>
    <Row>
      <Col span="12">
        <FormItem label="所属团队" prop="teamCodes">
          <Tree ref="teamCodeTree" :data="orgTeamList" show-checkbox multiple :check-strictly="true" :check-directly="true"></Tree>
        </FormItem>
      </Col>
    </Row>
    <Divider>岗位信息</Divider>
    <Row>
      <Col span="12">
        <FormItem label="岗位" prop="job">
          <Select v-model="formData.job" clearable>
            <Option v-for="(item, index) in jobDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="角色" prop="roleCode">
          <Select v-model="formData.roleCode" clearable>
            <Option v-for="(item, index) in orgRoleList" :value="item.code" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Divider>扩展信息</Divider>
    <Row>
      <Col span="12">
        <FormItem label="学历" prop="education">
          <Select v-model="formData.education" clearable>
            <Option v-for="(item, index) in educationDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="毕业院校" prop="university">
          <Input type="text" v-model="formData.university"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="专业" prop="major">
          <Input type="text" v-model="formData.major"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="从业年限" prop="operationYears">
          <InputNumber v-model="formData.operationYears" :min="0" :step="0.5"></InputNumber>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="擅长技术/工具" prop="goodAtTool">
          <Input type="textarea" :rows="4" v-model="formData.goodAtTool"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="擅长业务" prop="goodAtBusiness">
          <Input type="textarea" :rows="4" v-model="formData.goodAtBusiness"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="取得资质及时间" prop="qualifications">
          <Input type="textarea" :rows="4" v-model="formData.qualifications"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="过往经历" prop="beforeWork">
          <Input type="textarea" :rows="4" v-model="formData.beforeWork"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="备用联系人" prop="standbyContacts">
          <Input type="text" v-model="formData.standbyContacts"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="备用联系人电话" prop="standbyPhone">
          <Input type="text" v-model="formData.standbyPhone"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="现住址" prop="address">
          <Input type="text" v-model="formData.address"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="祖籍地址" prop="ancestralAddress">
          <Input type="text" v-model="formData.ancestralAddress"></Input>
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
import { treeOrgTeam } from '@/api/daily/org-team'
import { findOrgRole } from '@/api/daily/org-role'
import { getMaxCode, checkByBackend, createOrgEmployee, updateOrgEmployee, getOrgEmployee } from '@/api/daily/org-employee'
import { pinyinFull } from '@/libs/util'
import IMG_SEX00001 from '@/assets/images/daily/SEX00001.png'
import IMG_SEX00002 from '@/assets/images/daily/SEX00002.png'

export default {
  data () {
    const confirmPasswordValidator = (rule, value, callback) => {
      if (this.formData.password !== value) {
        callback(new Error('密码与确认密码不相同'))
      } else {
        callback()
      }
    }
    const phoneValidator = (rule, value, callback) => {
      if (value !== '' && !/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入有效的手机号码'))
      } else {
        callback()
      }
    }
    const mailboxValidator = (rule, value, callback) => {
      if (value !== '' && !/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(value)) {
        callback(new Error('请输入有效的邮箱'))
      } else {
        callback()
      }
    }
    const teamCodesValidator = (rule, value, callback) => {
      callback()
    }

    return {
      sexDataDicts: [],
      jobDataDicts: [],
      statusDataDicts: [],
      educationDataDicts: [],
      orgTeamList: [],
      orgRoleList: [],
      formData: {
        id: null,
        code: '',
        name: '',
        userId: null,
        username: '',
        password: '123456',
        confirmPassword: '123456',
        sex: 'SEX00002',
        birth: '',
        phone: '',
        mailbox: '',
        inTime: new Date(),
        outTime: '',
        job: '',
        status: '',
        teamCodes: [],
        roleCode: '',
        education: '',
        university: '',
        major: '',
        operationYears: null,
        goodAtTool: '',
        goodAtBusiness: '',
        qualifications: '',
        beforeWork: '',
        standbyContacts: '',
        standbyPhone: '',
        address: '',
        ancestralAddress: ''
      },
      formComponent: {
        password: {
          show: true
        }
      },
      formRule: {
        code: [
          { type: 'string', required: true, max: 10, message: '不能为空，且最大长度不能超过10个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', required: true, max: 10, message: '不能为空，且最大长度不能超过10个字符', trigger: 'blur' }
        ],
        username: [
          { type: 'string', required: true, max: 30, message: '不能为空，且最大长度不能超过30个字符', trigger: 'blur' }
        ],
        password: [
          { type: 'string', required: true, min: 6, max: 20, message: '不能为空，且长度必须6到20个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { type: 'string', required: true, validator: confirmPasswordValidator, trigger: 'blur' }
        ],
        phone: [
          { type: 'string', required: true, max: 20, message: '不能为空，且最大长度不能超过20个字符', trigger: 'blur' },
          { type: 'string', validator: phoneValidator, trigger: 'blur' }
        ],
        mailbox: [
          { type: 'string', validator: mailboxValidator, trigger: 'blur' }
        ],
        job: [
          { type: 'string', required: true, message: '不能为空' }
        ],
        status: [
          { type: 'string', required: true, message: '不能为空' }
        ],
        teamCodes: [
          { required: true, validator: teamCodesValidator, trigger: 'blur' }
        ],
        roleCode: [
          { type: 'string', required: true, message: '不能为空' }
        ],
        university: [
          { type: 'string', max: 30, message: '最大长度不能超过30个字符', trigger: 'blur' }
        ],
        major: [
          { type: 'string', max: 30, message: '最大长度不能超过30个字符', trigger: 'blur' }
        ],
        goodAtTool: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ],
        goodAtBusiness: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ],
        qualifications: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ],
        beforeWork: [
          { type: 'string', max: 400, message: '最大长度不能超过400个字符', trigger: 'blur' }
        ],
        standbyContacts: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ],
        standbyPhone: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ],
        address: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ],
        ancestralAddress: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    generateUsername () {
      this.formData.username = pinyinFull(this.formData.name)
    },
    getBirthTime (time) {
      this.formData.birth = time
    },
    getInTimeTime (time) {
      this.formData.inTime = time
    },
    getOutTimeTime (time) {
      this.formData.outTime = time
    },
    loadSexDataDict () {
      getDataDictByCode('SEX').then(res => {
        const dataList = res.data.map(item => {
          return {
            key: item.key,
            value: item.value,
            img: item.key === 'SEX00001' ? IMG_SEX00001 : IMG_SEX00002
          }
        })
        this.sexDataDicts = dataList
      })
    },
    loadJobDataDict () {
      getDataDictByCode('SB_EMPLOYEE_JOB').then(res => {
        this.jobDataDicts = res.data
      })
    },
    loadStatusDataDict () {
      getDataDictByCode('USER_STATUS').then(res => {
        this.statusDataDicts = res.data
      })
    },
    loadOrgRoleList () {
      findOrgRole().then(res => {
        this.orgRoleList = res.data
      })
    },
    loadEducationDataDict () {
      getDataDictByCode('EDUCATION').then(res => {
        this.educationDataDicts = res.data
      })
    },
    loadMaxCode () {
      getMaxCode().then(res => {
        this.formData.code = res.data
      })
    },
    loadOrgTeamList () {
      treeOrgTeam().then(res => {
        this.orgTeamList = res.data

        this.selectedTeamCode(this.orgTeamList)
      })
    },
    loadForm () {
      getOrgEmployee(this.$route.params.id).then(res => {
        this.formData = res.data

        this.selectedTeamCode(this.orgTeamList)
      })
    },
    selectedTeamCode (orgTeams) {
      for (let index in orgTeams) {
        if (orgTeams[index].value === this.formData.teamCodes[0]) {
          orgTeams[index].checked = true
          break
        }

        this.selectedTeamCode(orgTeams[index].children)
      }
    },
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.formData.teamCodes = []
          for (let index in this.$refs['teamCodeTree'].getCheckedNodes()) {
            this.formData.teamCodes.push(this.$refs['teamCodeTree'].getCheckedNodes()[index].value)
          }
          if (this.formData.teamCodes.length !== 1) {
            this.$Modal.error({
              title: '错误',
              content: '保存失败！<br/>必须选择一个所属团队！'
            })
            return
          }

          checkByBackend(this.formData).then(res => {
            if (this.$route.params.id) {
              updateOrgEmployee(this.formData).then(res => {
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
              createOrgEmployee(this.formData).then(res => {
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
    this.loadSexDataDict()
    this.loadJobDataDict()
    this.loadStatusDataDict()
    this.loadEducationDataDict()
    this.loadOrgTeamList()
    this.loadOrgRoleList()

    if (this.$route.params.id) {
      this.formComponent.password.show = false
      this.formRule.password = null
      this.formRule.confirmPassword = null
      this.loadForm()
    } else {
      this.loadMaxCode()
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
