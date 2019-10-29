<template>
  <div>
    <Row v-for="(item, index) in row.expandList" :key="index">
      <Col span="4">
        <span class="expand-key">员工：</span>
        <span class="expand-value">{{ item.employeeName }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">工时：</span>
        <span class="expand-value">{{ item.minutes }}</span>
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
export default {
  props: {
    row: Object
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
