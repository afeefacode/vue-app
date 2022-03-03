<template>
  <v-checkbox
    ref="checkbox"
    v-bind="$attrs"
    :inputValue="$attrs.value"
    @change="$emit('input', $event || false)"
  />
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['validator']
})
export default class ACheckbox extends Vue {
  created () {
    this.init()
  }

  async init () {
    if (this.validator) {
      this.$nextTick(() => {
        this.$refs.checkbox.validate(true)
      })
    }
  }

  get validationRules () {
    const label = this.$attrs.label
    return (this.validator && this.validator.getRules(label)) || []
  }
}
</script>
