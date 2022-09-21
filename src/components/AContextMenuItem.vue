<template>
  <div
    class="contextMenuItem"
    @click="click"
  >
    <slot />
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['to']
})
export default class AContextMenuItem extends Vue {
  get contextMenu () {
    let parent = this.$parent
    while (parent) {
      if (parent.CONTEXT_MENU) {
        return parent
      }
      parent = parent.$parent
    }
    return null
  }

  click () {
    this.contextMenu.close()
    if (this.to) {
      this.$router.push(this.to)
        .catch(() => null) // prevent duplicated navigation warning
    } else {
      this.$emit('click')
    }
  }
}
</script>


<style lang="scss" scoped>
.contextMenuItem {
  padding: 0.2rem .4rem;
  display: flex;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  text-decoration: none;
  font-size: 0.9rem;
  color: #666666;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #EEEEEE;
  }

  :deep(.v-icon) {
    display: block;
    text-align: center;
    margin-right: 0.5rem;

    svg {
      width: 1.3rem;
      height: 1.3rem;
    }
  }
}
</style>
