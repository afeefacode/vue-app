<template>
  <v-text-field
    ref="input"
    :type="type"
    :appendIcon="appendIcon"
    :autocomplete="autocomplete"
    :rules="validationRules"
    :counter="counter"
    :style="widthStyle"
    v-bind="$attrs"
    v-on="$listeners"
    @click:append="showPassword = !showPassword"
  />
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { debounce } from '@a-vue/utils/debounce'

@Component({
  props: ['focus', 'debounce', 'validator', 'password', 'width']
})
export default class ATextField extends Vue {
  showPassword = false

  created () {
    if (this.debounce) {
      this.$listeners.input = debounce(value => {
        this.$emit('input', value)
      }, this.debounce, value => value)
    }
  }

  mounted () {
    this.setFocus()

    if (this.validator) {
      this.$refs.input.validate(true)
    }
  }

  @Watch('focus')
  focusChanged () {
    this.setFocus()
  }

  setFocus () {
    const focus = this.focus || false
    if (focus) {
      // if run in a v-dialog, the dialog background would
      // steal the focus without requestAnimationFrame
      requestAnimationFrame(() => {
        this.$el.querySelector('input').focus()
      })
    }
  }

  get widthStyle () {
    if (this.width) {
      return `min-width: 100px; max-width: ${this.width}px;`
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
