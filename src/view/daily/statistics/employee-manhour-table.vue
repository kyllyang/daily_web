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
import { getYearList } from '@/api/daily/worklog-daily-record'
import { pageEmployeeManhour } from '@/api/daily/statistics'
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
          align: 'right',
          title: '一月',
          key: 'month1'
        },
        {
          align: 'right',
          title: '二月',
          key: 'month2'
        },
        {
          align: 'right',
          title: '三月',
          key: 'month3'
        },
        {
          align: 'right',
          title: '四月',
          key: 'month4'
        },
        {
          align: 'right',
          title: '五月',
          key: 'month5'
        },
        {
          align: 'right',
          title: '六月',
          key: 'month6'
        },
        {
          align: 'right',
          title: '七月',
          key: 'month7'
        },
        {
          align: 'right',
          title: '八月',
          key: 'month8'
        },
        {
          align: 'right',
          title: '九月',
          key: 'month9'
        },
        {
          align: 'right',
          title: '十月',
          key: 'month10'
        },
        {
          align: 'right',
          title: '十一月',
          key: 'month11'
        },
        {
          align: 'right',
          title: '十二月',
          key: 'month12'
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
