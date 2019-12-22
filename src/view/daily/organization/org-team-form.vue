<template>
  <Form ref="formData" :model="formData" :rules="formRule" :label-width="100">
    <Row>
      <Col span="12">
        <FormItem label="上级团队" prop="parentCode">
          <Select v-model="formData.parentCode" clearable>
            <Option v-for="(item, index) in teamList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
              <span style="float:right;color:#ccc">{{ item.principalName }}</span>
            </Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="编号" prop="code">
          <Input type="text" v-model="formData.code"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="名称" prop="name">
          <Input type="text" v-model="formData.name"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="性质" prop="property">
          <Select v-model="formData.property" placeholder="全部" clearable>
            <Option v-for="(item, index) in propertyDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="状态" prop="status">
          <Select v-model="formData.status" placeholder="全部" clearable>
            <Option v-for="(item, index) in statusDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="擅长领域" prop="skill">
          <Input type="textarea" :rows="4" v-model="formData.skill"></Input>
        </FormItem>
      </Col>
      <Col span="12">
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
import { getDataDictByCode } from '@/api/daily/evo-sys'
import { listOrgTeam, checkByBackend, createOrgTeam, updateOrgTeam, getOrgTeam } from '@/api/daily/org-team'

export default {
  data () {
    return {
      propertyDataDicts: [],
      statusDataDicts: [],
      teamList: [],
      formData: {
        id: null,
        parentCode: 'GL',
        code: '',
        name: '',
        property: '',
        status: '',
        principalCode: '',
        skill: '',
        remark: ''
      },
      formRule: {
        parentCode: [
          { type: 'string', required: true, message: '不能为空' }
        ],
        code: [
          { type: 'string', required: true, max: 10, message: '不能为空，且最大长度不能超过10个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', required: true, max: 10, message: '不能为空，且最大长度不能超过10个字符', trigger: 'blur' }
        ],
        skill: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ],
        remark: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
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
    loadTeamList () {
      listOrgTeam({}).then(res => {
        this.teamList = res.data
      })
    },
    loadForm () {
      getOrgTeam(this.$route.params.id).then(res => {
        this.formData = res.data
      })
    },
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          checkByBackend(this.formData).then(res => {
            if (this.$route.params.id) {
              updateOrgTeam(this.formData).then(res => {
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
              createOrgTeam(this.formData).then(res => {
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
    this.loadPropertyDataDict()
    this.loadStatusDataDict()
    this.loadTeamList()

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
