<template>
  <v-textarea
    ref="input"
    :rules="validationRules"
    :counter="counter"
    v-bind="{...$attrs, dense, outlined}"
    v-on="$listeners"
  />
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'

@Component({
  props: ['validator', {dense: true, outlined: true, focus: false}]
})
export default class ATextArea extends Vue {
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

  get validationRules () {
    const label = this.$attrs.label
    return (this.validator && this.validator.getRules(label)) || []
  }

  get counter () {
    if (!this.validator) {
      return false
    }
    return this.validator.getParam('max') || false
  }

  setFocus (force = false) {
    const focus = this.focus || force // set focus if this.focus or else if forced from outside
    if (focus) {
      // if run in a v-dialog, the dialog background would
      // steal the focus without requestAnimationFrame
      requestAnimationFrame(() => {
        this.$el.querySelector('textarea').focus()
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.v-input:not(.v-input--is-focused) :deep(.v-counter) {
  display: none;
}
</style>
