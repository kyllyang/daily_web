<template>
  <div>
    <Row v-for="(item, index) in row.employeeExpandList" :key="index + 'employee'">
      <Col span="4">
        <span class="expand-key">成员：</span>
        <span class="expand-value">{{ item.employeeName }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时：</span>
        <span class="expand-value">{{ toMinutesText(item.minutes) }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时（分钟）：</span>
        <span class="expand-value">{{ item.minutes }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时（小时）：</span>
        <span class="expand-value">{{ Math.floor(item.minutes / 60 * 100000) / 100000 }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时（天）：</span>
        <span class="expand-value">{{ Math.floor(item.minutes / 60 / 8 * 100000) / 100000 }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时（月）：</span>
        <span class="expand-value">{{ Math.floor(item.minutes / 60 / 8 / 21.75 * 100000) / 100000 }}</span>
      </Col>
    </Row>
    <br/>
    <Row v-for="(item, index) in row.jobExpandList" :key="index + 'job'">
      <Col span="4">
        <span class="expand-key">岗位：</span>
        <span class="expand-value">{{ toOtherText(item.jobValue) }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时：</span>
        <span class="expand-value">{{ toMinutesText(item.minutes) }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时（分钟）：</span>
        <span class="expand-value">{{ item.minutes }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时（小时）：</span>
        <span class="expand-value">{{ Math.floor(item.minutes / 60 * 100000) / 100000 }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时（天）：</span>
        <span class="expand-value">{{ Math.floor(item.minutes / 60 / 8 * 100000) / 100000 }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时（月）：</span>
        <span class="expand-value">{{ Math.floor(item.minutes / 60 / 8 / 21.75 * 100000) / 100000 }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
import { toMinutesText } from '@/libs/util'
export default {
  props: {
    row: Object
  },
  methods: {
    toMinutesText (minutes) {
      return toMinutesText(minutes)
    },
    toOtherText (name) {
      return name === null || name === '' ? '未分类' : name
    }
  }
}
</script>
<style>
  .expand-key {
    font-weight: bolder;
    margin-right: 8px;
  }
  .expand-value {
    margin-right: 8px;
  }
</style>
