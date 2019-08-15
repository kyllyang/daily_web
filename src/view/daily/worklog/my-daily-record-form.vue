<template>
  <Form ref="formData" :model="formData" :rules="formRule" :label-width="100">
    <Row>
      <Col span="24">
        {{ this.$store.state.user.employeeCode }}
      </Col>
    </Row>
  </Form>
</template>
