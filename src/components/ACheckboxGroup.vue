<template>
  <div>
    <v-label v-if="$attrs.label">
      {{ $attrs.label }}
    </v-label>

    <a-row
      :vertical="vertical"
      :gap="vertical ? 0 : 4"
    >
      <a-checkbox
        v-for="option in options_"
        :key="option.itemValue"
        :label="option.itemText"
        :value="isChecked(option.itemValue)"
        hide-details
        @input="checked(option.itemValue, $event)"
      >
        <template #label>
          <div v-html="option.itemText" />
        </template>
      </a-checkbox>
    </a-row>

    <div
      v-if="errorMessages.length"
      class="mt-1 error--text v-messages"
    >
      {{ errorMessages[0] }}
    </div>
  </div>
</template>


<script>
import { Component, Vue, Watch, Inject } from '@a-vue'

@Component({
  props: ['value', 'options', 'validator', {vertical: false}]
})
export default class ACheckboxGroup extends Vue {
  value_ = []
  options_ = []
  errorMessages = []
  hasError = false

  @Inject({ from: 'form', default: null }) form

  created () {
    this.form && this.form.register(this)
    this.value_ = this.value || []
    this.init()
  }

  checked (key, value) {
    if (value) {
      if (!this.isChecked(key)) {
        this.value_.push(key)
      }
    } else {
      this.value_ = this.value_.filter(v => v !== key)
    }
    this.$emit('input', this.value_)
    this.validate()
  }

  isChecked (key) {
    return this.value_.includes(key)
  }

  @Watch('options')
  optionsChanged () {
    this.init()
  }

  @Watch('value')
  valueChanged (value) {
    this.value_ = value || []
  }

  async init () {
    const options = typeof this.options === 'function' ? this.options() : this.options

    if (options instanceof Promise) {
      this.options_ = await options
    } else {
      this.options_ = options
    }

    this.$nextTick(() => {
      this.validate()
    })
  }

  validate () {
    this.errorMessages = []
    if (this.validator) {
      const rules = this.validator.getRules(this.$attrs.label)
      for (const rule of rules) {
        const message = rule(this.value_)
        if (typeof message === 'string') {
          this.errorMessages.push(message)
          break
        }
      }
    }

    this.hasError = !!this.errorMessages.length // VForm will watch the hasError prop
    return !this.errorMessages.length
  }
}
</script>
