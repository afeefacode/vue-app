<template>
  <div>
    <div class="filters">
      <slot name="filters" />
    </div>

    <template v-if="models.length">
      <div
        v-for="model in models"
        :key="model.id"
      >
        <slot
          name="model"
          :model="model"
        />
      </div>
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
import ListViewMixin from '@a-vue/components/list/ListViewMixin'
import { LoadingEvent } from '@a-vue/events'

@Component
export default class ListView extends Mixins(ListViewMixin) {
  @Watch('isLoading')
  isLoadingChanged () {
    if (this.isLoading) {
      this.$events.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
    } else {
      this.$events.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
    }
  }
}
</script>


<style lang="scss" scoped>
.filters {
  margin-bottom: 3rem;
}
</style>
