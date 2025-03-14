<template>
  <div :class="['a-date-picker', {'type--month': type === 'month'}]">
    <v-text-field
      ref="input"
      :value="formattedDate"
      :label="label"
      :placeholder="type === 'month' ? '' : 'DD.MM.JJJJ'"
      :style="cwm_widthStyle"
      v-bind="{...$attrs, dense, outlined}"
      :error-messages="errorMessages"
      append-icon="$calendarIcon"
      :readonly="type === 'month'"
      :clearable="clearable"
      @input="dateInputChanged"
      @click:clear="clearDate"
      @click:append="open"
      @mouseup="openIfMonth"
    />

    <v-overlay
      :value="isOpen"
      :z-index="299"
      :opacity="0"
    />

    <div :class="popUpCssClass">
      <div
        v-if="isOpen"
        class="popUpContent elevation-6"
      >
        <v-date-picker
          :value="date"
          no-title
          :type="type"
          v-bind="$attrs"
          :first-day-of-week="1"
          @input="dateChanged"
        />
      </div>
    </div>
  </div>
</template>


<script>
import { Component, Mixins, Watch } from '@a-vue'
import { formatDate } from '@a-vue/utils/format-date'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'
import { UsesPositionServiceMixin } from '../services/position/UsesPositionServiceMixin'
import { CancelOnEscMixin } from '@a-vue/services/escape/CancelOnEscMixin'
import { PositionConfig } from '../services/PositionService'
import { randomCssClass } from '../utils/random'

@Component({
  props: ['value', 'validator', 'type', {dense: true, outlined: true, focus: false}]
})
export default class ADatePicker extends Mixins(ComponentWidthMixin, UsesPositionServiceMixin, CancelOnEscMixin) {
  value_ = null
  errorMessages = []
  popUpId = randomCssClass(10)
  isOpen = false

  created () {
    this.value_ = this.value
  }

  mounted () {
    this.setFocus()

    this.validate()
  }

  @Watch('value')
  valueChanged () {
    this.value_ = this.value
    this.validate()
  }

  @Watch('focus')
  focusChanged () {
    this.setFocus()
  }

  get clearable () {
    if (this.validator && this.validator.getParam('filled')) {
      return false
    }
    return true
  }

  openIfMonth () {
    if (this.type === 'month') {
      this.open()
    }
  }

  open () {
    window.addEventListener('mousedown', this.onClickOutside)

    const container = this.getContainer()

    container.appendChild(this.popUp)
    this.positionize()

    this.isOpen = true

    this.coe_watchCancel()

    this.$emit('open')
  }

  close () {
    if (!this.isOpen) {
      return
    }

    this.urp_unregisterPositionWatchers()

    window.removeEventListener('mousedown', this.onClickOutside)

    this.$el.appendChild(this.popUp)

    this.isOpen = false

    this.coe_unwatchCancel()

    this.$emit('close')
  }

  positionize () {
    const position = new PositionConfig()
      .setAnchor(this.$refs.input, '.v-input__slot')
      .setTarget(
        document.documentElement,
        '.' + this.popUpCssClass + ' .popUpContent'
      )
      .targetTop()
      .anchorBottom()
      .diffY('.5rem')
      .alternativeY(p => {
        p.targetBottom().anchorTop().diffY('-.5rem')
      })

    this.urp_registerPositionWatcher(position)
  }

  get popUpCssClass () {
    return 'popUp-' + this.popUpId
  }

  getContainer () {
    return document.querySelector('.v-application')
  }

  get popUp () {
    const container = this.getContainer()
    return container.querySelector('.' + this.popUpCssClass)
  }

  coe_cancelOnEsc () {
    this.close()
    return false // stop esc propagation
  }

  onClickOutside (e) {
    const popUp = this.popUp

    // no popup present
    if (!popUp) {
      return
    }

    // popup clicked
    if (popUp.contains(e.target)) {
      return
    }

    // activator clicked
    const activator = this.$refs.input.$el
    if (activator && activator.contains(e.target)) {
      return
    }

    this.close()
  }

  get date () {
    if (!this.value_) {
      return null
    }

    return this.dateToString(this.value_).substr(0, this.type === 'month' ? 7 : 10)
  }

  dateToString (date) {
    // format date to v-date-picker compatible string: https://stackoverflow.com/a/29774197
    // respecting and adding local time zone time shift to the utc iso string
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset * 60 * 1000))
    return date.toISOString()
  }

  get label () {
    return this.$attrs.label
  }

  clearDate () {
    this.value_ = null
    this.validate()
    this.$emit('input', this.value_)
  }

  textInputIsDate (value) {
    return value && value.match(/^(3[01]|[12][0-9]|0?[1-9]).(1[012]|0?[1-9]).((?:19|20)\d{2})$/)
  }

  dateInputChanged (value) {
    if (!value) {
      this.dateChanged(null)
    } else if (this.validateTextInput(value)) {
      const [day, month, year] = value.split('.')
      const date = new Date(year + '-' + month + '-' + day)
      this.dateChanged(this.dateToString(date).split('T')[0])
    }
  }

  dateChanged (date) { // date is a yyyy-mm or yyyy-mm-dd string
    if (date) {
      // take given date string an create a local time date object
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
      // > When the time zone offset is absent, date-only forms are interpreted as a UTC time and date-time forms are interpreted as local time.
      const timeString = this.value_ ? this.value_.toTimeString().split(' ')[0] : '00:00:00'
      const dateStringThatGetsConvertedToLocalDate = date + 'T' + timeString
      this.value_ = new Date(dateStringThatGetsConvertedToLocalDate)
    } else {
      this.value_ = null
    }

    this.validate()

    this.close()
    this.$emit('input', this.value_)
  }

  get formattedDate () {
    const date = this.value_
    if (!date) {
      return null
    }
    if (this.type === 'month') {
      const monthName = date.toLocaleString('default', { month: 'long' })
      return monthName + ' ' + date.getFullYear()
    }
    return formatDate(date)
  }

  validate () {
    this.errorMessages = []
    if (this.validator) {
      const rules = this.validator.getRules(this.label)
      for (const rule of rules) {
        const message = rule(this.value_)
        if (typeof message === 'string') {
          this.errorMessages.push(message)
          break
        }
      }
    }
  }

  validateTextInput (value) {
    this.errorMessages = []
    const rules = this.textInputValidationRules
    for (const rule of rules) {
      const message = rule(value)
      if (typeof message === 'string') {
        this.errorMessages.push(message)
        break
      }
    }
    return !this.errorMessages.length
  }

  get textInputValidationRules () {
    if (this.type === 'month') {
      return []
    }

    return [v => {
      if (v && !this.textInputIsDate(v)) {
        return 'Das Datum sollte das Format TT.MM.JJJJ haben.'
      }
      return true
    }]
  }

  get dateValidationRules () {
    if (this.validator) {
      return this.validator.getRules(this.label)
    }
    return []
  }

  setFocus (force = false) {
    const focus = this.focus || force // set focus if this.focus or else if forced from outside
    if (focus) {
      // if run in a v-dialog, the dialog background would
      // steal the focus without requestAnimationFrame
      requestAnimationFrame(() => {
        this.$el.querySelector('input').focus()
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.popUpContent {
  min-height: 2.2rem;
  position: absolute;
  z-index: 400;
  display: block;
  background-color: white;
  padding: .5rem;
  transition: left .2s;
}

.a-date-picker.type--month :deep(input) {
  cursor: pointer;
}

.v-text-field :deep(.v-input__icon--clear) { // always show clear icon, https://github.com/vuetifyjs/vuetify/pull/15876
  opacity: 1;
}
</style>
