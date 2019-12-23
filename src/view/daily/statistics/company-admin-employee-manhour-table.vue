<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        员工工时
        <p slot="content">
        <Form ref="formData" :model="formData" :label-width="80" inline>
          <Row>
            <Col span="8">
              <FormItem label="员工" prop="employeeCodes">
                <Select v-model="formData.employeeCodes" multiple filterable clearable>
                  <Option v-for="(item, index) in employeeList" :value="item.code" :label="item.name" :key="index">
                    <span>{{ item.name }}</span>
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="年份" prop="year">
                <Select v-model="formData.year" filterable clearable>
                  <Option v-for="(item, index) in yearList" :value="item" :label="item" :key="index">
                    <span>{{ item }}</span>
                  </Option>
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
    <Table ref="dataTable" :data="data" :columns="columns" :loading="loading" size="small" stripe border></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalRecord" :current.sync="pageNo" :page-size="pageSize" show-elevator show-sizer show-total @on-change="loadData" @on-page-size-change="changeSize"></Page>
      </div>
    </div>
  </div>
</template>
<script>
import { listOrgEmployee } from '@/api/daily/org-employee'
import { getYearList, pageEmployeeManhour } from '@/api/daily/statistics'
import expandRow from './project-system-item-manhour-table-expand.vue'

export default {
  components: { expandRow },
  data () {
    return {
      collapse: '1',
      employeeList: [],
      yearList: [],
      formData: {
        employeeCodes: [],
        year: ''
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
          title: '员工',
          key: 'employeeName'
        },
        {
          align: 'center',
          title: '年份',
          key: 'year'
        },
        {
          align: 'center',
          title: '一月',
          key: '1',
          render: (h, params) => {
            let text
            for (let index in params.row.monthList) {
              if (params.row.monthList[index].name === '1') {
                text = params.row.monthList[index].minutes
                break
              }
            }
            return h('div', text)
          }
        },
        {
          align: 'right',
          title: '合计',
          key: 'minutes'
        },
        {
          type: 'expand',
          width: 70,
          title: '明细',
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
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
    loadEmployeeList () {
      listOrgEmployee({}).then(res => {
        this.employeeList = res.data
      })
    },
    loadYearList () {
      getYearList().then(res => {
        this.yearList = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageEmployeeManhour({
        employeeCodes: this.formData.employeeCodes,
        year: this.formData.year,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        pageSort: 'code',
        pageOrder: 'asc'
      }).then(res => {
        this.columns.splice(4, this.columns.length - 1 - 4)
        for (let i = 1; i <= 12; i++) {
          this.columns.splice(4 + (i - 1), 0, {
            align: 'center',
            title: i + '月',
            key: 'month_' + i
          })
        }

        for (let index in res.data.dataList) {
          for (let i = 1; i <= 12; i++) {
            let minutes = ''
            for (let m in res.data.dataList[index].monthList) {
              if (res.data.dataList[index].monthList[m].name === ('' + i)) {
                minutes = res.data.dataList[index].monthList[m].minutes
                break
              }
            }
            this.$set(res.data.dataList[index], 'month_' + i, minutes === '' ? 0 : minutes)
          }
        }

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
    this.loadEmployeeList()
    this.loadYearList()
    this.loadData()
  }
}
</script>
