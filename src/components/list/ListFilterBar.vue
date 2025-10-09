<template>
  <div class="listFilterBar">
    <a-row>
      <list-filter-search2
        label="Suche"
        maxWidth="220"
        focus
        :translateOption="title => {
          return title
            .replace('Sprint', $t('SPRINT'))
            .replace('Kunde', $t('KUNDE'))
        }"
      />

      <div
        class="filterToggle"
        @click="collapsed = !collapsed"
      >
        <a-row>
          <v-icon
            class="mr-2"
            color="#CCCCCC"
          >
            $filterIcon
          </v-icon>

          <div>Filter {{ countSelectedFilters }}/{{ countFilters }}</div>

          <v-icon
            class="contextButton"
            size="2rem"
          >
            {{ collapsed ? '$caretRightIcon' : '$caretDownIcon' }}
          </v-icon>
        </a-row>
      </div>
    </a-row>

    <collapse-transition>
      <div
        v-show="!collapsed"
        class="content"
      >
        <a-grid
          ref="filterGrid"
          gap="3"
          cols="3"
          even
          class="mt-4 pa-4"
          style="background: #F4F4F4;"
        >
          <slot />
        </a-grid>
      </div>
    </collapse-transition>

    <div
      v-if="collapsed"
      :class="['chip-container', selectedFilters.length ? 'mt-4' : '']"
    >
      <v-chip
        v-for="filter in selectedFilters"
        :key="filter.name"
        color="#EEEEEE"
        text-color="#666666"
        close
        @click:close="resetFilter(filter.name)"
      >
        <div>{{ filter.label }}: <b>{{ filter.value }}</b></div>
      </v-chip>
    </div>

    <list-filter-page />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'
import { ListFilterEvent } from '@a-vue/events'

@Component
export default class ListFilterBar extends Vue {
  collapsed = true
  selectedFilters = []

  created () {
    this.$events.on(ListFilterEvent.CHANGE, this.listFilterChanged)
  }

  destroyed () {
    this.$events.off(ListFilterEvent.CHANGE, this.listFilterChanged)
  }

  get listView () {
    let parent = this.$parent
    while (parent) {
      if (parent.LIST_VIEW) {
        return parent
      }
      parent = parent.$parent
    }
    return null
  }

  get filters () {
    return this.listView.filters
  }

  get countFilters () {
    return this.$slots.default.filter(vnode => !!vnode.tag).length
  }

  get countSelectedFilters () {
    const coreFilters = ['q', 'qfield', 'page', 'page_size']
    let minus = 0
    for (const name of coreFilters) {
      if (!this.filters[name].hasDefaultValueSet()) {
        minus++
      }
    }
    return Object.values(this.filters).filter(f => !f.hasDefaultValueSet()).length - minus
  }

  listFilterChanged ({payload: {name, label, value}}) {
    this.setSelectedFilter(name, label, value)
  }

  setSelectedFilter (name, label, value) {
    const hasValue = !this.filters[name].hasDefaultValueSet()

    if (!hasValue) {
      this.selectedFilters = this.selectedFilters.filter(f => f.name !== name)
    } else {
      if (this.selectedFilters.some(f => f.name === name)) {
        this.selectedFilters = this.selectedFilters.map(f => {
          if (f.name === name) {
            return { name, label, value }
          }
          return f
        })
      } else {
        this.selectedFilters.push({ name, label, value })
      }
    }
  }

  resetFilter (name) {
    this.listView.resetFilter(name)
    this.setSelectedFilter(name, null, null)
  }
}
</script>


<style lang="scss" scoped>
.filterToggle {
  cursor: pointer;
  background: #F4F4F4;
  padding: 0 4px;
  margin-left: .5rem;
}

.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

::v-deep(.aPagination) {
  margin-top: 14px;
}

::v-deep(.pageSizeSelect) {
  margin-top: 15px;
}

</style>
