import { Vue } from '@a-vue'

Vue.directive('flying-context-trigger', {
  inserted: function (el, bindings) {
    if (bindings.value) {
      el.classList.add('flyingContextTrigger')
    }
  }
})
