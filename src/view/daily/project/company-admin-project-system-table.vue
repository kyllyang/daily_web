<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        系统列表
        <p slot="content">
          <Form ref="formData" :model="formData" :rules="formRule" :label-width="80" inline>
            <Row>
              <Col span="8">
                <FormItem label="编号" prop="code">
                  <Input type="text" v-model="formData.code"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="名称" prop="name">
                  <Input type="text" v-model="formData.name"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="IT部负责人" prop="customerPrincipalCode">
                  <Select v-model="formData.customerPrincipalCode" filterable clearable>
                    <Option v-for="(item, index) in customerPrincipalList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
                      <span style="float:right;color:#ccc">{{ item.companyName }}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="维护团队" prop="teamCode">
                  <Select v-model="formData.teamCode" filterable clearable>
                    <Option v-for="(item, index) in teamList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
                      <span style="float:right;color:#ccc">{{ item.principalName }}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="状态" prop="status">
                  <Select v-model="formData.status" placeholder="全部" clearable>
                    <Option v-for="(item, index) in statusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
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
import { listCustomerEmployee } from '@/api/daily/customer-employee'
import { listOrgTeam } from '@/api/daily/org-team'
import { pageProjectSystem, deleteProjectSystem } from '@/api/daily/project-system'

export default {
  data () {
    return {
      collapse: '1',
      statusDataDicts: [],
      customerPrincipalList: [],
      teamList: [],
      formData: {
        code: '',
        name: '',
        customerPrincipalCode: '',
        teamCode: '',
        status: ''
      },
      formRule: {
        code: [
          { type: 'string', max: 100, message: '最大长度不能超过100个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', max: 50, message: '最大长度不能超过50个字符', trigger: 'blur' }
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
          title: '名称',
          key: 'name'
        },
        {
          align: 'left',
          width: 120,
          title: 'IT部负责人',
          key: 'customerPrincipalName'
        },
        {
          align: 'center',
          width: 120,
          title: '状态',
          key: 'status',
          render: (h, params) => {
            let text = ''
            for (let index in this.statusDataDicts) {
              if (params.row.status === this.statusDataDicts[index].key) {
                text = this.statusDataDicts[index].value
                break
              }
            }
            return h('div', text)
          }
        },
        {
          align: 'center',
          width: 120,
          title: '上线时间',
          key: 'onTime'
        },
        {
          align: 'center',
          width: 120,
          title: '废弃时间',
          key: 'offTime'
        },
        {
          align: 'left',
          title: '服务公司',
          key: 'companyNameText'
        },
        {
          align: 'left',
          title: '维护团队',
          key: 'teamName'
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
      this.$router.push({ name: 'company_admin_project_system_edit' })
    },
    handleModify () {
      if (this.$refs.dataTable.getSelection().length === 1) {
        this.$router.push({ name: 'company_admin_project_system_edit', params: { id: this.$refs.dataTable.getSelection()[0].id } })
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
            deleteProjectSystem(this.$refs.dataTable.getSelection()[0].id).then(res => {
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
    loadStatusDataDict () {
      getDataDictByCode('SYSTEM_STATUS').then(res => {
        this.statusDataDicts = res.data
      })
    },
    loadCustomerPrincipalList () {
      listCustomerEmployee().then(res => {
        this.customerPrincipalList = res.data
      })
    },
    loadTeamList () {
      listOrgTeam().then(res => {
        this.teamList = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageProjectSystem({
        code: this.formData.code,
        name: this.formData.name,
        customerPrincipalCode: this.formData.customerPrincipalCode,
        teamCode: this.formData.teamCode,
        status: this.formData.status,
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
    this.loadStatusDataDict()
    this.loadCustomerPrincipalList()
    this.loadTeamList()
    this.loadData()
  }
}
</script>
