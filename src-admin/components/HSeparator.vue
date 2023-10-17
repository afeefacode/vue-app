<template>
  <div :class="['h-separator', {first}]">
    <hr>

    <div
      :class="['label', {collapsible}]"
      @click="collapseClick"
    >
      {{ label }}

      <template v-if="collapsible">
        <v-icon class="contextButton mt-n1 ml-n2">
          {{ collapsed_ ? '$caretRightIcon' : '$caretDownIcon' }}
        </v-icon>
      </template>
    </div>
  </div>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'

@Component({
  props: ['label', {first: false, collapsible: false, collapsed: false}]
})
export default class HSeparator extends Vue {
  collapsed_ = false

  created () {
    this.collapsed_ = this.collapsed
  }

  @Watch('collapsed')
  collapsedChangedFromOutside () {
    this.collapsed_ = this.collapsed
  }

  collapseClick () {
    this.collapsed_ = !this.collapsed_
    this.$emit('update:collapsed', this.collapsed_)
  }
}
</script>


<style lang="scss" scoped>
.h-separator {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 5rem 0 3rem;

  &.first{
    margin-top: 0;
  }
}

hr {
  border: none;
  border-top: 2px solid #EEEEEE;
}

.label {
  position: absolute;
  background: white;
  padding: 0 1rem;
  text-transform: uppercase;
  letter-spacing: 5px;
  color: #CCCCCC;
  font-size: .8rem;
  white-space: nowrap;

  left: 45%;
  transform: translateX(-50%);

  &.collapsible {
    cursor: pointer;

    &:hover {
      color: #333333;

      .v-icon {
        color: #333333 !important;
      }
    }
  }
}
</style>
