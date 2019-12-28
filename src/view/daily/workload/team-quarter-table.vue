<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        团队季度工时统计报表
        <p slot="content">
        <Form ref="formData" :model="formData" :rules="formRule" :label-width="80" inline>
          <Row>
            <Col span="8">
              <FormItem label="起始日期" prop="startWorkDate">
                <DatePicker :value="formData.startWorkDate" format="yyyy-MM" type="month" @on-change="getStartWorkDateTime"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="结束日期" prop="endWorkDate">
                <DatePicker :value="formData.endWorkDate" format="yyyy-MM" type="month" @on-change="getEndWorkDateTime"></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="系统名称" prop="systemCode" style="width: 100%;">
                <Select v-model="formData.systemCode" filterable clearable>
                  <Option v-for="(item, index) in systemList" :value="item.code" :label="item.name" :key="index">
                    <span>{{ item.name }}</span>
                    <span style="float:right;color:#ccc">{{ item.code }}</span>
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8" offset="16">
              <FormItem>
                <Button type="primary" @click="handleExportExcel()">
                  <Icon type="md-download"/>
                  导出
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
  </div>
</template>
<script>
import { listProjectSystem } from '@/api/daily/project-system'
import { exportExcelWorkloadTeamQuarter } from '@/api/daily/workload'
import { downloadProcess } from '@/libs/util'

export default {
  data () {
    const workDateValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error((rule.field === 'startWorkDate' ? '起始' : '结束') + '日期不能为空'))
      } else if (parseInt(this.formData.startWorkDate.replace('-', '')) > parseInt(this.formData.endWorkDate.replace('-', ''))) {
        callback(new Error('起始日期不能大于结束日期'))
      } else {
        callback()
      }
    }

    return {
      collapse: '1',
      systemList: [],
      formData: {
        startWorkDate: '',
        endWorkDate: '',
        systemCode: '',
        fileName: '团队季度工时统计报表'
      },
      formRule: {
        startWorkDate: [
          { type: 'string', required: true, validator: workDateValidator, trigger: 'blur' }
        ],
        endWorkDate: [
          { type: 'string', required: true, validator: workDateValidator, trigger: 'blur' }
        ],
        systemCode: [
          { type: 'string', required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleExportExcel () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.$Spin.show()

          exportExcelWorkloadTeamQuarter({
            startWorkDate: this.formData.startWorkDate,
            endWorkDate: this.formData.endWorkDate,
            systemCode: this.formData.systemCode,
            fileName: this.formData.fileName,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            pageSort: 'code',
            pageOrder: 'asc'
          }).then(res => {
            downloadProcess(res.data, this.formData.fileName + '.xlsx')
            this.$Spin.hide()
          })
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
    },
    getStartWorkDateTime (time) {
      this.formData.startWorkDate = time
    },
    getEndWorkDateTime (time) {
      this.formData.endWorkDate = time
    },
    loadSystemList () {
      listProjectSystem({}).then(res => {
        this.systemList = res.data
      })
    }
  },
  mounted () {
    this.loadSystemList()
  }
}
</script>
