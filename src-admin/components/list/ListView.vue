<template>
  <div class="listView">
    <div class="filters">
      <slot
        name="filters"
        :filters="filters"
        :count="count"
      />
    </div>

    <slot
      v-if="$scopedSlots.models"
      name="before-models"
    />

    <template v-if="models_.length">
      <template v-if="$scopedSlots.models">
        <slot
          name="models"
          :models="models_"
        />
      </template>

      <template v-else-if="$scopedSlots['model-table']">
        <a-table>
          <a-table-header>
            <div v-if="$has.icon" />

            <slot name="header-table" />
          </a-table-header>

          <a-table-row
            v-for="model in models_"
            :key="model.id"
            v-flying-context-trigger="hasFlyingContext"
            :class="{selectable: hasFlyingContext}"
            v-bind="getRowAttributes(model)"
            v-on="getRowListeners(model)"
            @click="emitFlyingContext(model)"
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
            />
          </a-table-row>
        </a-table>
      </template>

      <template v-else-if="$scopedSlots.model">
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
  props: ['rowAttributes', 'rowListeners']
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

  getRowAttributes (model) {
    if (typeof this.rowAttributes === 'function') {
      return this.rowAttributes(model)
    }
    return this.rowAttributes
  }

  getRowListeners (model) {
    return (this.rowListeners && this.rowListeners(model)) || {}
  }

  get hasFlyingContext () {
    return !!this.$listeners.flyingContext
  }

  emitFlyingContext (model) {
    if (window.getSelection().toString()) { // do not open if text selected
      console.log(window.getSelection().toString())
      return
    }
    this.$emit('flyingContext', model)
  }
}
</script>


<style lang="scss" scoped>
.listView {
  max-width: 100%;
  padding-top: .2rem; // unless, floating input labels might be cut
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
