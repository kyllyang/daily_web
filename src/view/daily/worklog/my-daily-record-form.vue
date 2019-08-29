<template>
  <Form ref="formData" :model="formData" :rules="formRule" :label-width="100">
    <Row>
      <Col span="24">
        <FormItem label="当前日期" prop="workDate">
          <DatePicker :value="formData.workDate" format="yyyy-MM-dd" type="date" @on-change="getWorkDateTime"></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <Table ref="dataTable" :data="formData.items" :columns="columns" :loading="loading" size="small" stripe border></Table>
    <FormItem>
      <Button type="primary" @click="handleSubmit()">保存</Button>
      <Button type="primary" @click="handleReset()" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>
<script>
import { mapMutations } from 'vuex'
import { listProjectSystemItem } from '@/api/daily/project-system-item'

export default {
  data () {
    return {
      systemItemList: [],
      formData: {
        id: null,
        employeeCode: this.$store.state.user.employeeCode,
        workDate: new Date(),
        items: [{
          rownum: 1, id: 1, workTime: ['08:00', '12:00']
        }]
      },
      formRule: {
      },
      columns: [
        {
          align: 'center',
          width: 70,
          title: '序号',
          key: 'rownum'
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
          key: 'systemItemCode',
          render: (h, params) => {
            return h('Select', {
            },
            [
              h('Option', {
                props: {
                  value: '1'
                }
              }, 'option1'),
              h('Option', {
                props: {
                  value: '2'
                }
              }, 'option2')
            ])
          }
        },
        {
          align: 'left',
          title: '模块名称',
          key: 'moduleName',
          render: (h, params) => {
            return h('Input', {
              props: {
                type: 'text'
              }
            })
          }
        },
        {
          align: 'left',
          width: 120,
          title: '任务分类',
          key: 'taskCategory'
        },
        {
          align: 'center',
          width: 160,
          title: '工作时间',
          key: 'workTime',
          render: (h, params) => {
            return h('TimePicker', {
              props: {
                type: 'timerange',
                format: 'HH:mm',
                value: ['08:00', '12:00']
              }
            })
          }
        },
        {
          align: 'left',
          title: '备注',
          key: 'remark',
          render: (h, params) => {
            return h('Input', {
              props: {
                type: 'text'
              }
            })
          }
        }
      ],
      loading: false
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    getWorkDateTime (time) {
      this.formData.workDate = time
    },
    loadSystemItemList () {
      listProjectSystemItem().then(res => {
        this.systemItemList = res.data
      })
    }
  },
  mounted () {
    this.loadSystemItemList()
  }
}
</script>
