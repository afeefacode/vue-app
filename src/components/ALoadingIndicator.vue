<template>
  <v-progress-linear
    v-if="internalLoading"
    style="position:absolute;top:0;left:0;"
    indeterminate
    color="green darken-2"
  />
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  props: ['isLoading']
})
export default class ALoadingIndicator extends Vue {
  internalLoading = false
  timeout = null
  start = 0

  created () {
    this.internalLoading = this.isLoading
  }

  @Watch('isLoading')
  isLoadingChanged () {
    if (this.isLoading) { // start immediately, but stop delayed
      this.start = Date.now()
      this.internalLoading = this.isLoading
      clearTimeout(this.timeout)
    }

    if (!this.isLoading) {
      const diff = Date.now() - this.start
      const rest = Math.max(0, 250 - diff)
      this.timeout = setTimeout(() => {
        this.internalLoading = false
      }, rest)
    }
  }
}
</script>
