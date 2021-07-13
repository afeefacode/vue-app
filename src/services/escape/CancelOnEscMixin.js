import { Component, Vue } from 'vue-property-decorator'

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
    console.log('cancel', e)
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
