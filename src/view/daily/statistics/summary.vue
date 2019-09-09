<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        日报汇总
        <p slot="content">
          <Form ref="formData" :model="formData" :label-width="80" inline>
            <Row>
              <Col span="8">
                <FormItem label="员工" prop="employeeCode">
                  <Select v-model="formData.employeeCodes" multiple filterable clearable>
                    <Option v-for="(item, index) in employeeList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="团队" prop="teamCodes">
                  <Select v-model="formData.teamCodes" multiple filterable clearable>
                    <Option v-for="(item, index) in teamList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
                      <span style="float:right;color:#ccc">{{ item.principalName }}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="日期" prop="workDate">
                  <DatePicker :value="formData.workDate" format="yyyy-MM-dd" type="daterange" @on-change="getWorkDateTime" show-week-numbers></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="最小分钟数" prop="startMinute">
                  <InputNumber v-model="formData.startMinute" :min="0" :max="1440" :step="10"></InputNumber>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="最大分钟数" prop="endMinute">
                  <InputNumber v-model="formData.endMinute" :min="0" :max="1440" :step="10"></InputNumber>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="分页依据" prop="pageBase">
                  <RadioGroup v-model="formData.pageBase">
                    <Radio label="employee">员工</Radio>
                    <Radio label="date">日期</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="6">
                <FormItem label="正常8小时" prop="markNormal">
                  <i-switch v-model="formData.markNormal" @on-change="handleMarkNormal"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="不足8小时" prop="markResidue">
                  <i-switch v-model="formData.markResidue" @on-change="handleMarkResidue"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="超过8小时" prop="markOverTime">
                  <i-switch v-model="formData.markOverTime" @on-change="handleMarkOverTime"/>
                </FormItem>
              </Col>
              <Col span="6">
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
      <Button type="primary" @click="handleExport()">
        <Icon type="ios-add" />
        导出
      </Button>
    </ButtonGroup>
    <br/>
    <br/>
    <Table ref="dataTable" :data="data" :columns="columns" :loading="loading" size="small" border></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalRecord" :current.sync="pageNo" :page-size="pageSize" show-elevator show-sizer show-total @on-change="loadData" @on-page-size-change="changeSize"></Page>
      </div>
    </div>
  </div>
</template>
<script>
import { listOrgEmployee } from '@/api/daily/org-employee'
import { listOrgTeam } from '@/api/daily/org-team'
import { formatDate, addDate } from '@/libs/util'
import { pageStatisticsSummary } from '@/api/daily/statistics'

export default {
  data () {
    return {
      collapse: '1',
      employeeList: [],
      teamList: [],
      formData: {
        employeeCodes: [],
        teamCodes: [],
        workDate: [formatDate(addDate(new Date(), -30)), formatDate(new Date())],
        startMinute: null,
        endMinute: null,
        pageBase: 'employee',
        markNormal: false,
        markResidue: false,
        markOverTime: false
      },
      columns: [
        {
          type: 'selection',
          fixed: 'left',
          align: 'center',
          width: 60,
          key: 'id'
        },
        {
          type: 'index',
          fixed: 'left',
          align: 'center',
          width: 70,
          title: '序号',
          key: 'id',
          indexMethod: (row) => {
            return (row._index + 1) + (this.pageSize * this.pageNo) - this.pageSize
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
    handleMarkNormal (status) {
      this.handleMark(status, this.formData.markResidue, this.formData.markOverTime)
    },
    handleMarkResidue (status) {
      this.handleMark(this.formData.markNormal, status, this.formData.markOverTime)
    },
    handleMarkOverTime (status) {
      this.handleMark(this.formData.markNormal, this.formData.markResidue, status)
    },
    handleMark (statusNormal, statusResidue, statusOverTime) {
      for (let i in this.data) {
        let ccn = {}
        for (let j in this.data[i]) {
          if (this.formData.pageBase === 'employee') {
            if (j !== 'employeeCode' && j !== 'employeeName') {
              if (statusNormal && this.data[i][j] === 480) {
                this.$set(ccn, j, statusNormal ? 'table-info-cell-markNormal' : '')
              } else if (statusResidue && this.data[i][j] && this.data[i][j] < 480) {
                this.$set(ccn, j, statusResidue ? 'table-info-cell-markResidue' : '')
              } else if (statusOverTime && this.data[i][j] > 480) {
                this.$set(ccn, j, statusOverTime ? 'table-info-cell-markOverTime' : '')
              }
            }
          } else {
            if (j !== 'workDate') {
              if (statusNormal && this.data[i][j] === 480) {
                this.$set(ccn, j, statusNormal ? 'table-info-cell-markNormal' : '')
              } else if (statusResidue && this.data[i][j] && this.data[i][j] < 480) {
                this.$set(ccn, j, statusResidue ? 'table-info-cell-markResidue' : '')
              } else if (statusOverTime && this.data[i][j] > 480) {
                this.$set(ccn, j, statusOverTime ? 'table-info-cell-markOverTime' : '')
              }
            }
          }
        }
        this.$set(this.data[i], 'cellClassName', ccn)
      }
    },
    handleExport () {
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
    getWorkDateTime (time) {
      this.formData.workDate = time
    },
    loadEmployeeList () {
      listOrgEmployee().then(res => {
        this.employeeList = res.data
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

      pageStatisticsSummary({
        employeeCodes: this.formData.employeeCodes,
        teamCodes: this.formData.teamCodes,
        startWorkDate: this.formData.workDate[0],
        endWorkDate: this.formData.workDate[1],
        startMinute: this.formData.startMinute,
        endMinute: this.formData.endMinute,
        pageBase: this.formData.pageBase,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        pageSort: 'code',
        pageOrder: 'asc'
      }).then(res => {
        this.columns.splice(2, this.columns.length - 2)
        if (this.formData.pageBase === 'employee') {
          this.columns.push({
            fixed: 'left',
            align: 'left',
            width: 100,
            title: '员工',
            key: 'employeeName'
          })
        } else {
          this.columns.push({
            fixed: 'left',
            align: 'left',
            width: 100,
            title: '日期',
            key: 'workDate'
          })
        }
        for (let index in res.data.columns) {
          this.columns.push({
            align: 'center',
            width: 100,
            title: res.data.columns[index].title,
            key: res.data.columns[index].key
          })
        }
        this.data = res.data.pageList.dataList
        this.totalRecord = res.data.pageList.totalRecord
        this.loading = false
        this.handleMark(this.formData.markNormal, this.formData.markResidue, this.formData.markOverTime)
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
    this.loadTeamList()
    this.loadData()
  }
}
</script>
<style>
  .ivu-table .table-info-cell-markNormal {
    background-color: #99CCFF;
  }
  .ivu-table .table-info-cell-markResidue {
    background-color: #FFCC33;
  }
  .ivu-table .table-info-cell-markOverTime {
    background-color: #99CC33;
  }
</style>
