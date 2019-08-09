<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        客户公司列表
        <p slot="content">
        <Form ref="formData" :model="formData" :rules="formRule" :label-width="80" inline>
          <FormItem label="编号" prop="code">
            <Input type="text" v-model="formData.code"></Input>
          </FormItem>
          <FormItem label="名称" prop="name">
            <Input type="text" v-model="formData.name"></Input>
          </FormItem>
          <FormItem label="办公地点" prop="address">
            <Input type="text" v-model="formData.address"></Input>
          </FormItem>
          <FormItem label="服务模式" prop="serviceMode">
            <Select v-model="formData.serviceMode" placeholder="全部" clearable>
              <Option v-for="(item, index) in serviceModeDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
            </Select>
          </FormItem>
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
import { pageCustomerCompany, deleteCustomerCompany } from '@/api/daily/customer-company'

export default {
  data () {
    return {
      collapse: '1',
      serviceModeDataDicts: [],
      formData: {
        code: '',
        name: '',
        address: '',
        serviceMode: ''
      },
      formRule: {
        code: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
        ],
        address: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
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
          align: 'center',
          width: 120,
          title: '服务模式',
          key: 'serviceMode',
          render: (h, params) => {
            let text = ''
            for (let index in this.serviceModeDataDicts) {
              if (params.row.serviceMode === this.serviceModeDataDicts[index].key) {
                text = this.serviceModeDataDicts[index].value
                break
              }
            }
            return h('div', text)
          }
        },
        {
          align: 'center',
          width: 120,
          title: '夏季上班时间',
          key: 'summerOnWorkTime'
        },
        {
          align: 'center',
          width: 120,
          title: '夏季下班时间',
          key: 'summerOffWorkTime'
        },
        {
          align: 'center',
          width: 120,
          title: '冬季上班时间',
          key: 'winterOnWorkTime'
        },
        {
          align: 'center',
          width: 120,
          title: '冬季下班时间',
          key: 'winterOffWorkTime'
        },
        {
          align: 'left',
          title: '办公地点',
          key: 'address'
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
      this.$router.push({ name: 'customer_company_edit' })
    },
    handleModify () {
      if (this.$refs.dataTable.getSelection().length === 1) {
        this.$router.push({ name: 'customer_company_edit', params: { id: this.$refs.dataTable.getSelection()[0].id } })
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
            deleteCustomerCompany(this.$refs.dataTable.getSelection()[0].id).then(res => {
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
    loadServiceModeDataDict () {
      getDataDictByCode('SERVICE_MODE').then(res => {
        this.serviceModeDataDicts = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageCustomerCompany({
        code: this.formData.code,
        name: this.formData.name,
        address: this.formData.address,
        serviceMode: this.formData.serviceMode,
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
    this.loadServiceModeDataDict()
    this.loadData()
  }
}
</script>
