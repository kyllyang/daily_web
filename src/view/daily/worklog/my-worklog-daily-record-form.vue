<template>
  <Form ref="formData" :model="formData" :rules="formRule" :label-width="100">
    <Row>
      <Col span="12">
        <FormItem label="当前日期" prop="workDate">
          <DatePicker :value="formData.workDate" format="yyyy-MM-dd" type="date" :clearable="false" @on-change="getWorkDateTime"></DatePicker>
          <ButtonGroup style="margin-left: 8px">
            <Button type="primary" @click="handlePrevWorkDate()">
              <Icon type="ios-arrow-back"></Icon>
            </Button>
            <Button type="primary" @click="handleNextWorkDate()">
              <Icon type="ios-arrow-forward"></Icon>
            </Button>
          </ButtonGroup>
        </FormItem>
      </Col>
      <Col span="12" align="right">
        <Tag type="dot" color="primary">已填写{{ filledMinute }}分钟</Tag>
        <Tag type="dot" color="success">剩余{{ residueMinute }}分钟</Tag>
        <!--<Tag type="dot" color="error">加班{{ overTimeMinute }}分钟</Tag>-->
        <!--<Tag type="dot" color="warning">空闲{{ freeMinute }}分钟</Tag>-->
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="项目名称" prop="systemItemCode">
          <Select v-model="formData.systemItemCode" filterable clearable>
            <Option v-for="(item, index) in systemItemList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
              <span style="float:right;color:#ccc">{{ item.systemName }}</span>
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="模块名称" prop="moduleName">
          <Input type="text" v-model="formData.moduleName"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="任务分类" prop="taskCategorys">
          <Cascader v-model="formData.taskCategorys" :data="taskCategoryDataDicts" trigger="hover"></Cascader>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="工作时间" prop="workTimes">
          <TimePicker type="timerange" format="HH:mm" v-model="formData.workTimes" :clearable="false"></TimePicker>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="备注" prop="remark">
          <Input type="textarea" :rows="4" v-model="formData.remark"></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem>
      <Button type="primary" @click="handleSubmit()">{{ submitText }}</Button>
    </FormItem>
    <Table ref="dataTable" :data="data" :columns="columns" :loading="loading" size="small" stripe border></Table>
  </Form>
</template>
<script>
import { mapMutations } from 'vuex'
import { listProjectSystemItem } from '@/api/daily/project-system-item'
import { getDataDictByCodeForChildren } from '@/api/daily/evo-sys'
import { pageWorklogDailyRecordSelfStatistics, checkByBackend, createWorklogDailyRecord, updateWorklogDailyRecord, getWorklogDailyRecord, deleteWorklogDailyRecord } from '@/api/daily/worklog-daily-record'
import { formatDate, newDate, addHour, addDate } from '@/libs/util'

export default {
  data () {
    const workDateValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    const taskCategorysValidator = (rule, value, callback) => {
      if (value[0] === '' || value[1] === '') {
        callback(new Error('不能为空'))
      } else if (value.length < 2) {
        callback(new Error('必须同时选择任务大类和任务小类'))
      } else {
        callback()
      }
    }
    const workTimesValidator = (rule, value, callback) => {
      if (value[0] === '' || value[1] === '') {
        callback(new Error('不能为空'))
      } else if (value[0] === value[1]) {
        callback(new Error('开始时间不能等于结束时间'))
      } else {
        callback()
      }
    }

    return {
      filledMinute: 0,
      residueMinute: 0,
      overTimeMinute: 0,
      freeMinute: 0,
      taskCategoryDataDicts: [],
      systemItemList: [],
      submitText: '新增',
      formData: {
        id: null,
        employeeCode: this.$store.state.user.employeeCode,
        workDate: formatDate(new Date()),
        systemItemCode: '',
        moduleName: '',
        taskCategory: '',
        startTime: '',
        endTime: '',
        remark: '',
        taskCategorys: [],
        workTimes: ['08:00', '09:00']
      },
      formRule: {
        workDate: [
          { type: 'string', required: true, validator: workDateValidator, trigger: 'blur' }
        ],
        systemItemCode: [
          { type: 'string', required: true, message: '不能为空', trigger: 'blur' }
        ],
        moduleName: [
          { type: 'string', required: true, max: 100, message: '不能为空，且最大长度不能超过100个字符', trigger: 'blur' }
        ],
        taskCategorys: [
          { type: 'array', required: true, trigger: 'blur' },
          { type: 'string', validator: taskCategorysValidator, trigger: 'blur' }
        ],
        workTimes: [
          { type: 'array', required: true, trigger: 'blur' },
          { type: 'string', validator: workTimesValidator, trigger: 'blur' }
        ],
        remark: [
          { type: 'string', required: true, max: 100, message: '不能为空，且最大长度不能超过100个字符', trigger: 'blur' }
        ]
      },
      columns: [
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
          width: 200,
          title: '系统名称',
          key: 'systemName'
        },
        {
          align: 'left',
          width: 200,
          title: '项目名称',
          key: 'systemItemName'
        },
        {
          align: 'left',
          width: 200,
          title: '模块名称',
          key: 'moduleName'
        },
        {
          align: 'left',
          width: 150,
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
          align: 'left',
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.handleModify(params.row.id)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row.id)
                  }
                }
              }, '删除')
            ])
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
    ...mapMutations([
      'closeTag'
    ]),
    getWorkDateTime (time) {
      this.formData.workDate = time
      this.formData.id = null
      this.loadData()
    },
    loadTaskCategoryDataDicts () {
      getDataDictByCodeForChildren('TASK_FIRST_CATEGORY').then(res => {
        let dataList = []
        for (let findex in res.data) {
          let cdtatList = []
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
    loadSystemItemList () {
      listProjectSystemItem().then(res => {
        this.systemItemList = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageWorklogDailyRecordSelfStatistics({
        employeeCode: this.formData.employeeCode,
        currentWorkDate: this.formData.workDate,
        pageNo: 1,
        pageSize: 65535,
        pageSort: 'code',
        pageOrder: 'asc'
      }).then(res => {
        this.data = res.data.pageList.dataList
        this.totalRecord = res.data.pageList.totalRecord
        this.filledMinute = res.data.filledMinute
        this.residueMinute = res.data.residueMinute
        this.overTimeMinute = res.data.overTimeMinute
        this.freeMinute = res.data.freeMinute
        this.loading = false
      })
    },
    loadForm (id) {
      getWorklogDailyRecord(id).then(res => {
        this.formData = res.data
      })
    },
    handlePrevWorkDate () {
      this.formData.workDate = formatDate(addDate(newDate(this.formData.workDate), -1))
      this.formData.id = null
      this.formData.workTimes = ['08:00', '09:00']
      this.loadData()
    },
    handleNextWorkDate () {
      this.formData.workDate = formatDate(addDate(newDate(this.formData.workDate), 1))
      this.formData.id = null
      this.formData.workTimes = ['08:00', '09:00']
      this.loadData()
    },
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.formData.taskCategory = this.formData.taskCategorys[1]
          this.formData.startTime = this.formData.workTimes[0]
          this.formData.endTime = this.formData.workTimes[1]

          checkByBackend(this.formData).then(res => {
            if (this.formData.id) {
              updateWorklogDailyRecord(this.formData).then(res => {
                this.$Modal.success({
                  title: '成功',
                  content: '保存成功！',
                  onOk: () => {
                    this.loadData()

                    this.formData.id = null
                    this.submitText = '新增'
                  }
                })
              }).catch(err => {
                this.$Modal.error({
                  title: '错误',
                  content: '保存失败！<br/>' + err.response.status + ':' + err.response.data.code + ':' + err.response.data.message
                })
              })
            } else {
              createWorklogDailyRecord(this.formData).then(res => {
                this.$Modal.success({
                  title: '成功',
                  content: '保存成功！',
                  onOk: () => {
                    this.loadData()

                    let startTime = this.formData.workTimes[1]
                    let endTime = addHour(this.formData.workTimes[1], 1)

                    if (startTime === '12:00') {
                      startTime = addHour(startTime, 1)
                      endTime = addHour(startTime, 1)
                    }

                    this.formData.workTimes = [startTime, endTime]

                    this.submitText = '新增'
                  }
                })
              }).catch(err => {
                this.$Modal.error({
                  title: '错误',
                  content: '保存失败！<br/>' + err.response.status + ':' + err.response.data.code + ':' + err.response.data.message
                })
              })
            }
          }).catch(err => {
            this.$Modal.error({
              title: '错误',
              content: '保存失败！<br/>' + err.response.status + ':' + err.response.data.code + ':' + err.response.data.message
            })
          })
        } else {
          this.$Modal.warning({
            title: '警告',
            content: '表单验证失败，请检查！'
          })
        }
      })
    },
    handleModify (id) {
      this.submitText = '修改'
      this.loadForm(id)
    },
    handleDelete (id) {
      this.$Modal.confirm({
        title: '确认',
        content: '是否删除此记录？',
        onOk: () => {
          deleteWorklogDailyRecord(id).then(res => {
            this.loadData()
          })
        }
      })
    }
  },
  mounted () {
    this.loadTaskCategoryDataDicts()
    this.loadSystemItemList()
    this.loadData()
  }
}
</script>
