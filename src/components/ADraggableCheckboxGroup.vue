<template>
  <div>
    <v-label v-if="$attrs.label">
      {{ $attrs.label }}
    </v-label>

    <a-row vertical>
      <draggable
        v-model="options_"
        handle=".drag-handle"
        ghost-class="ghost"
        @end="onDragEnd"
      >
        <div
          v-for="option in options_"
          :key="option.itemValue"
          class="draggable-checkbox"
        >
          <div class="checkbox-container">
            <div class="drag-handle">
              <a-icon
                size="1.5rem"
                :icon="{icon: '$dragIcon', color: '#CCCCCC'}"
              />
            </div>

            <a-checkbox
              :label="option.itemText"
              :value="isChecked(option.itemValue)"
              hide-details
              @input="checked(option.itemValue, $event)"
            >
              <template #label>
                <div v-html="option.itemText" />
              </template>
            </a-checkbox>
          </div>
        </div>
      </draggable>
    </a-row>

    <div
      v-if="errorMessages.length"
      class="mt-1 error--text v-messages"
    >
      {{ errorMessages[0] }}
    </div>
  </div>
</template>


<script>
import { Component, Vue, Watch, Inject } from '@a-vue'
import draggable from 'vuedraggable'

@Component({
  props: ['value', 'options', 'validator'],
  components: {
    draggable
  }
})
export default class ACheckboxGroup extends Vue {
  value_ = []
  options_ = []
  errorMessages = []
  hasError = false

  @Inject({ from: 'form', default: null }) form

  created () {
    this.form && this.form.register(this)
    this.value_ = this.value || []
    this.init()
  }

  checked (key, value) {
    if (value) {
      if (!this.isChecked(key)) {
        this.value_.push(key)
      }
    } else {
      this.value_ = this.value_.filter(v => v !== key)
    }
    this.$emit('input', this.value_)
    this.validate()
  }

  isChecked (key) {
    return this.value_.includes(key)
  }

  @Watch('options')
  optionsChanged () {
    this.init()
  }

  @Watch('value')
  valueChanged (value) {
    this.value_ = value || []
  }

  async init () {
    const options = typeof this.options === 'function' ? this.options() : this.options

    if (options instanceof Promise) {
      this.options_ = await options
    } else {
      this.options_ = options
    }

    this.$nextTick(() => {
      this.validate()
    })
  }

  validate () {
    this.errorMessages = []
    if (this.validator) {
      const rules = this.validator.getRules(this.$attrs.label)
      for (const rule of rules) {
        const message = rule(this.value_)
        if (typeof message === 'string') {
          this.errorMessages.push(message)
          break
        }
      }
    }

    this.hasError = !!this.errorMessages.length // VForm will watch the hasError prop
    return !this.errorMessages.length
  }

  onDragEnd (evt) {
    this.$emit('orderChanged', this.options_)
  }
}
</script>

<style scoped>
.draggable-checkbox {
  transition: all .2s ease;
  padding: 0 5px 0 0;
}

.draggable-checkbox:hover {
  background-color: rgba(0, 0, 0, .04);
}

.ghost {
  opacity: .5;
  background-color: rgba(25, 118, 210, .1);
  border: 2px dashed rgba(25, 118, 210, .3);
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.drag-handle {
  cursor: grab;
  transition: all .2s ease;
  height: 20px;
}

.drag-handle:active {
  cursor: grabbing;
}
</style>
