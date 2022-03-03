<template>
  <div class="listView">
    <div class="filters">
      <slot
        name="filters"
        :filters="filters"
        :count="count"
      />
    </div>

    <template v-if="models_.length">
      <template v-if="_table">
        <a-table>
          <a-table-header>
            <div v-if="$has.icon" />

            <slot name="header-table" />
          </a-table-header>

          <a-table-row
            v-for="model in models_"
            :key="model.id"
          >
            <v-icon
              v-if="$has.icon"
              :color="model.getIcon().color"
              size="1.2rem"
              v-text="model.getIcon().icon"
            />

            <slot
              name="model-table"
              :model="model"
              :setFilter="setFilter"
            />
          </a-table-row>
        </a-table>
      </template>

      <template v-else>
        <div
          v-for="model in models_"
          :key="model.id"
        >
          <slot
            name="model"
            :model="model"
          />
        </div>
      </template>
    </template>

    <div v-else-if="!isLoading">
      Nichts gefunden. <a
        href=""
        @click.prevent="resetFilters()"
      >Filter zurücksetzen</a>
    </div>
  </div>
</template>


<script>
import { Component, Watch, Mixins } from '@a-vue'
import { ListViewMixin } from '@a-vue/components/list/ListViewMixin'
import { LoadingEvent } from '@a-vue/events'

@Component({
  props: ['table']
})
export default class ListView extends Mixins(ListViewMixin) {
  $hasOptions = ['icon']

  @Watch('isLoading')
  isLoadingChanged () {
    if (this.events) {
      if (this.isLoading) {
        this.$events.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
      } else {
        this.$events.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
      }
    }
    this.$emit('update:isLoading', this.isLoading)
  }

  get _table () {
    return this.table !== false
  }

  setFilter (name, value) {
    this.filters[name].value = value
  }
}
</script>


<style lang="scss" scoped>
.listView {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.filters {
  margin-left: 4px;
  margin-bottom: 2rem;
}

.a-table-row > :last-child {
  width: 100%;
}
</style>
