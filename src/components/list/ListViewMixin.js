import { Component, Vue, Watch } from 'vue-property-decorator'

import { QuerySourceType } from './QuerySourceType'
import { RouteFilterSource } from './RouteFilterSource'

@Component({
  props: ['apiResponse', 'filterHistoryKey', 'filterSource', 'action', 'fields']
})
export default class ListViewMixin extends Vue {
  models = []
  meta = {}
  requestFilters = null
  isLoading = false

  created () {
    this.init()
  }

  destroyed () {
    this.requestFilters.off('change', this.filtersChanged)
  }

  init () {
    if (this.apiResponse) {
      this.models = this.apiResponse.data
      this.meta = this.apiResponse.meta
    }

    if (this.requestFilters) {
      this.requestFilters.off('change', this.filtersChanged)
    }

    const historyKey = [this.$route.path, this.filterHistoryKey].filter(i => i).join('.')
    const querySource = this.filterSource === QuerySourceType.OBJECT ? undefined : new RouteFilterSource(this.$router)
    this.requestFilters = this.action.createRequestFilters(historyKey, querySource)

    this.requestFilters.on('change', this.filtersChanged)

    this.$emit('update:filters', this.filters)

    if (this.apiResponse) {
      this.requestFilters.initFromUsed(this.meta.used_filters, this.meta.count_search)
      this.$emit('update:count', this.meta.count_search)
    } else {
    this.load()
  }
  }

  @Watch('$route.query')
  routeQueryChanged () {
    if (this.filterSource !== QuerySourceType.ROUTE) {
      this.requestFilters.querySourceChanged()
    }
  }

  filtersChanged () {
    this.load()
  }

  /**
   * Used by ListFilter
   */
  get filters () {
    return this.requestFilters.getFilters()
  }

  resetFilters () {
    this.requestFilters.reset()
  }

  async load () {
    this.isLoading = true

    const result = await this.action
      .request()
      .fields(this.fields)
      .filters(this.requestFilters.serialize())
      .send()

    this.models = result.data
    this.meta = result.meta

    if (this.meta.used_filters) {
      this.requestFilters.initFromUsed(this.meta.used_filters, this.meta.count_search)
    }

    this.isLoading = false

    this.$emit('update:count', this.meta.count_search)
  }
}
