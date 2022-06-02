import { Vue } from '@a-vue'

Vue.directive('flying-context-trigger', {
  bind: function (el, bindings) {
    if (bindings.value) {
      el.$flyingContextObserver = new MutationObserver(() => {
        if (!el.classList.contains('flyingContextTrigger')) {
          el.classList.add('flyingContextTrigger')
        }
      })

      el.$flyingContextObserver.observe(el, {
        attributes: true,
        attributeFilter: ['class']
      })

      el.classList.add('flyingContextTrigger')
    }
  },

  unbind: function (el) {
    el.$flyingContextObserver.disconnect()
  }
})
