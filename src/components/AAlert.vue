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
      <h3>{{ headline }}</h3>

      <div v-html="message" />

      <div
        v-if="detail"
        class="pt-1 details"
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
    if (!alert.headline) {
      const messages = this.error
        ? ['Ein Fehler ist aufgetreten', 'Da stimmt was nicht', 'Leider nicht geklappt', 'Da hakt es', 'Hoppla', 'Etwas ist schiefgelaufen', 'Das hat nicht funktioniert', 'Da klemmt etwas', 'Unerwartetes Hindernis', 'Kritischer Fehler #983-45§.v2)= ;-)', 'Kann mal passieren', 'Die Technik wieder']
        : ['Erledigt!', 'Einwandfrei', 'Passt!', 'Wunderbar', 'Alles klar', 'Daten sicher verstaut', 'Tipptopp', 'Reibungslos', 'Bestens', 'Hat geklappt', 'Super', 'Totalgenial']
      const index = Math.floor(Math.random() * messages.length)
      alert.headline = messages[index]
    }

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

  :deep() {
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
        font-size: 1.2rem;
        line-height: 1.2;
      }

      .details {
        font-size: .9rem;
      }

      .closeButton {
        align-self: flex-start;
        margin-top: -.5rem;
      }
    }
  }
}

</style>
