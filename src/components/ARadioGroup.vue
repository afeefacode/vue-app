<template>
  <v-radio-group
    ref="radios"
    :rules="validationRules"
    :class="{hasLabel: $has.label, alignTop}"
    :valueComparator="compareValues"
    v-bind="$attrs"
    @change="$emit('input', $event)"
  >
    <slot v-if="$slots.default" />

    <template v-else>
      <v-radio
        v-for="option in options_"
        :key="option.itemText"
        :value="option.itemValue"
      >
        <template #label>
          <div>
            <div v-html="option.itemText" />
            <div
              v-if="hints(option.itemValue)"
              class="hint"
              v-html="hints(option.itemValue)"
            />
          </div>
        </template>
      </v-radio>
    </template>
  </v-radio-group>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'
import { Model } from '@afeefa/api-resources-client'

@Component({
  props: [
    'options',
    'validator',
    {
      alignTop: false,
      hints: {
        default: () => () => {}
      }
    }
  ]
})
export default class ARadioGroup extends Vue {
  $hasOptions = ['label']

  options_ = []

  created () {
    this.init()
  }

  @Watch('options')
  optionsChanged () {
    this.init()
  }

  async init () {
    const options = typeof this.options === 'function' ? this.options() : this.options

    if (options instanceof Promise) {
      this.options_ = await options
    } else {
      this.options_ = options
    }

    if (this.validator) {
      this.$nextTick(() => {
        this.$refs.radios.validate(true)
      })
    }
  }

  compareValues (a, b) {
    if (a instanceof Model && b instanceof Model) {
      return a.equals(b)
    }
    return JSON.stringify(a) === JSON.stringify(b)
  }

  get validationRules () {
    const label = this.$attrs.label
    return (this.validator && this.validator.getRules(label)) || []
  }
}
</script>

<style lang="scss" scoped>
.v-input {
  margin: 0;
  padding: 0;

  &.alignTop .v-radio {
    align-items: flex-start;
  }

  &:not(.hasLabel) {
    :deep(legend) {
      display: none;
    }
  }

  .hint {
    font-size: .9rem;
    color: #999999;
  }
}
</style>
