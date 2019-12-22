<template>
  <div>
    <Row v-for="(item, index) in row.expandList" :key="index">
      <Col span="4">
        <span class="expand-key">时间：</span>
        <span class="expand-value">{{ item.startTime }} - {{ item.endTime }}</span>
        <span class="expand-value">{{ toMinutesText(item.minutes) }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">系统：</span>
        <span class="expand-value">{{ item.systemName }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">项目：</span>
        <span class="expand-value">{{ item.systemItemName }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">模块：</span>
        <span class="expand-value">{{ item.moduleName }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">分类：</span>
        <span class="expand-value">{{ item.taskCategoryText }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">备注：</span>
        <span class="expand-value">{{ item.remark }}</span>
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
