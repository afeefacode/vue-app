<template>
  <div>
    <v-label v-if="$attrs.label">
      {{ $attrs.label }}
    </v-label>

    <a-row vertical>
      <div
        v-for="(option, index) in options_"
        :key="option.itemValue"
        class="draggable-checkbox"
        :class="{ 'dragging': draggedIndex === index, 'drag-over': dragOverIndex === index }"
        @dragover="onDragOver(index, $event)"
        @dragleave="onDragLeave"
        @drop="onDrop(index, $event)"
      >
        <div class="checkbox-container">
          <div
            class="drag-handle"
            :draggable="true"
            @dragstart="onDragStart(index, $event)"
            @dragend="onDragEnd"
          >
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

@Component({
  props: ['value', 'options', 'validator']
})
export default class ACheckboxGroup extends Vue {
  value_ = []
  options_ = []
  errorMessages = []
  hasError = false
  draggedIndex = null
  dragOverIndex = null

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

  onDragStart (index, event) {
    this.draggedIndex = index
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', event.target)

    // Set the entire checkbox container as the drag image
    const checkboxContainer = event.target.closest('.draggable-checkbox')
    if (checkboxContainer) {
      event.dataTransfer.setDragImage(checkboxContainer, 0, 0)
    }
  }

  onDragEnd () {
    this.draggedIndex = null
    this.dragOverIndex = null

    this.$emit('orderChanged', this.options_)
  }

  onDragOver (index, event) {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'move'
    this.dragOverIndex = index
  }

  onDragLeave (event) {
    // Only clear dragOverIndex if we're actually leaving the draggable-checkbox container
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      this.dragOverIndex = null
    }
  }

  onDrop (index, event) {
    event.preventDefault()

    if (this.draggedIndex !== null && this.draggedIndex !== index) {
      // Create a copy of the options array
      const newOptions = [...this.options_]

      // Remove the dragged item
      const draggedItem = newOptions.splice(this.draggedIndex, 1)[0]

      // Insert it at the new position
      newOptions.splice(index, 0, draggedItem)

      // Update the options
      this.options_ = newOptions

      // Emit an event to notify parent component about the reorder
      this.$emit('reorder', newOptions)
    }

    this.draggedIndex = null
    this.dragOverIndex = null
  }
}
</script>

<style scoped>
.draggable-checkbox {
  transition: all .2s ease;
  border-radius: 4px;
  padding: 2px;
}

.draggable-checkbox:hover {
  background-color: rgba(0, 0, 0, .04);
}

.draggable-checkbox.dragging {
  opacity: .5;
  transform: scale(.95);
}

.draggable-checkbox.drag-over {
  background-color: rgba(25, 118, 210, .1);
  border: 2px dashed rgba(25, 118, 210, .3);
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.drag-handle {
  cursor: grab;
  color: rgba(0, 0, 0, .54);
  transition: all .2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
}

.drag-handle:hover {
  background-color: rgba(0, 0, 0, .08);
  color: rgba(0, 0, 0, .87);
}

.drag-handle:active {
  cursor: grabbing;
}

.draggable-checkbox .v-input--checkbox {
  pointer-events: auto;
  flex: 1;
}

.draggable-checkbox .v-input__slot {
  cursor: pointer;
}
</style>
