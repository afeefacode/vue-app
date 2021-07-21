import { Component, Vue } from 'vue-property-decorator'
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
    if (targetIndex > thisIndex) {
      return
    }

    this.$emit('click:outside')
  }
}
