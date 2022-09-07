<template>
  <v-radio-group
    ref="radios"
    :rules="validationRules"
    :class="{hasLabel: $has.label}"
    v-bind="$attrs"
    @change="$emit('input', $event)"
  >
    <template v-for="option in options_">
      <v-radio
        :key="option.itemText"
        :value="option.itemValue"
      >
        <template #label>
          <div v-html="option.itemText" />
        </template>
      </v-radio>
    </template>
  </v-radio-group>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'

@Component({
  props: ['options', 'validator']
})
export default class ARadioGroup extends Vue {
  $hasOptions = ['label']

  options_ = []

  created () {
    this.init()
  }

  @Watch('options')
  optionsChanged () {
    this.init()
  }

  async init () {
    const options = typeof this.options === 'function' ? this.options() : this.options

    if (options instanceof Promise) {
      this.options_ = await options
    } else {
      this.options_ = options
    }

    if (this.validator) {
      this.$nextTick(() => {
        this.$refs.radios.validate(true)
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
.v-input {
  margin: 0;

  &:not(.hasLabel) {
    ::v-deep legend {
      display: none;
    }
  }
}
</style>
