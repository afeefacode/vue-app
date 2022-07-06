<template>
  <div class="d-flex align-center gap-4">
    <v-icon
      :color="icon.color"
      size="1.8rem"
      v-text="icon.icon"
    />

    <div>
      <h3 v-if="subtitle">
        {{ subtitle }}
      </h3>
    <h2>{{ title }}</h2>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['icon', 'title', 'subtitle']
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

h3 {
  font-size: .9rem;
  font-weight: normal;
  margin-bottom: .2rem;
  line-height: 1rem;
  color: #999999;
}

h2 {
  // white-space: nowrap;
  font-size: 1.5rem;
  line-height: 1.5rem;
}
</style>
