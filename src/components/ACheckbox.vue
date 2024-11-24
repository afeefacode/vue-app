<template>
  <v-checkbox
    ref="checkbox"
    class="a-checkbox"
    v-bind="$attrs"
    :inputValue="$attrs.value"
    @change="$emit('input', $event || false)"
  >
    <template #label>
      <slot />
    </template>
  </v-checkbox>
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


<style lang="scss" scoped>
.v-input--checkbox {
  margin: 0;
  padding: 0;

  ::v-deep() .v-input__slot {
    align-items: flex-start;
  }
}
</style>
