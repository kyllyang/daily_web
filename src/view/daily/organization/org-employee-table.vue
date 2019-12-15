<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        员工列表
        <p slot="content">
          <Form ref="formData" :model="formData" :rules="formRule" :label-width="80" inline>
            <Row>
              <Col span="8">
                <FormItem label="编号" prop="code">
                  <Input type="text" v-model="formData.code"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="姓名" prop="name">
                  <Input type="text" v-model="formData.name"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="性别" prop="sex">
                  <Select v-model="formData.sex" placeholder="全部" clearable>
                    <Option v-for="(item, index) in dataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="邮箱" prop="mailbox">
                  <Input type="text" v-model="formData.mailbox"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="手机" prop="phone">
                  <Input type="text" v-model="formData.phone"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="岗位" prop="job">
                  <Select v-model="formData.job" clearable>
                    <Option v-for="(item, index) in jobDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="团队" prop="teamCode" style="width: 50%;">
                  <Select v-model="formData.teamCode" clearable>
                    <Option v-for="(item, index) in teamList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
                      <span style="float:right;color:#ccc">{{ item.principalName }}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8" offset="8">
                <FormItem>
                  <Button type="primary" @click="handleQuery()">
                    <Icon type="ios-search-outline" />
                    查询
                  </Button>
                  <Button type="primary" @click="handleReset()" style="margin-left: 8px">
                    <Icon type="ios-repeat" />
                    重置
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </p>
      </Panel>
    </Collapse>
    <br/>
    <ButtonGroup>
      <Button type="primary" @click="handleCreate()">
        <Icon type="ios-add" />
        新增
      </Button>
      <Button type="primary" @click="handleModify()">
        <Icon type="ios-create-outline" />
        修改
      </Button>
      <Button type="primary" @click="handleView()">
        <Icon type="ios-paper-outline" />
        查看
      </Button>
      <Button type="primary" @click="handleDelete()">
        <Icon type="ios-trash-outline"/>
        删除
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button type="primary" @click="handleChangePassword()" style="margin-left: 8px">
        <Icon type="ios-create-outline"/>
        修改密码
      </Button>
    </ButtonGroup>
    <br/>
    <br/>
    <Table ref="dataTable" :data="data" :columns="columns" :loading="loading" size="small" stripe border></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalRecord" :current.sync="pageNo" :page-size="pageSize" show-elevator show-sizer show-total @on-change="loadData" @on-page-size-change="changeSize"></Page>
      </div>
    </div>
  </div>
</template>
<script>
import { getDataDictByCode } from '@/api/daily/evo-datadict'
import { findOrgTeam } from '@/api/daily/org-team'
import { pageOrgEmployee, deleteOrgEmployee, updateOrgEmployeePassowrd } from '@/api/daily/org-employee'
import IMG_SEX00001 from '@/assets/images/daily/SEX00001.png'
import IMG_SEX00002 from '@/assets/images/daily/SEX00002.png'

export default {
  data () {
    return {
      collapse: '1',
      dataDicts: [],
      jobDataDicts: [],
      teamList: [],
      newPassword: '123456',
      formData: {
        code: '',
        name: '',
        sex: '',
        mailbox: '',
        phone: '',
        job: '',
        teamCode: ''
      },
      formRule: {
        code: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
        ],
        mailbox: [
          { type: 'string', max: 100, message: '最大长度不能超过100个字符', trigger: 'blur' }
        ],
        phone: [
          { type: 'string', max: 20, message: '最大长度不能超过20个字符', trigger: 'blur' }
        ]
      },
      columns: [
        {
          type: 'selection',
          align: 'center',
          width: 60,
          key: 'id'
        },
        {
          type: 'index',
          align: 'center',
          width: 70,
          title: '序号',
          key: 'id',
          indexMethod: (row) => {
            return (row._index + 1) + (this.pageSize * this.pageNo) - this.pageSize
          }
        },
        {
          align: 'left',
          width: 120,
          title: '编号',
          key: 'code'
        },
        {
          align: 'left',
          width: 120,
          title: '姓名',
          key: 'name'
        },
        {
          align: 'center',
          width: 70,
          title: '性别',
          key: 'sex',
          render: (h, params) => {
            return h('img', {
              props: {
                type: 'primary',
                size: 'small'
              },
              attrs: {
                src: params.row.sex === 'SEX00001' ? IMG_SEX00001 : IMG_SEX00002, style: 'width: 24px; height: 24px;'
              }
            })
          }
        },
        {
          align: 'left',
          width: 240,
          title: '邮箱',
          key: 'mailbox'
        },
        {
          align: 'left',
          width: 120,
          title: '手机',
          key: 'phone'
        },
        {
          align: 'center',
          width: 120,
          title: '岗位',
          key: 'job',
          render: (h, params) => {
            let text = ''
            for (let index in this.jobDataDicts) {
              if (params.row.job === this.jobDataDicts[index].key) {
                text = this.jobDataDicts[index].value
                break
              }
            }
            return h('div', text)
          }
        },
        {
          align: 'left',
          title: '擅长领域',
          key: 'goodAtTool'
        },
        {
          align: 'left',
          title: '擅长业务',
          key: 'goodAtBusiness'
        },
        {
          align: 'center',
          width: 120,
          title: '入职时间',
          key: 'inTime'
        }
      ],
      data: [],
      loading: false,
      totalRecord: 0,
      pageNo: 1,
      pageSize: 20
    }
  },
  methods: {
    handleCreate () {
      this.$router.push({ name: 'org_employee_edit' })
    },
    handleModify () {
      if (this.$refs.dataTable.getSelection().length === 1) {
        this.$router.push({ name: 'org_employee_edit', params: { id: this.$refs.dataTable.getSelection()[0].id } })
      } else {
        this.$Modal.warning({
          title: '警告',
          content: '请选择一条记录！'
        })
      }
    },
    handleView () {
      if (this.$refs.dataTable.getSelection().length === 1) {
        this.$Modal.warning({
          title: '警告',
          content: '此功能暂未实现！'
        })
      } else {
        this.$Modal.warning({
          title: '警告',
          content: '请选择一条记录！'
        })
      }
    },
    handleDelete () {
      if (this.$refs.dataTable.getSelection().length > 0) {
        this.$Modal.confirm({
          title: '确认',
          content: '是否删除此记录？',
          onOk: () => {
            deleteOrgEmployee(this.$refs.dataTable.getSelection()[0].id).then(res => {
              this.loadData()
            })
          }
        })
      } else {
        this.$Modal.warning({
          title: '警告',
          content: '请选择一条记录！'
        })
      }
    },
    handleChangePassword () {
      if (this.$refs.dataTable.getSelection().length === 1) {
        this.$Modal.confirm({
          title: '修改密码',
          render: (h) => {
            return h('Input', {
              props: {
                type: 'password',
                value: this.newPassword,
                autofocus: true,
                placeholder: '请输入新密码'
              },
              on: {
                input: (val) => {
                  this.newPassword = val
                }
              }
            })
          },
          onOk: () => {
            updateOrgEmployeePassowrd(this.$refs.dataTable.getSelection()[0].userId, this.newPassword).then(res => {
              this.$Modal.success({
                title: '成功',
                content: '修改成功！'
              })
            })
          }
        })
      } else {
        this.$Modal.warning({
          title: '警告',
          content: '请选择一条记录！'
        })
      }
    },
    handleQuery () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.loadData()
        } else {
          this.$Modal.warning({
            title: '警告',
            content: '查询条件验证失败！'
          })
        }
      })
    },
    handleReset () {
      this.$refs['formData'].resetFields()
      this.loadData()
    },
    loadDataDict () {
      getDataDictByCode('SEX').then(res => {
        this.dataDicts = res.data
      })
    },
    loadJobDataDict () {
      getDataDictByCode('SB_EMPLOYEE_JOB').then(res => {
        this.jobDataDicts = res.data
      })
    },
    loadTeamList () {
      findOrgTeam({}).then(res => {
        this.teamList = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageOrgEmployee({
        code: this.formData.code,
        name: this.formData.name,
        sex: this.formData.sex,
        mailbox: this.formData.mailbox,
        phone: this.formData.phone,
        job: this.formData.job,
        teamCode: this.formData.teamCode,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        pageSort: 'code',
        pageOrder: 'asc'
      }).then(res => {
        this.data = res.data.dataList
        this.totalRecord = res.data.totalRecord
        this.loading = false
      })
    },
    changeSize (value) {
      this.pageSize = value
      this.$nextTick(() => {
        this.loadData()
      })
    }
  },
  mounted () {
    this.loadDataDict()
    this.loadJobDataDict()
    this.loadTeamList()
    this.loadData()
  }
}
</script>
