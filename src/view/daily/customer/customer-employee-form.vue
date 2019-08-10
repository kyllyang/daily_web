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
        <FormItem label="职位" prop="job">
          <Input type="text" v-model="formData.job"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="所属公司" prop="companyCode">
          <Select v-model="formData.companyCode">
            <Option v-for="(item, index) in companyList" :value="item.code" :label="item.name" :key="index">
              <span>{{ item.name }}</span>
            </Option>
          </Select>
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
import { listCustomerCompany } from '@/api/daily/customer-company'
import { checkByBackend, createCustomerEmployee, updateCustomerEmployee, getCustomerEmployee } from '@/api/daily/customer-employee'

export default {
  data () {
    return {
      companyList: [],
      formData: {
        id: null,
        code: '',
        name: '',
        job: '',
        companyCode: ''
      },
      formRule: {
        code: [
          { type: 'string', required: true, max: 10, message: '不能为空，且最大长度不能超过10个字符', trigger: 'blur' }
        ],
        name: [
          { type: 'string', required: true, max: 10, message: '不能为空，且最大长度不能超过10个字符', trigger: 'blur' }
        ],
        job: [
          { type: 'string', max: 10, message: '最大长度不能超过10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    loadCompanyList () {
      listCustomerCompany().then(res => {
        this.companyList = res.data
      })
    },
    loadForm () {
      getCustomerEmployee(this.$route.params.id).then(res => {
        this.formData = res.data
      })
    },
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          checkByBackend(this.formData).then(res => {
            if (this.$route.params.id) {
              updateCustomerEmployee(this.formData).then(res => {
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
              createCustomerEmployee(this.formData).then(res => {
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
    this.loadCompanyList()

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
