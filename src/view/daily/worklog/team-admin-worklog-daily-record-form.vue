<template>
  <Form ref="formData" :model="formData" :rules="formRule" :label-width="100">
    <Row>
      <Col span="12">
        <FormItem label="员工姓名" prop="employeeCode">
          <Select v-model="formData.employeeCode" filterable clearable>
            <Option v-for="(item, index) in employeeList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="日期" prop="workDate">
          <DatePicker :value="formData.workDate" format="yyyy-MM-dd" type="date" @on-change="getWorkDateTime"></DatePicker>
        </FormItem>
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
          <TimePicker type="timerange" format="HH:mm" v-model="formData.workTimes"></TimePicker>
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
      <Button type="primary" @click="handleSubmit()">保存</Button>
      <Button type="primary" @click="handleReset()" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>
<script>
import { mapMutations } from 'vuex'
import { getDataDictByCodeForChildren } from '@/api/daily/evo-sys'
import { listOrgEmployee } from '@/api/daily/org-employee'
import { listProjectSystemItem } from '@/api/daily/project-system-item'
import { checkByBackend, createWorklogDailyRecord, updateWorklogDailyRecord, getWorklogDailyRecord } from '@/api/daily/worklog-daily-record'

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
      taskCategoryDataDicts: [],
      employeeList: [],
      systemItemList: [],
      formData: {
        id: null,
        employeeCode: '',
        workDate: new Date(),
        systemItemCode: '',
        moduleName: '',
        taskCategory: '',
        startTime: '',
        endTime: '',
        remark: '',
        status: '',
        comment: '',
        taskCategorys: [],
        workTimes: ['08:00', '12:00']
      },
      formRule: {
        employeeCode: [
          { type: 'string', required: true, message: '不能为空', trigger: 'blur' }
        ],
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
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
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
      listOrgEmployee({}).then(res => {
        this.employeeList = res.data
      })
    },
    loadSystemItemList () {
      listProjectSystemItem().then(res => {
        this.systemItemList = res.data
      })
    },
    loadForm () {
      getWorklogDailyRecord(this.$route.params.id).then(res => {
        this.formData = res.data
      })
    },
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.formData.taskCategory = this.formData.taskCategorys[1]
          this.formData.startTime = this.formData.workTimes[0]
          this.formData.endTime = this.formData.workTimes[1]

          checkByBackend(this.formData).then(res => {
            if (this.$route.params.id) {
              updateWorklogDailyRecord(this.formData).then(res => {
                this.$Modal.success({
                  title: '成功',
                  content: '保存成功！',
                  onOk: () => {
                    this.closeTag({
                      name: this.$router.currentRoute.name,
                      params: {
                        id: this.$route.params.id
                      }
                    })
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
                    this.closeTag({
                      name: this.$router.currentRoute.name
                    })
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
    handleReset () {
      this.$refs['formData'].resetFields()
    }
  },
  mounted () {
    this.loadTaskCategoryDataDicts()
    this.loadEmployeeList()
    this.loadSystemItemList()

    if (this.$route.params.id) {
      this.loadForm()
    }
  }
}
</script>
<style>
  .icon-img {
    width: 24px;
    height: 24px;
  }
</style>
