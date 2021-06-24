<template>
  <div class="listColumnHeader">
    <div
      :class="['content', {order}]"
      @click="toggleSort"
    >
      <div :class="['text', {active}]">
        {{ text }}
      </div>

      <v-icon
        v-if="order"
        :class="['sortIcon', {active}]"
      >
        ${{ icon }}
      </v-icon>

      {{ filter.value }}
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

  get icon () {
    return this.direction === 'asc' ? 'sortAscIcon' : 'sortDescIcon'
  }
}
</script>


<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  gap: .5rem;

  &.order {
    user-select: none;
    cursor: pointer;
  }
}

.text.active {
  color: black;
}

.sortIcon {
  opacity: .3;
  &.active {
    opacity: 1;
  }
}
</style>
