<template>
  <div
    :class="['a-table-row', {border: hasBorder, small, tiny, selected, disabled}]"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: [{tiny: false, small: false}, 'selected', 'disabled']
})
export default class ATableRow extends Vue {
  $hasOptions = ['border']

  get table () {
    let parent = this.$parent
    while (parent) {
      if (parent.A_TABLE) {
        return parent
      }
      parent = parent.$parent
    }
    return null
  }

  get hasBorder () {
    return this.$has.border && this.table.$has.border
  }
}
</script>


<style scoped lang="scss">
.a-table-row {
  > * {
    padding: .15rem;
    padding-right: 1.5rem;
    vertical-align: top;

    &:last-child {
      padding-right: .1rem;
    }
    overflow: hidden;
  }

  &.border {
    border-bottom: 1px solid #E5E5E5;

    > * {
      padding: .4rem 1.5rem .4rem .4rem;

      &:last-child {
        padding-right: .4rem;
      }
    }
  }

  &.selectable {
    cursor: pointer;
  }

  &:hover, &.selected {
    background: #F4F4F4;
  }

  &.disabled {
    pointer-events: none;
    opacity: .5;
  }

  &.active {
    background: #EEEEFF;
  }

  &:last-child {
    border: none;
  }

  &.small {
    font-size: .9rem;

    &.border {
      > * {
        padding-top: .2rem;
        padding-bottom: .2rem;
      }
    }

    .textblock--small {
      font-size: .8rem;
    }
  }

  &.tiny {
    font-size: .8rem;

    &.border {
      > * {
        padding-top: .1rem;
        padding-bottom: .1rem;
      }
    }

    .textblock--tiny {
      font-size: .7rem;
    }
  }

  .textblock--small {
    font-size: .9rem;
    line-height: .9;
  }

  [class*=text-] {
    color: inherit;
  }
}
</style>
