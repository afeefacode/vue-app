<template>
  <v-overlay
    :value="overlay"
    :zIndex="300"
  >
    <v-progress-circular
      :size="100"
      :width="10"
      color="#eee"
      indeterminate
    />
  </v-overlay>
</template>


<script>
import { Component, Vue } from '@a-vue'
import { SaveEvent } from './save-indicator/SaveEvent'

@Component
export default class ASaveIndicator extends Vue {
  overlay = false

  created () {
    this.$events.on(SaveEvent.START_SAVING, this.onStart)
    this.$events.on(SaveEvent.STOP_SAVING, this.onStop)
  }

  onStart () {
    this.overlay = true
  }

  onStop () {
    this.overlay = false
  }
}
</script>


<style lang="scss" scoped>
.v-progress-circular {
  transform: translateY(-20vh);
}
</style>
