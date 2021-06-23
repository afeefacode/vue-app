import { Component, Vue, Watch } from 'vue-property-decorator'

import { QuerySourceType } from './QuerySourceType'
import { RouteFilterSource } from './RouteFilterSource'

@Component({
  props: ['models', 'meta', 'action', 'fields', 'filterHistoryKey', 'filterSource']
})
export default class ListViewMixin extends Vue {
  models_ = []
  meta_ = {}
  requestFilters = null
  isLoading = false

  created () {
    this.init()
  }

  destroyed () {
    this.requestFilters.off('change', this.filtersChanged)
  }

  init () {
    if (this.models) {
      this.models_ = this.models
      this.meta_ = this.meta
    }

    if (this.requestFilters) {
      this.requestFilters.off('change', this.filtersChanged)
    }

    const historyKey = [this.$route.path, this.filterHistoryKey].filter(i => i).join('.')
    const querySource = this.filterSource === QuerySourceType.OBJECT ? undefined : new RouteFilterSource(this.$router)
    this.requestFilters = this.action.createRequestFilters(historyKey, querySource)

    this.requestFilters.on('change', this.filtersChanged)

    this.$emit('update:filters', this.filters)

    if (this.models) {
      this.requestFilters.initFromUsed(this.meta_.used_filters, this.meta_.count_search)
      this.$emit('update:count', this.meta_.count_search)
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

  resetFilters () {
    this.requestFilters.reset()
  }

  get filters () {
    return this.requestFilters.getFilters()
  }

  get count () {
    return this.meta_.count_search || 0
  }

  async load () {
    this.isLoading = true

    const result = await this.action
      .request()
      .fields(this.fields)
      .filters(this.requestFilters.serialize())
      .send()

    this.models_ = result.data
    this.meta_ = result.meta

    if (this.meta_.used_filters) {
      this.requestFilters.initFromUsed(this.meta_.used_filters, this.meta_.count_search)
    }

    this.isLoading = false

    this.$emit('update:count', this.meta_.count_search)
  }
}
