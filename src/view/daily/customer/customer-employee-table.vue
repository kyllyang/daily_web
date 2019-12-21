<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        客户员工列表
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
                <FormItem label="职位" prop="job">
                  <Input type="text" v-model="formData.job"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="所属公司" prop="companyCode">
                  <Select v-model="formData.companyCode">
                    <Option v-for="(item, index) in companyList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
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
import { listCustomerCompany } from '@/api/daily/customer-company'
import { pageCustomerEmployee, deleteCustomerEmployee } from '@/api/daily/customer-employee'

export default {
  data () {
    return {
      collapse: '1',
      companyList: [],
      formData: {
        code: '',
        name: '',
        job: '',
        companyCode: ''
      },
      formRule: {
        code: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
        ],
        job: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
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
          align: 'left',
          width: 120,
          title: '职位',
          key: 'job'
        },
        {
          align: 'left',
          title: '所属公司',
          key: 'companyName'
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
      this.$router.push({ name: 'customer_employee_edit' })
    },
    handleModify () {
      if (this.$refs.dataTable.getSelection().length === 1) {
        this.$router.push({ name: 'customer_employee_edit', params: { id: this.$refs.dataTable.getSelection()[0].id } })
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
            deleteCustomerEmployee(this.$refs.dataTable.getSelection()[0].id).then(res => {
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
    loadCompanyList () {
      listCustomerCompany({}).then(res => {
        this.companyList = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageCustomerEmployee({
        code: this.formData.code,
        name: this.formData.name,
        job: this.formData.job,
        companyCode: this.formData.companyCode,
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
    this.loadCompanyList()
    this.loadData()
  }
}
</script>
