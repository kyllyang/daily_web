<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        项目列表
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
              <FormItem label="所属系统" prop="systemCode">
                <Select v-model="formData.systemCode" filterable clearable>
                  <Option v-for="(item, index) in systemList" :value="item.code" :label="item.name" :key="index">
                    <span>{{ item.name }}</span>
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="提出部门" prop="fromDepartment">
                <Input type="text" v-model="formData.fromDepartment"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="项目负责人" prop="principalCode">
                <Select v-model="formData.principalCode" placeholder="全部" filterable clearable>
                  <Option v-for="(item, index) in orgEmployeeList" :value="item.code" :label="item.name" :key="index">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="团队负责人" prop="teamPrincipalCode">
                <Select v-model="formData.teamPrincipalCode" placeholder="全部" filterable clearable>
                  <Option v-for="(item, index) in orgEmployeeList" :value="item.code" :label="item.name" :key="index">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="是否上线" prop="onlineStatus">
                <Select v-model="formData.onlineStatus" placeholder="全部" clearable>
                  <Option v-for="(item, index) in onlineStatusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="项目状态" prop="projectStatus">
                <Select v-model="formData.projectStatus" placeholder="全部" clearable>
                  <Option v-for="(item, index) in projectStatusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
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
import { listOrgEmployee } from '@/api/daily/org-employee'
import { listProjectSystem } from '@/api/daily/project-system'
import { pageProjectSystemItem, deleteProjectSystemItem } from '@/api/daily/project-system-item'

export default {
  data () {
    return {
      collapse: '1',
      onlineStatusDataDicts: [],
      projectStatusDataDicts: [],
      systemList: [],
      orgEmployeeList: [],
      formData: {
        code: '',
        name: '',
        systemCode: '',
        principalCode: '',
        teamPrincipalCode: '',
        fromDepartment: '',
        onlineStatus: '',
        projectStatus: ''
      },
      formRule: {
        code: [
          { type: 'string', max: 100, message: '最大长度不能超过100个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', max: 50, message: '最大长度不能超过50个字符', trigger: 'blur' }
        ],
        fromDepartment: [
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
          title: '所属系统',
          key: 'systemName'
        },
        {
          align: 'left',
          width: 120,
          title: '项目负责人',
          key: 'principalName'
        },
        {
          align: 'left',
          width: 120,
          title: '团队负责人',
          key: 'teamPrincipalName'
        },
        {
          align: 'left',
          title: '提出部门',
          key: 'fromDepartment'
        },
        {
          align: 'center',
          width: 120,
          title: '是否上线',
          key: 'onlineStatus',
          render: (h, params) => {
            let text = ''
            for (let index in this.onlineStatusDataDicts) {
              if (params.row.onlineStatus === this.onlineStatusDataDicts[index].key) {
                text = this.onlineStatusDataDicts[index].value
                break
              }
            }
            return h('div', text)
          }
        },
        {
          align: 'center',
          width: 120,
          title: '项目状态',
          key: 'projectStatus',
          render: (h, params) => {
            let text = ''
            for (let index in this.projectStatusDataDicts) {
              if (params.row.projectStatus === this.projectStatusDataDicts[index].key) {
                text = this.projectStatusDataDicts[index].value
                break
              }
            }
            return h('div', text)
          }
        },
        {
          align: 'center',
          width: 120,
          title: '计划上线时间',
          key: 'planOnlineDate'
        },
        {
          align: 'center',
          width: 120,
          title: '实际上线时间',
          key: 'realOnlineDate'
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
      this.$router.push({ name: 'company_admin_project_system_item_edit' })
    },
    handleModify () {
      if (this.$refs.dataTable.getSelection().length === 1) {
        this.$router.push({ name: 'company_admin_project_system_item_edit', params: { id: this.$refs.dataTable.getSelection()[0].id } })
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
            deleteProjectSystemItem(this.$refs.dataTable.getSelection()[0].id).then(res => {
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
    loadSystemList () {
      listProjectSystem().then(res => {
        this.systemList = res.data
      })
    },
    loadOrgEmployeeList () {
      listOrgEmployee().then(res => {
        this.orgEmployeeList = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageProjectSystemItem({
        code: this.formData.code,
        name: this.formData.name,
        systemCode: this.formData.systemCode,
        principalCode: this.formData.principalCode,
        teamPrincipalCode: this.formData.teamPrincipalCode,
        fromDepartment: this.formData.fromDepartment,
        onlineStatus: this.formData.onlineStatus,
        projectStatus: this.formData.projectStatus,
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
    this.loadOnlineStatusDataDict()
    this.loadProjectStatusDataDict()
    this.loadSystemList()
    this.loadOrgEmployeeList()
    this.loadData()
  }
}
</script>
