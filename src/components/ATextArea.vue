<template>
  <v-textarea
    ref="input"
    :rules="validationRules"
    :counter="counter"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['validator']
})
export default class ATextArea extends Vue {
  mounted () {
    if (this.validator) {
      this.$refs.input.validate(true)
    }
  }

  get validationRules () {
    const label = this.$attrs.label
    return (this.validator && this.validator.getRules(label)) || []
  }

  get counter () {
    if (!this.validator) {
      return false
    }
    return this.validator.getParams().max || false
  }
}
</script>


<style lang="scss" scoped>
.v-input:not(.v-input--is-focused) ::v-deep .v-counter {
  display: none;
}
</style>
