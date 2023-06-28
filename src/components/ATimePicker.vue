<template>
  <div class="timePicker">
    <div :class="['timeInput inputField', {focus: focusHour}]">
      <div
        class="up iconButton"
        @click="hourUp"
      >
        <a-icon button>
          $caretUpIcon
        </a-icon>
      </div>

      <v-text-field
        v-model="currentHour"
        dense
        outlined
        hide-details
        @wheel.prevent="onWheelHour"
        @focus="focusHour = true"
        @blur="updateHoursAndMinute"
      />

      <div
        class="down iconButton"
        @click="hourDown"
      >
        <a-icon button>
          $caretDownIcon
        </a-icon>
      </div>
    </div>

    <div class="hourMinutesSeparator">
      :
    </div>

    <div :class="['timeInput inputField', {focus: focusMinute}]">
      <div
        class="up iconButton"
        @click="minutesUp"
      >
        <a-icon button>
          $caretUpIcon
        </a-icon>
      </div>

      <v-text-field
        v-model="currentMinutes"
        dense
        outlined
        hide-details
        @wheel.prevent="onWheelMinute"
        @focus="focusMinute = true"
        @blur="updateHoursAndMinute"
      />

      <div
        class="down iconButton"
        @click="minutesDown"
      >
        <a-icon button>
          $caretDownIcon
        </a-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Watch, Vue } from 'vue-property-decorator'
import moment from 'moment'
import formatHour from '@a-vue/utils/format-hour'
import formatMinutes from '@a-vue/utils/format-minutes'

@Component({
  props: ['value']
})
export default class ATimePicker extends Vue {
  currentDate = null
  currentHour = null
  currentMinutes = null

  focusHour = false
  focusMinute = false

  created () {
    this.currentDate = new Date(this.value)

    this.initHourAndMinutes()
  }

  @Watch('value')
  valueChanged () {
    let date = new Date(this.value)
    if (this.currentHour) {
      date = moment(date).hours(this.currentHour).toDate()
    }
    if (this.currentMinutes) {
      date = moment(date).minutes(this.currentMinutes).toDate()
    }
    this.currentDate = date

    this.initHourAndMinutes()
  }

  onWheelHour (wheelEvent) {
    if (!this.focusHour) {
      return
    }
    if (wheelEvent.deltaY < 0) {
      this.hourUp()
    } else {
      this.hourDown()
    }
  }

  onWheelMinute (wheelEvent) {
    if (!this.focusMinute) {
      return
    }
    if (wheelEvent.deltaY < 0) {
      this.minutesUp()
    } else {
      this.minutesDown()
    }
  }

  get formattedHour () {
    return formatHour(this.currentDate)
  }

  get formattedMinutes () {
    return formatMinutes(this.currentDate)
  }

  get minutesValid () {
    if (!this.currentMinutes) {
      return true
    }
    if (!/^\d{1,2}$/.test(this.currentMinutes)) {
      return false
    }
    return this.currentMinutes < 60
  }

  get hourValid () {
    if (!this.currentHour) {
      return true
    }
    if (!/^\d{1,2}$/.test(this.currentHour)) {
      return false
    }
    return this.currentHour < 24
  }

  initHourAndMinutes () {
    this.currentHour = this.formattedHour
    this.currentMinutes = this.formattedMinutes
  }

  updateHoursAndMinute () {
    if (this.hourValid) {
      this.currentDate = moment(this.currentDate).hours(this.currentHour).toDate()
    }

    if (this.minutesValid) {
      this.currentDate = moment(this.currentDate).minutes(this.currentMinutes).toDate()
    }

    this.focusMinute = false
    this.focusHour = false

    this.dispatchDate()
  }

  hourUp () {
    this.currentDate = moment(this.currentDate).add(1, 'hours').toDate()
    this.dispatchDate()
  }

  hourDown () {
    this.currentDate = moment(this.currentDate).subtract(1, 'hours').toDate()
    this.dispatchDate()
  }

  minutesUp () {
    this.currentDate = moment(this.currentDate).add(15, 'minutes').toDate()
    this.dispatchDate()
  }

  minutesDown () {
    this.currentDate = moment(this.currentDate).subtract(15, 'minutes').toDate()
    this.dispatchDate()
  }

  dispatchDate () {
    this.initHourAndMinutes()
    this.$emit('input', this.currentDate)
  }
}
</script>

<style lang="scss" scoped>
.timePicker {
  display: flex;
  align-items: center;
  text-align: center;

  .timeInput {
    line-height: 0;

    > * {
      text-align: center;
      width: auto;
      font-family: monospace;
    }
  }

  .up {
    margin-bottom: -1px;
  }

  .down {
    margin-top: -3px;
  }

  .hourMinutesSeparator {
    padding: 0 .4em;
  }
}

.v-input ::v-deep(input) {
  width: 20px;
}
</style>
