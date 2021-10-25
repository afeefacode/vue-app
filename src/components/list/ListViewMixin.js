import { ListAction } from '@a-vue/api-resources/ApiActions'
import { Component, Vue, Watch } from 'vue-property-decorator'

import { FilterSourceType } from './FilterSourceType'
import { RouteFilterSource } from './RouteFilterSource'

@Component({
  props: [
    'models', 'meta', // if already loaded
    'listViewRequest',
    'noEvents', 'noHistory',
    'filterHistoryKey', 'filterSource',
    'loadOnlyIfKeyword'
  ]
})
export class ListViewMixin extends Vue {
  LIST_VIEW = true

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
      // this can happen only on HMR-reload
      this.requestFilters.off('change', this.filtersChanged)
    }

    const historyKey = this.noHistory
      ? undefined
      : [this.$route.path, this.filterHistoryKey].filter(i => i).join('.')
    const filterSource = this.filterSource === FilterSourceType.OBJECT ? undefined : new RouteFilterSource(this.$router)
    const action = this.listViewRequest.getAction()
    this.requestFilters = action.createRequestFilters(historyKey, filterSource)

    this.requestFilters.on('change', this.filtersChanged)

    this.$emit('update:filters', this.filters)
    this._filtersInitialized()

    if (this.models) {
      this.requestFilters.initFromUsed(this.meta_.used_filters, this.meta_.count_search)
      this.$emit('update:count', this.meta_.count_search)
    } else {
      this.load()
    }
  }

  @Watch('$route.query')
  routeQueryChanged () {
    if (this.filterSource !== FilterSourceType.QUERY_STRING) {
      this.requestFilters.filterSourceChanged()
    }
  }

  @Watch('models')
  modelsChanged () {
    this.models_ = this.models
    this.meta_ = this.meta
  }

  _filtersInitialized () {
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

  get _loadOnlyIfKeyword () {
    return this.loadOnlyIfKeyword
  }

  async load () {
    if (this._loadOnlyIfKeyword && !this.filters.q.value) {
      this.models_ = []
      this.meta_ = {}
      this.$emit('update:count', 0)
      return
    }

    this.isLoading = true
    this.$emit('update:isLoading', this.isLoading)

    const request = this.listViewRequest
      .filters(this.requestFilters.serialize())
      .toApiRequest()

    const {models, meta} = await new ListAction()
      .setRequest(request)
      .noEvents(this.noEvents)
      .load()

    if (!models) { // error, reset filters
      this.resetFilters()
      return
    }

    this.models_ = models
    this.meta_ = meta

    if (this.meta_.used_filters) {
      this.requestFilters.initFromUsed(this.meta_.used_filters, this.meta_.count_search)
    }

    this.isLoading = false
    this.$emit('update:isLoading', this.isLoading)

    this.$emit('update:count', this.meta_.count_search)
  }
}
