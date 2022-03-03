<template>
  <div class="d-flex align-center">
    <v-icon
      class="mr-2"
      :color="icon.color"
      size="1.8rem"
      v-text="icon.icon"
    />

    <h2>{{ title }}</h2>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['icon', 'title']
})
export default class appBarTitle extends Vue {
  mounted () {
    const section = this.getButtonBar()
    section.appendChild(this.$el)
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
    return document.getElementById('appBarTitleContainer')
  }
}
</script>


<style lang="scss" scoped>
h2 {
  // white-space: nowrap;
  line-height: 1.5rem;
}
</style>
