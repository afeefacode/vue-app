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
      <template v-if="table">
        <div class="table">
          <div class="header">
            <slot name="header-table" />
          </div>

          <div
            v-for="model in models_"
            :key="model.id"
            class="row"
          >
            <slot
              name="model-table"
              :model="model"
            />
          </div>
        </div>
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
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { ListViewMixin } from '@a-vue/components/list/ListViewMixin'
import { LoadingEvent } from '@a-vue/events'

@Component({
  props: ['table']
})
export default class ListView extends Mixins(ListViewMixin) {
  @Watch('isLoading')
  isLoadingChanged () {
    if (this.noEvents === undefined || !this.noEvents) {
      if (this.isLoading) {
        this.$events.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
      } else {
        this.$events.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
      }
    }
    this.$emit('update:isLoading', this.isLoading)
  }
}
</script>


<style lang="scss" scoped>
.listView {
  max-width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
}
.filters {
  margin-bottom: 2rem;
}

.table {
  display: table;
  border-collapse: collapse;
  width: 100%;

  .header, .row {
    display: table-row;
    > * {
      display: table-cell;
      padding: .4rem;
      padding-right: 1.5rem;
      white-space: nowrap;
      vertical-align: middle;

      &.info {
        background: none !important;
        color: #888888;
      }
    }
  }

  .header {
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #999999;
    font-size: .9rem;
    > * {
      padding-right: 1rem;
    }
  }

  .row {
    border-bottom: 1px solid #DDDDDD;

    &:hover {
      background: #F4F4F4;
    }

    &:last-child {
      border: none;
    }
  }
}
</style>
