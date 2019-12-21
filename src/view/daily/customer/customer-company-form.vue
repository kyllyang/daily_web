<template>
  <Form ref="formData" :model="formData" :rules="formRule" :label-width="100">
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
        <FormItem label="服务模式" prop="serviceMode">
          <Select v-model="formData.serviceMode" placeholder="全部" clearable>
            <Option v-for="(item, index) in serviceModeDataDicts" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="办公地点" prop="address">
          <Input type="text" v-model="formData.address"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="夏季上班时间" prop="summerOnWorkTime">
          <TimePicker format="HH:mm" v-model="formData.summerOnWorkTime" :steps="[1, 15]"></TimePicker>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="夏季下班时间" prop="summerOffWorkTime">
          <TimePicker format="HH:mm" v-model="formData.summerOffWorkTime" :steps="[1, 15]"></TimePicker>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="冬季上班时间" prop="winterOnWorkTime">
          <TimePicker format="HH:mm" v-model="formData.winterOnWorkTime" :steps="[1, 15]"></TimePicker>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="冬季下班时间" prop="winterOffWorkTime">
          <TimePicker format="HH:mm" v-model="formData.winterOffWorkTime" :steps="[1, 15]"></TimePicker>
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
import { checkByBackend, createCustomerCompany, updateCustomerCompany, getCustomerCompany } from '@/api/daily/customer-company'

export default {
  data () {
    return {
      serviceModeDataDicts: [],
      formData: {
        id: null,
        code: '',
        name: '',
        serviceMode: '',
        address: '',
        summerOnWorkTime: '08:00',
        summerOffWorkTime: '17:00',
        winterOnWorkTime: '08:00',
        winterOffWorkTime: '17:00'
      },
      formRule: {
        code: [
          { type: 'string', required: true, max: 30, message: '不能为空，且最大长度不能超过10个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', required: true, max: 30, message: '不能为空，且最大长度不能超过10个字符', trigger: 'blur' }
        ],
        address: [
          { type: 'string', max: 200, message: '最大长度不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    loadServiceModeDataDict () {
      getDataDictByCode('SERVICE_MODE').then(res => {
        this.serviceModeDataDicts = res.data
      })
    },
    loadForm () {
      getCustomerCompany(this.$route.params.id).then(res => {
        this.formData = res.data
      })
    },
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          checkByBackend(this.formData).then(res => {
            if (this.$route.params.id) {
              updateCustomerCompany(this.formData).then(res => {
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
              createCustomerCompany(this.formData).then(res => {
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
    this.loadServiceModeDataDict()

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
