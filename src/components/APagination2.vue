<template>
  <a-row
    gap="3"
    class="aPagination2"
  >
    <nav class="pagination-nav">
      <ul>
        <li>
          <button
            :disabled="value <= 1"
            class="nav-btn"
            title="Vorherige Seite"
            @click="goTo(value - 1)"
          >
            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
          </button>
        </li>

        <li
          v-for="page in pageLinks"
          :key="page"
        >
          <button
            v-if="page === '...'"
            class="page-btn ellipsis"
            disabled
          >
            ...
          </button>
          <button
            v-else
            :class="['page-btn', { active: page === value }]"
            @click="goTo(page)"
          >
            {{ page }}
          </button>
        </li>

        <li>
          <button
            :disabled="value >= length"
            class="nav-btn"
            title="Nächste Seite"
            @click="goTo(value + 1)"
          >
            <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
          </button>
        </li>
      </ul>
    </nav>

    <slot />
  </a-row>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: {
    value: {
      type: Number,
      default: 1
    },
    length: {
      type: Number,
      default: 0
    },
    totalVisible: {
      type: Number,
      default: 5
    }
  }
})
export default class APagination2 extends Vue {
  get pageLinks () {
    const total = this.length
    const current = this.value
    const visible = Math.max(5, this.totalVisible)

    if (total <= visible) {
      return this.range(1, total)
    }

    const links = []
    const sideCount = Math.floor((visible - 3) / 2)

    let startPage = Math.max(2, current - sideCount)
    let endPage = Math.min(total - 1, current + sideCount)

    if (current <= sideCount + 2) {
      endPage = Math.min(total - 1, visible - 2)
    }

    if (current >= total - sideCount - 1) {
      startPage = Math.max(2, total - visible + 3)
    }

    links.push(1)

    if (startPage > 2) {
      links.push('...')
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(i)
    }

    if (endPage < total - 1) {
      links.push('...')
    }

    if (total > 1) {
      links.push(total)
    }

    return links
  }

  range (start, end) {
    const result = []
    for (let i = start; i <= end; i++) {
      result.push(i)
    }
    return result
  }

  goTo (page) {
    const p = Math.max(1, Math.min(page, this.length))
    if (p !== this.value) {
      this.$emit('input', p)
    }
  }
}
</script>


<style scoped lang="scss">
.pagination-nav ul {
  display: flex;
  align-items: center;
  gap: .3rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 30px;
  padding: 0 5px;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  background: #FFFFFF;
  color: #333333;
  font-size: 13px;
  cursor: pointer;
  transition: background .15s, border-color .15s;
  white-space: nowrap;

  &:hover:not(:disabled):not(.active) {
    background: #F0F0F0;
    border-color: #BBBBBB;
  }

  &:disabled {
    opacity: .4;
    cursor: default;
  }

  &.active {
    background: #1976D2;
    border-color: #1976D2;
    color: #FFFFFF;
  }

  &.ellipsis {
    border: none;
    background: none;
    cursor: default;
    min-width: 20px;
  }

  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
}
</style>
