<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        日报审核列表
        <p slot="content">
          <Form ref="formData" :model="formData" :rules="formRule" :label-width="80" inline>
            <Row>
              <Col span="8">
                <FormItem label="员工姓名" prop="employeeCode">
                  <Select v-model="formData.employeeCode" filterable clearable>
                    <Option v-for="(item, index) in employeeList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="日期" prop="workDate">
                  <DatePicker :value="formData.workDate" format="yyyy-MM-dd" type="daterange" @on-change="getWorkDateTime" show-week-numbers></DatePicker>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="项目名称" prop="systemItemCode">
                  <Select v-model="formData.systemItemCode" filterable clearable>
                    <Option v-for="(item, index) in systemItemList" :value="item.code" :label="item.name" :key="index">
                      <span>{{ item.name }}</span>
                      <span style="float:right;color:#ccc">{{ item.systemName }}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="模块名称" prop="moduleName">
                  <Input type="text" v-model="formData.moduleName"></Input>
                </FormItem>
              </Col>
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
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="状态" prop="status">
                  <Select v-model="formData.status" placeholder="全部" clearable>
                    <Option v-for="(item, index) in statusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
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
      <Button type="primary" @click="handlePass()">
        <Icon type="md-checkmark" />
        通过
      </Button>
      <Button type="primary" @click="handleReject()">
        <Icon type="md-close" />
        驳回
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
import { getDataDictByCode, getDataDictByCodeForChildren } from '@/api/daily/evo-datadict'
import { listOrgEmployee } from '@/api/daily/org-employee'
import { listProjectSystemItem } from '@/api/daily/project-system-item'
import { pageAuditWorklogDailyRecord, auditWorklogDailyRecord } from '@/api/daily/worklog-daily-record'
import expandRow from './audit-worklog-daily-record-table-expand.vue'
import IMG_WDRS0001 from '@/assets/images/daily/WDRS0001.png'
import IMG_WDRS0002 from '@/assets/images/daily/WDRS0002.png'
import IMG_WDRS0003 from '@/assets/images/daily/WDRS0003.png'
import IMG_WDCD0001 from '@/assets/images/daily/WDCD0001.png'
import IMG_WDCD0002 from '@/assets/images/daily/WDCD0002.png'
import IMG_WDCD0003 from '@/assets/images/daily/WDCD0003.png'

export default {
  components: { expandRow },
  data () {
    return {
      collapse: '1',
      taskCategoryDataDicts: [],
      employeeList: [],
      systemItemList: [],
      statusDataDicts: [],
      comment: '',
      formData: {
        employeeCode: '',
        workDate: '',
        systemItemCode: '',
        moduleName: '',
        taskCategory: '',
        remark: '',
        status: 'WDRS0001'
      },
      formRule: {
        moduleName: [
          { type: 'string', max: 20, message: '最大长度不能超过20个字符', trigger: 'blur' }
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
          title: '员工姓名',
          key: 'employeeName'
        },
        {
          align: 'center',
          title: '日期',
          key: 'workDate'
        },
        {
          align: 'right',
          title: '工作用时',
          key: 'minutes',
          render: (h, params) => {
            let text = Math.floor(params.row.minutes / 60) + '小时'
            let minutes = params.row.minutes % 60
            if (minutes > 0) {
              text += minutes + '分钟'
            }
            return h('div', text)
          }
        },
        {
          align: 'center',
          title: '完成度',
          key: 'minutes',
          render: (h, params) => {
            return h('img', {
              props: {
                type: 'primary',
                size: 'small'
              },
              attrs: {
                src: params.row.minutes > 480 ? IMG_WDCD0003 : (params.row.minutes < 480 ? IMG_WDCD0001 : IMG_WDCD0002), style: 'width: 24px; height: 24px;'
              }
            })
          }
        },
        {
          align: 'center',
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
    handlePass () {
      if (this.$refs.dataTable.getSelection().length > 0) {
        this.$Modal.confirm({
          title: '请填写审批意见',
          render: (h) => {
            if (this.$refs.dataTable.getSelection().length === 0) {
              return ''
            }

            this.comment = '同意'

            return h('Input', {
              props: {
                maxlength: 100,
                type: 'textarea',
                value: this.comment
              },
              on: {
                input: (value) => {
                  this.comment = value
                }
              }
            })
          },
          onOk: () => {
            let ids = []
            for (let index in this.$refs.dataTable.getSelection()) {
              ids = ids.concat(this.$refs.dataTable.getSelection()[index].ids.split(','))
            }

            auditWorklogDailyRecord(ids, 'WDRS0002', this.comment).then(res => {
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
    handleReject () {
      if (this.$refs.dataTable.getSelection().length > 0) {
        this.$Modal.confirm({
          title: '请填写审批意见',
          render: (h) => {
            if (this.$refs.dataTable.getSelection().length === 0) {
              return ''
            }

            this.comment = '又喺乱写！吔屎啦你！'

            return h('Input', {
              props: {
                maxlength: 100,
                type: 'textarea',
                value: this.comment
              },
              on: {
                input: (value) => {
                  this.comment = value
                }
              }
            })
          },
          onOk: () => {
            let ids = []
            for (let index in this.$refs.dataTable.getSelection()) {
              ids = ids.concat(this.$refs.dataTable.getSelection()[index].ids.split(','))
            }

            auditWorklogDailyRecord(ids, 'WDRS0003', this.comment).then(res => {
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
    loadEmployeeList () {
      listOrgEmployee().then(res => {
        this.employeeList = res.data
      })
    },
    loadSystemItemList () {
      listProjectSystemItem().then(res => {
        this.systemItemList = res.data
      })
    },
    loadStatusDataDict () {
      getDataDictByCode('WORKLOG_DAILY_RECORD_STATUS').then(res => {
        this.statusDataDicts = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageAuditWorklogDailyRecord({
        employeeCode: this.formData.employeeCode,
        startWorkDate: this.formData.workDate[0],
        endWorkDate: this.formData.workDate[1],
        systemItemCode: this.formData.systemItemCode,
        moduleName: this.formData.moduleName,
        taskCategory: this.formData.taskCategory,
        remark: this.formData.remark,
        status: this.formData.status,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        pageSort: 'code',
        pageOrder: 'asc'
      }).then(res => {
        for (let aindex in res.data.dataList) {
          for (let eindex in res.data.dataList[aindex].expandList) {
            let text = ''
            for (let findex in this.taskCategoryDataDicts) {
              for (let sindex in this.taskCategoryDataDicts[findex].children) {
                if (res.data.dataList[aindex].expandList[eindex].taskCategory === this.taskCategoryDataDicts[findex].children[sindex].value) {
                  text = this.taskCategoryDataDicts[findex].label + '/' + this.taskCategoryDataDicts[findex].children[sindex].label
                  break
                }
              }
              if (text !== '') {
                break
              }
            }

            this.$set(res.data.dataList[aindex].expandList[eindex], 'taskCategoryText', text)
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
    this.loadTaskCategoryDataDicts()
    this.loadEmployeeList()
    this.loadSystemItemList()
    this.loadStatusDataDict()
    this.loadData()
  }
}
</script>
