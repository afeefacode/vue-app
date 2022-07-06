import { Component, Vue } from '@a-vue'
import { getZIndex } from 'vuetify/lib/util/helpers'

@Component
export class ClickOutsideMixin extends Vue {
  created () {
    window.addEventListener('mousedown', this.onClickOutside)
  }

  destroyed () {
    window.removeEventListener('mousedown', this.onClickOutside)
  }

  onClickOutside (e) {
    // el clicked
    if (this.$el === e.target) {
      return
    }

    // child clicked
    if (this.$el.contains(e.target)) {
      return
    }

    // popup clicked
    const thisIndex = getZIndex(this.$el)
    const targetIndex = getZIndex(e.target)
    if (targetIndex > 10 && targetIndex > thisIndex) { // sidebar === 6
      return
    }

    this.com_onClickOutside()
    this.$emit('click:outside')
  }

  com_onClickOutside () {
  }
}
