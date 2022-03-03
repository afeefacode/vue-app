<template>
  <v-snackbar
    v-model="snackbar"
    :multi-line="true"
    top
    :timeout="5000"
  >
    <v-icon
      size="2rem"
      :color="error ? 'red' : 'green'"
      class="icon"
    >
      {{ error ? '$alarmIcon' : '$thumbsUpIcon' }}
    </v-icon>

    <div>
      <h3>{{ _headline }}</h3>

      <div v-html="message" />
      <div
        v-if="detail"
        class="pt-3"
        v-html="detail"
      />
    </div>

    <v-btn
      icon
      class="closeButton"
      @click="hideSnackbar"
    >
      <v-icon>$closeIcon</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { AlertEvent } from './alert/AlertEvent'

@Component
export default class AAlert extends Vue {
  snackbar = false
  success = false
  error = false

  headline = null
  message = null
  detail = null

  created () {
    this.$events.on(AlertEvent.ERROR, this.onError)
    this.$events.on(AlertEvent.MESSAGE, this.onMessage)
    window.addEventListener('mouseup', this.onMouseDown)
  }

  get _headline () {
    if (this.headline) {
      return this.headline
    }
    return this.error ? 'Ein Fehler ist aufgetreten.' : 'Alles super!'
  }

  onError (alertEvent) {
    this.success = false
    this.error = true
    this.show(alertEvent.payload)
  }

  onMessage (alertEvent) {
    this.success = true
    this.error = false
    this.show(alertEvent.payload)
  }

  show (alert) {
    this.headline = alert.headline
    this.message = alert.message
    this.detail = alert.detail
    this.snackbar = true
  }

  onMouseDown (event) {
    if (this.$el.contains(event.target)) {
      return
    }

    this.hideSnackbar()
  }

  hideSnackbar () {
    this.error = false
    this.success = false
    this.snackbar = false
  }
}
</script>

<style lang="scss" scoped>
.v-snack {
  padding: .5rem !important;

  .icon {
    font-size: 2rem;
  }

  ::v-deep {
    .v-snack__wrapper {
      width: 500px;
      // margin-top: 1rem;
    }

    .v-snack__content {
      display: flex;
      align-items: center;
      padding: 1rem .2rem .8rem 1.5rem;
      font-size: 1rem;

      > *:not(:last-child) {
        margin-right: 1.5rem;
      }

      > div {
        flex-grow: 1;
      }

      h3 {
        margin-bottom: .5rem;
        font-size: 1.4rem;
      }

      .closeButton {
        align-self: flex-start;
        margin-top: -.5rem;
      }
    }
  }
}

</style>
