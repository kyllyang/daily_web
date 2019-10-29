<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        项目工时
        <p slot="content">
        <Form ref="formData" :model="formData" :label-width="80" inline>
          <Row>
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
    <Table ref="dataTable" :data="data" :columns="columns" :loading="loading" size="small" stripe border></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalRecord" :current.sync="pageNo" :page-size="pageSize" show-elevator show-sizer show-total @on-change="loadData" @on-page-size-change="changeSize"></Page>
      </div>
    </div>
  </div>
</template>
<script>
import { listProjectSystemItem } from '@/api/daily/project-system-item'
import { pageStatisticsProjectSystemItemManhourSelf } from '@/api/daily/statistics'
import { toMinutesText } from '@/libs/util'
import expandRow from './project-system-item-manhour-table-expand.vue'

export default {
  components: { expandRow },
  data () {
    return {
      collapse: '1',
      systemItemList: [],
      formData: {
        systemItemCode: ''
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
          title: '系统名称',
          key: 'systemName'
        },
        {
          align: 'left',
          title: '项目名称',
          key: 'systemItemName'
        },
        {
          align: 'center',
          title: '计划上线时间',
          key: 'planOnlineDate'
        },
        {
          align: 'center',
          title: '实际上线时间',
          key: 'realOnlineDate'
        },
        {
          align: 'right',
          title: '工时',
          key: 'minutes',
          render: (h, params) => {
            return h('div', toMinutesText(params.row.minutes))
          }
        },
        {
          align: 'right',
          title: '工时（分钟）',
          key: 'minutes'
        },
        {
          align: 'right',
          title: '工时（小时）',
          key: 'minutes',
          render: (h, params) => {
            return h('div', Math.floor(params.row.minutes / 60 * 100000) / 100000)
          }
        },
        {
          align: 'right',
          title: '工时（天）',
          key: 'minutes',
          render: (h, params) => {
            return h('div', Math.floor(params.row.minutes / 60 / 8 * 100000) / 100000)
          }
        },
        {
          align: 'right',
          title: '工时（月）',
          key: 'minutes',
          render: (h, params) => {
            return h('div', Math.floor(params.row.minutes / 60 / 8 / 21.75 * 100000) / 100000)
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
    loadSystemItemList () {
      listProjectSystemItem().then(res => {
        this.systemItemList = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageStatisticsProjectSystemItemManhourSelf({
        systemItemCode: this.formData.systemItemCode,
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
    this.loadSystemItemList()
    this.loadData()
  }
}
</script>
