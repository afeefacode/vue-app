<template>
  <div class="listColumnHeader">
    <div
      :class="['content', {order}]"
      @click="toggleSort"
    >
      <div :class="['text', {active}]">
        {{ text }}
      </div>

      <svg
        v-if="order"
        :class="['sortIcon', direction, {active}]"
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="16.014"
      ><path d="M5 12.01h3l-4 4.004-4-4.003h3V0h2" /></svg>
    </div>
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['text', 'order']
})
export default class ListColumnHeader extends Vue {
  get orderValue () {
    const order = this.filter.value
    if (Object.keys(order)[0] === this.order) {
      return Object.values(order)[0]
    }
    return null
  }

  get direction () {
    if (this.orderValue) {
      return this.orderValue
    } else {
      return 'asc'
    }
  }

  get active () {
    return !!this.orderValue
  }

  get filters () {
    let parent = this.$parent
    while (parent) {
      if (parent.filters) {
        return parent.filters
      }
      parent = parent.$parent
    }
  }

  get filter () {
    return this.filters.order
  }

  toggleSort () {
    if (!this.order) {
      return
    }

    const direction = this.active
      ? this.direction === 'asc' ? 'desc' : 'asc'
      : this.direction

    this.filter.value = {
      [this.order]: direction
    }
  }
}
</script>


<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  gap: .3rem;

  &.order {
    user-select: none;
    cursor: pointer;
  }
}

.text.active {
  color: #333333;
}

.sortIcon {
  opacity: .3;
  &.active {
    opacity: 1;
  }
}

svg {
  fill: #666666;
}

svg.desc {
  transform: rotate(180deg);
}
</style>
