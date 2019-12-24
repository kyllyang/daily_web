<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        项目工时统计报表
        <p slot="content">
        <Form ref="formData" :model="formData" :rules="formRule" :label-width="80" inline>
          <Row>
            <Col span="8">
              <FormItem label="项目名称" prop="systemItemCode" style="width: 100%;">
                <Select v-model="formData.systemItemCode" filterable clearable>
                  <Option v-for="(item, index) in systemItemList" :value="item.code" :label="item.name" :key="index">
                    <span>{{ item.name }}</span>
                    <span style="float:right;color:#ccc">{{ item.systemName }}</span>
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8" offset="8">
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
import { listProjectSystemItem } from '@/api/daily/project-system-item'
import { exportExcelWorkloadManhourSettle } from '@/api/daily/workload'
import { downloadProcess } from '@/libs/util'

export default {
  data () {
    return {
      collapse: '1',
      systemItemList: [],
      formData: {
        systemItemCode: '',
        fileName: '项目工时统计报表'
      },
      formRule: {
        systemItemCode: [
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

          exportExcelWorkloadManhourSettle({
            systemItemCode: this.formData.systemItemCode,
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
    loadSystemItemList () {
      listProjectSystemItem({}).then(res => {
        this.systemItemList = res.data
      })
    }
  },
  mounted () {
    this.loadSystemItemList()
  }
}
</script>
