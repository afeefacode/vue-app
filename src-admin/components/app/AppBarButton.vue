<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: {
    prepend: {
      type: Boolean
    }
  }
})
export default class AppBarButton extends Vue {
  mounted () {
    const section = this.getButtonBar()
    if (this.prepend) {
      section.prepend(this.$el)
    } else {
      section.append(this.$el)
    }
  }

  destroyed () {
    const section = this.getButtonBar()
    if (!section) { // already destroyed, test: navigate to not found view
      return
    }
    if (section.contains(this.$el)) {
      section.removeChild(this.$el)
    }
  }

  getButtonBar () {
    return document.getElementById('appBarButtons')
  }
}
</script>
