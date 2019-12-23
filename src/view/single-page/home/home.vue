<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="本月工时比例"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import { getEmployeeOnJobCount, getCurrentMonthManHourShouldFill, getCurrentMonthManHourAlreadyFill, getCurrentMonthManHourAlreadyApprove } from '@/api/daily/statistics'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '在职员工总数', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        { title: '本月应填工时', icon: 'md-locate', count: 0, color: '#19be6b' },
        { title: '本月已填工时', icon: 'md-map', count: 0, color: '#9A66E4' },
        { title: '本月未填工时', icon: 'md-share', count: 0, color: '#ed3f14' },
        { title: '本月已审工时', icon: 'md-chatbubbles', count: 0, color: '#E46CBB' },
        { title: '本月未审工时', icon: 'md-help-circle', count: 0, color: '#ff9900' }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  methods: {
    loadEmployeeOnJobCount () {
      getEmployeeOnJobCount().then(res => {
        this.inforCardData[0].count = res.data
      })
    },
    loadCurrentMonthManHourShouldFill () {
      getCurrentMonthManHourShouldFill().then(res => {
        this.inforCardData[1].count = res.data
        this.loadCurrentMonthManHourAlreadyFill()
        this.loadCurrentMonthManHourAlreadyApprove()
      })
    },
    loadCurrentMonthManHourAlreadyFill () {
      getCurrentMonthManHourAlreadyFill().then(res => {
        this.inforCardData[2].count = Math.floor(res.data / 60 * 100000) / 100000
        this.inforCardData[3].count = this.inforCardData[1].count - this.inforCardData[2].count
      })
    },
    loadCurrentMonthManHourAlreadyApprove () {
      getCurrentMonthManHourAlreadyApprove().then(res => {
        this.inforCardData[4].count = Math.floor(res.data / 60 * 100000) / 100000
        this.inforCardData[5].count = this.inforCardData[1].count - this.inforCardData[4].count
      })
    }
  },
  mounted () {
    this.loadEmployeeOnJobCount()
    this.loadCurrentMonthManHourShouldFill()
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
