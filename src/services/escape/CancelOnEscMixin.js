import { Component, Vue } from '@a-vue'

import { cascadingWindowEventDispatcher } from './CascadingWindowEventDispatcher'

@Component
export class CancelOnEscMixin extends Vue {
  coe_watchCancel () {
    cascadingWindowEventDispatcher.addEventListener('keyup', this.coe_onKeyUp)
  }

  coe_unwatchCancel () {
    cascadingWindowEventDispatcher.removeEventListener('keyup', this.coe_onKeyUp)
  }

  coe_onKeyUp (e) {
    const key = e.key || e.keyCode
    if (key === 'Escape' || key === 'Esc' || key === 27) {
      return this.coe_cancelOnEsc()
    }
  }

  coe_cancelOnEsc () {
  }

  destroyed () {
    this.coe_unwatchCancel()
  }
}
