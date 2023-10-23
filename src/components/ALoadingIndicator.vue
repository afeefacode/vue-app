<template>
  <div :class="['loadingIndicator', {absolute}]">
    <v-progress-linear
      v-if="isLoading_"
      class="loadingIndicator"
      indeterminate
      :color="color"
    />
    <div
      v-else
      style="height: 4px;"
    />
  </div>
</template>

<script>
import { Component, Vue, Watch } from '@a-vue'

@Component({
  props: [{isLoading: false, absolute: false}]
})
export default class ALoadingIndicator extends Vue {
  isLoading_ = false
  timeout = null
  start = 0

  created () {
    this.isLoading_ = this.isLoading
  }

  get color () {
    return this.$attrs.color || 'green darken-2'
  }

  @Watch('isLoading')
  isLoadingChanged () {
    if (this.isLoading) { // start immediately, but stop delayed
      this.start = Date.now()
      this.isLoading_ = this.isLoading
      clearTimeout(this.timeout)
    }

    if (!this.isLoading) {
      const diff = Date.now() - this.start
      const rest = Math.max(0, 250 - diff)
      this.timeout = setTimeout(() => {
        this.isLoading_ = false
      }, rest)
    }
  }
}
</script>


<style lang="scss" scoped>
.absolute {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
</style>
