<template>
  <div class="listFilterBar">
    <a-row>
      <v-btn
        class="filterToggle"
        @click="collapsed = !collapsed"
      >
        <a-row>
          <v-icon color="#BBBBBB">
            $filterIcon
          </v-icon>

          <div>{{ countSelectedFilters }}/{{ countFilters }}</div>

          <v-icon
            class="contextButton ml-n1"
            size="2rem"
          >
            {{ collapsed ? '$caretRightIcon' : '$caretDownIcon' }}
          </v-icon>
        </a-row>
      </v-btn>

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
    </a-row>

    <collapse-transition>
      <div
        v-show="!collapsed"
        class="mt-4"
      >
        <a-row
          v-if="hasShortcuts"
          gap="1"
          class="shortcuts mb-2"
        >
          <slot name="shortcuts" />
        </a-row>

        <div
          style="background: #F4F4F4;"
          class="pa-4"
        >
          <a-grid
            ref="filterGrid"
            gap="3"
            cols="3"
            even
          >
            <slot />
          </a-grid>

          <a-row
            gap="6"
            class="mt-3"
          >
            <list-filter-page :has="{page: false}" />

            <a-radio-group
              v-model="dragMode"
              row
              hide-details
              @input="updateList"
            >
              <template #default>
                <v-radio value="grab">
                  <template #label>
                    <a-icon
                      :icon="{icon: grabIcon}"
                      class="ml-n1 mr-1"
                    /> Liste verschieben
                  </template>
                </v-radio>
                <v-radio value="select">
                  <template #label>
                    <a-icon
                      :icon="{icon: selectIcon}"
                      class="ml-n1 mr-1"
                    /> Text auswählen
                  </template>
                </v-radio>
              </template>
            </a-radio-group>

            <v-btn
              v-if="countSelectedFilters"
              small
              class="ml-n4"
              @click="resetFilters"
            >
              Alles zurücksetzen
            </v-btn>
          </a-row>
        </div>
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

    <list-filter-page :has="{page_size: false}" />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'
import { ListFilterEvent } from '@a-vue/events'
import { mdiTextRecognition, mdiHandBackRight } from '@mdi/js'

@Component
export default class ListFilterBar extends Vue {
  collapsed = true
  selectedFilters = []

  grabIcon = mdiHandBackRight
  selectIcon = mdiTextRecognition
  dragMode = 'grab'

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
    const coreFilters = ['q', 'qfield', 'page']
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

  resetFilters () {
    this.listView.resetFilters()
  }

  resetFilter (name) {
    this.listView.resetFilter(name)
    this.setSelectedFilter(name, null, null)
  }

  get hasShortcuts () {
    return this.$slots.shortcuts && !!this.$slots.shortcuts.length
  }

  updateList () {
    this.listView.setDragMode(this.dragMode)
  }
}
</script>


<style lang="scss" scoped>
.filterToggle {
  padding: 0 0 0 5px !important;
  margin-right: 10px;
  height: 2.5rem !important;

  div {
    font-size: .8rem;
    color: #666666;
  }
}

.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

::v-deep(.aPagination) {
  margin-top: 14px;
}
</style>
