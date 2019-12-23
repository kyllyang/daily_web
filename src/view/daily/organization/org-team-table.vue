<template>
  <div>
    <Collapse v-model="collapse">
      <Panel name="1">
        团队列表
        <p slot="content">
          <Form ref="formData" :model="formData" :rules="formRule" :label-width="80" inline>
            <Row>
              <Col span="8">
                <FormItem label="编号" prop="code">
                  <Input type="text" v-model="formData.code"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="名称" prop="name">
                  <Input type="text" v-model="formData.name"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="负责人" prop="principalName">
                  <Input type="text" v-model="formData.principalName"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="性质" prop="property">
                  <Select v-model="formData.property" placeholder="全部" clearable>
                    <Option v-for="(item, index) in propertyDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="状态" prop="status">
                  <Select v-model="formData.status" placeholder="全部" clearable>
                    <Option v-for="(item, index) in statusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
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
import { getDataDictByCode } from '@/api/daily/evo-sys'
import { pageOrgTeam, deleteOrgTeam } from '@/api/daily/org-team'

export default {
  data () {
    return {
      collapse: '1',
      propertyDataDicts: [],
      statusDataDicts: [],
      formData: {
        code: '',
        name: '',
        principalName: '',
        property: '',
        status: ''
      },
      formRule: {
        code: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
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
          title: '上级编号',
          key: 'parentCode'
        },
        {
          align: 'left',
          width: 120,
          title: '上级名称',
          key: 'parentName'
        },
        {
          align: 'left',
          width: 120,
          title: '编号',
          key: 'code'
        },
        {
          align: 'left',
          width: 120,
          title: '名称',
          key: 'name'
        },
        {
          align: 'center',
          width: 120,
          title: '性质',
          key: 'property',
          render: (h, params) => {
            let text = ''
            for (let index in this.propertyDataDicts) {
              if (params.row.property === this.propertyDataDicts[index].key) {
                text = this.propertyDataDicts[index].value
                break
              }
            }
            return h('div', text)
          }
        },
        {
          align: 'center',
          width: 120,
          title: '状态',
          key: 'status',
          render: (h, params) => {
            let text = ''
            for (let index in this.statusDataDicts) {
              if (params.row.status === this.statusDataDicts[index].key) {
                text = this.statusDataDicts[index].value
                break
              }
            }
            return h('div', text)
          }
        },
        {
          align: 'left',
          title: '负责人',
          key: 'principalNameText'
        },
        {
          align: 'left',
          title: '擅长领域',
          key: 'skill'
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
      this.$router.push({ name: 'org_team_edit' })
    },
    handleModify () {
      if (this.$refs.dataTable.getSelection().length === 1) {
        this.$router.push({ name: 'org_team_edit', params: { id: this.$refs.dataTable.getSelection()[0].id } })
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
            deleteOrgTeam(this.$refs.dataTable.getSelection()[0].id).then(res => {
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
    loadPropertyDataDict () {
      getDataDictByCode('TEAM_PROPERTY').then(res => {
        this.propertyDataDicts = res.data
      })
    },
    loadStatusDataDict () {
      getDataDictByCode('TEAM_STATUS').then(res => {
        this.statusDataDicts = res.data
      })
    },
    loadData () {
      if (this.loading) return
      this.loading = true

      pageOrgTeam({
        code: this.formData.code,
        name: this.formData.name,
        principalName: this.formData.principalName,
        property: this.formData.property,
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
    this.loadPropertyDataDict()
    this.loadStatusDataDict()
    this.loadData()
  }
}
</script>
