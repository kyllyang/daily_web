<template>
  <Form ref="formData" :model="formData" :label-width="100">
    <Row>
      <Col span="1">&nbsp;</Col>
      <Col span="6">
        <FormItem label="当前月份" prop="currentMonth">
          <Input :value="formData.currentMonth" readonly></Input>
        </FormItem>
      </Col>
      <Col span="5">
        <ButtonGroup style="margin-left: 8px">
          <Button type="primary" @click="handlePrevMonth()">
            <Icon type="ios-arrow-back"></Icon>
          </Button>
          <Button type="primary" @click="handleNextMonth()">
            <Icon type="ios-arrow-forward"></Icon>
          </Button>
        </ButtonGroup>
      </Col>
      <Col span="10" align="right">
        <Tag type="dot" color="primary">工作日</Tag>
        <Tag type="dot" color="success">休息日</Tag>
      </Col>
      <Col span="2">&nbsp;</Col>
    </Row>
    <Row>
      <Col span="1">&nbsp;</Col>
      <Col span="3">
        <Tag color="primary">一</Tag>
      </Col>
      <Col span="3">
        <Tag color="primary">二</Tag>
      </Col>
      <Col span="3">
        <Tag color="primary">三</Tag>
      </Col>
      <Col span="3">
        <Tag color="primary">四</Tag>
      </Col>
      <Col span="3">
        <Tag color="primary">五</Tag>
      </Col>
      <Col span="3">
        <Tag color="primary">六</Tag>
      </Col>
      <Col span="3">
        <Tag color="primary">日</Tag>
      </Col>
      <Col span="2">&nbsp;</Col>
    </Row>
    <Row v-for="i in 6" :key="i">
      <Col span="1">&nbsp;</Col>
      <Col span="3" v-for="j in 7" :key="j">
        <Dropdown trigger="click" style="margin-bottom: 10px" @on-click="handleMarkDay">
          <Button :type="types[(i - 1) * 7 + (j - 1)]" :disabled="disableds[(i - 1) * 7 + (j - 1)]">{{ dates[(i - 1) * 7 + (j - 1)] }}</Button>
          <DropdownMenu slot="list">
            <DropdownItem :name="'work_' + ((i - 1) * 7 + (j - 1))">工作日</DropdownItem>
            <DropdownItem :name="'rest_' + ((i - 1) * 7 + (j - 1))">休息日</DropdownItem>
            <DropdownItem :name="'cancel_' + ((i - 1) * 7 + (j - 1))">取消</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Col>
      <Col span="2">&nbsp;</Col>
    </Row>
    <FormItem>
      <Button type="primary" @click="handleSubmit()">保存</Button>
      <Button type="primary" @click="handleReset()" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>
<script>
import { getSystemHolidays, saveSystemHolidays } from '@/api/daily/system-holidays'
import { formatMonth, newDate, addDate } from '@/libs/util'

export default {
  data () {
    return {
      dates: [],
      types: [],
      disableds: [],
      workDateSet: new Set(),
      restDateSet: new Set(),
      formData: {
        currentMonth: '',
        workDates: [],
        restDates: []
      }
    }
  },
  methods: {
    handleMarkDay (name) {
      let tempTypes = []
      for (let i = 0; i < this.types.length; i++) {
        tempTypes[i] = this.types[i]
      }

      let date = this.formData.currentMonth + '-' + this.dates[name.split('_')[1]]
      this.workDateSet.delete(date)
      this.restDateSet.delete(date)

      if (name.split('_')[0] === 'work') {
        tempTypes[name.split('_')[1]] = 'info'
        this.workDateSet.add(date)
      } else if (name.split('_')[0] === 'rest') {
        tempTypes[name.split('_')[1]] = 'success'
        this.restDateSet.add(date)
      } else {
        let we = newDate(date).getDay()
        tempTypes[name.split('_')[1]] = we === 0 || we === 6 ? 'success' : 'info'
      }

      this.types = tempTypes
    },
    handlePrevMonth () {
      this.formData.currentMonth = formatMonth(addDate(newDate(this.formData.currentMonth + '-01'), -1))
      this.fillDates()
    },
    handleNextMonth () {
      let y = parseInt(this.formData.currentMonth.split('-')[0])
      let m = this.formData.currentMonth.split('-')[1]
      if (m.indexOf('0') === 0) {
        m = m.substr(1)
      }
      m = parseInt(m)

      m++

      if (m > 12) {
        y++
        m = 1
      }

      this.formData.currentMonth = y + '-' + (m < 10 ? '0' + m : m)
      this.fillDates()
    },
    fillDates () {
      this.types = []
      this.disableds = []

      let y = parseInt(this.formData.currentMonth.split('-')[0])
      let m = this.formData.currentMonth.split('-')[1]
      if (m.indexOf('0') === 0) {
        m = m.substr(1)
      }
      m = parseInt(m)

      let ds = 0
      if (m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12) {
        ds = 31
      } else if (m === 4 || m === 6 || m === 9 || m === 11) {
        ds = 30
      } else {
        ds = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0) ? 29 : 28
      }

      let day = newDate(y + '-' + (m < 10 ? '0' + m : m) + '-01').getDay()
      day = day === 0 ? 6 : day - 1
      for (let i = 0; i < day; i++) {
        this.dates[i] = ''
        this.disableds[i] = true
      }
      for (let i = 0; i < ds; i++) {
        this.dates[day + i] = (i + 1 < 10 ? '0' + (i + 1) : i + 1)

        let date = this.formData.currentMonth + '-' + this.dates[day + i]
        let we = newDate(date).getDay()
        this.types[day + i] = we === 0 || we === 6 ? 'success' : 'info'

        if (this.workDateSet.has(date)) {
          this.types[day + i] = 'info'
        } else if (this.restDateSet.has(date)) {
          this.types[day + i] = 'success'
        }

        this.disableds[day + i] = false
      }
      for (let i = day + ds; i < 42; i++) {
        this.dates[i] = ''
        this.disableds[i] = true
      }
    },
    loadForm () {
      getSystemHolidays().then(res => {
        this.formData = res.data
        this.workDateSet = new Set(this.formData.workDates)
        this.restDateSet = new Set(this.formData.restDates)

        this.formData.currentMonth = formatMonth(new Date())
        this.fillDates()
      })
    },
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.formData.workDates = Array.from(this.workDateSet)
          this.formData.restDates = Array.from(this.restDateSet)

          saveSystemHolidays(this.formData).then(res => {
            this.$Modal.success({
              title: '成功',
              content: '保存成功！'
            })
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
    this.loadForm()
  }
}
</script>
<style>
  .icon-img {
    width: 24px;
    height: 24px;
  }
</style>
