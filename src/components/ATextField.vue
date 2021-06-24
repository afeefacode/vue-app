<template>
  <v-text-field
    ref="input"
    :type="type"
    :append-icon="appendIcon"
    :autocomplete="autocomplete"
    :rules="validationRules"
    :counter="counter"
    v-bind="$attrs"
    v-on="$listeners"
    @click:append="showPassword = !showPassword"
  />
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import { debounce } from '@a-vue/utils/debounce'

@Component({
  props: ['focus', 'debounce', 'validator', 'password']
})
export default class ATextField extends Vue {
  autofocus = false
  showPassword = false

  created () {
    this.autofocus = this.focus || false

    if (this.debounce) {
      this.$listeners.input = debounce(value => {
        this.$emit('input', value)
      }, this.debounce, value => value)
    }
  }

  mounted () {
    if (this.autofocus) {
      this.$el.querySelector('input').focus()
    }

    if (this.validator) {
      this.$refs.input.validate(true)
    }
  }

  get type () {
    if (this.password !== undefined && !this.showPassword) {
      return 'password'
    }
    return 'text'
  }

  get appendIcon () {
    if (this.password !== undefined) {
      return this.showPassword ? '$eyeIcon' : '$eyeOffIcon'
    }
    return null
  }

  get autocomplete () {
    if (this.password !== undefined) {
      return 'new-password'
    }
    return null
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
