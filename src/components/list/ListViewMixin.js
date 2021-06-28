import { ListAction } from '@a-vue/api-resources/ApiActions'
import { Component, Vue, Watch } from 'vue-property-decorator'

import { QuerySourceType } from './QuerySourceType'
import { RouteFilterSource } from './RouteFilterSource'

@Component({
  props: ['models', 'meta', 'action', 'scopes', 'fields', 'filterHistoryKey', 'filterSource']
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

  @Watch('models')
  modelsChanged () {
    this.models_ = this.models
    this.meta_ = this.meta
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

    const {models, meta} = await new ListAction()
      .setAction(this.action)
      .setFields(this.fields)
      .setScopes(this.scopes)
      .setFilters(this.requestFilters.serialize())
      .load()

    if (!models) {
      return
    }

    this.models_ = models
    this.meta_ = meta

    if (this.meta_.used_filters) {
      this.requestFilters.initFromUsed(this.meta_.used_filters, this.meta_.count_search)
    }

    this.isLoading = false

    this.$emit('update:count', this.meta_.count_search)
  }
}
