<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        日报列表
        <p slot="content">
          <Form ref="formData" :model="formData" :rules="formRule" :label-width="80" inline>
            <Row>
              <Col span="8">
                <FormItem label="员工姓名" prop="employeeCodes">
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
                <FormItem label="系统名称" prop="systemCodes">
                  <Select v-model="formData.systemCodes" multiple filterable clearable>
                    <Option v-for="(item, index) in systemList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="项目名称" prop="systemItemCode">
                  <Select v-model="formData.systemItemCode" multiple filterable clearable>
                    <Option v-for="(item, index) in systemItemList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
                      <span style="float:right;color:#ccc">{{ item.systemName }}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="模块名称" prop="moduleName">
                  <Input type="text" v-model="formData.moduleName"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="任务分类" prop="taskCategory">
                  <Cascader :data="taskCategoryDataDicts" trigger="hover" change-on-select></Cascader>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="备注" prop="remark">
                  <Input type="text" v-model="formData.remark"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="状态" prop="status">
                  <Select v-model="formData.status" placeholder="全部" clearable>
                    <Option v-for="(item, index) in statusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8" offset="16">
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
      <Button type="primary" @click="handleExportExcel()" style="margin-left: 8px">
        <Icon type="md-download"/>
        导出Excel
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
import { getDataDictByCode, getDataDictByCodeForChildren } from '@/api/daily/evo-sys'
import { listOrgEmployee } from '@/api/daily/org-employee'
import { listOrgTeam } from '@/api/daily/org-team'
import { listProjectSystem } from '@/api/daily/project-system'
import { listProjectSystemItem } from '@/api/daily/project-system-item'
import { pageWorklogDailyRecord, deleteWorklogDailyRecord, exportExcelWorklogDailyRecord } from '@/api/daily/worklog-daily-record'
import { newDate, toMinutesText } from '@/libs/util'
import IMG_WDRS0001 from '@/assets/images/daily/WDRS0001.png'
import IMG_WDRS0002 from '@/assets/images/daily/WDRS0002.png'
import IMG_WDRS0003 from '@/assets/images/daily/WDRS0003.png'

export default {
  data () {
    return {
      collapse: '1',
      taskCategoryDataDicts: [],
      statusDataDicts: [],
      employeeList: [],
      teamList: [],
      systemList: [],
      systemItemList: [],
      formData: {
        employeeCodes: [],
        teamCodes: [],
        workDate: [newDate(new Date().getFullYear() + '-' + new Date().getMonth() + '-1'), new Date()],
        systemCodes: [],
        systemItemCodes: [],
        moduleName: '',
        taskCategory: '',
        remark: '',
        status: '',
        fileName: '日报明细'
      },
      formRule: {
        moduleName: [
          { type: 'string', max: 100, message: '最大长度不能超过100个字符', trigger: 'blur' }
        ],
        remark: [
          { type: 'string', max: 100, message: '最大长度不能超过100个字符', trigger: 'blur' }
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
          title: '员工姓名',
          key: 'employeeName'
        },
        {
          align: 'left',
          width: 120,
          title: '所属团队',
          key: 'teamNameText'
        },
        {
          align: 'left',
          width: 120,
          title: '日期',
          key: 'workDate'
        },
        {
          align: 'left',
          width: 120,
          title: '系统名称',
          key: 'systemName'
        },
        {
          align: 'left',
          width: 120,
          title: '项目名称',
          key: 'systemItemName'
        },
        {
          align: 'left',
          width: 120,
          title: '模块名称',
          key: 'moduleName'
        },
        {
          align: 'left',
          width: 120,
          title: '任务分类',
          key: 'taskCategory',
          render: (h, params) => {
            let text = ''
            for (let findex in this.taskCategoryDataDicts) {
              for (let sindex in this.taskCategoryDataDicts[findex].children) {
                if (params.row.taskCategory === this.taskCategoryDataDicts[findex].children[sindex].value) {
                  text = this.taskCategoryDataDicts[findex].label + '/' + this.taskCategoryDataDicts[findex].children[sindex].label
                  break
                }
              }
              if (text !== '') {
                break
              }
            }
            return h('div', text)
          }
        },
        {
          align: 'center',
          width: 120,
          title: '开始时间',
          key: 'startTime'
        },
        {
          align: 'center',
          width: 120,
          title: '结束时间',
          key: 'endTime'
        },
        {
          align: 'center',
          width: 120,
          title: '工时',
          key: 'minutes',
          render: (h, params) => {
            return h('div', toMinutesText(params.row.minutes))
          }
        },
        {
          align: 'left',
          title: '备注',
          key: 'remark'
        },
        {
          align: 'center',
          width: 100,
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return h('img', {
              props: {
                type: 'primary',
                size: 'small'
              },
              attrs: {
                src: params.row.status === 'WDRS0001' ? IMG_WDRS0001 : (params.row.status === 'WDRS0002' ? IMG_WDRS0002 : IMG_WDRS0003), style: 'width: 24px; height: 24px;'
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
    handleCreate () {
      this.$router.push({ name: 'worklog_daily_record_edit' })
    },
    handleModify () {
      if (this.$refs.dataTable.getSelection().length === 1) {
        this.$router.push({ name: 'worklog_daily_record_edit', params: { id: this.$refs.dataTable.getSelection()[0].id } })
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
            deleteWorklogDailyRecord(this.$refs.dataTable.getSelection()[0].id).then(res => {
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
    handleExportExcel () {
      if (this.loading) return
      this.loading = true

      exportExcelWorklogDailyRecord({
        employeeCodes: this.formData.employeeCodes,
        teamCodes: this.formData.teamCodes,
        startWorkDate: this.formData.workDate[0],
        endWorkDate: this.formData.workDate[1],
        systemCodes: this.formData.systemCodes,
        systemItemCodes: this.formData.systemItemCodes,
        moduleName: this.formData.moduleName,
        taskCategory: this.formData.taskCategory,
        remark: this.formData.remark,
        status: this.formData.status,
        fileName: this.formData.fileName,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        pageSort: 'code',
        pageOrder: 'asc'
      }).then(res => {
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = this.formData.fileName + '.xlsx'
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)

        this.loading = false
      })
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
    loadTaskCategoryDataDicts () {
      getDataDictByCodeForChildren('TASK_FIRST_CATEGORY').then(res => {
        const dataList = []
        for (let findex in res.data) {
          const cdtatList = []
          for (let sindex in res.data[findex].children) {
            cdtatList.push({
              value: res.data[findex].children[sindex].key,
              label: res.data[findex].children[sindex].value
            })
          }
          dataList.push({
            value: res.data[findex].key,
            label: res.data[findex].value,
            children: cdtatList
          })
        }
        this.taskCategoryDataDicts = dataList
      })
    },
    loadStatusDataDict () {
      getDataDictByCode('WORKLOG_DAILY_RECORD_STATUS').then(res => {
        this.statusDataDicts = res.data
      })
    },
    loadEmployeeList () {
      listOrgEmployee({}).then(res => {
        this.employeeList = res.data
      })
    },
    loadTeamList () {
      listOrgTeam({}).then(res => {
        this.teamList = res.data
      })
    },
    loadSystemList () {
      listProjectSystem({}).then(res => {
        this.systemList = res.data
      })
    },
    loadSystemItemList () {
      listProjectSystemItem({ includeTakePartIn: true }).then(res => {
        this.systemItemList = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageWorklogDailyRecord({
        employeeCodes: this.formData.employeeCodes,
        teamCodes: this.formData.teamCodes,
        startWorkDate: this.formData.workDate[0],
        endWorkDate: this.formData.workDate[1],
        systemCodes: this.formData.systemCodes,
        systemItemCodes: this.formData.systemItemCodes,
        moduleName: this.formData.moduleName,
        taskCategory: this.formData.taskCategory,
        remark: this.formData.remark,
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
    this.loadTaskCategoryDataDicts()
    this.loadStatusDataDict()
    this.loadEmployeeList()
    this.loadTeamList()
    this.loadSystemList()
    this.loadSystemItemList()
    this.loadData()
  }
}
</script>
