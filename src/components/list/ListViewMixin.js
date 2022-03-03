import { Component, Vue, Watch } from '@a-vue'
import { ListAction } from '@a-vue/api-resources/ApiActions'
import { ListViewModel } from '@afeefa/api-resources-client'

import { CurrentRouteFilterSource } from './CurrentRouteFilterSource'
import { FilterSourceType } from './FilterSourceType'

@Component({
  props: [
    'models', 'meta', // given, if already loaded
    'listViewConfig',
    'filterHistoryKey',
    'loadOnlyIfKeyword',
    {
      filterSource: FilterSourceType.QUERY_STRING,
      events: true,
      history: true
    }
  ]
})
export class ListViewMixin extends Vue {
  LIST_VIEW = true

  listViewModel = null
  models_ = []
  meta_ = {}
  isLoading = false

  created () {
    this.init()
  }

  destroyed () {
    this.listViewModel.off('change', this.filtersChanged)
  }

  init () {
    if (this.listViewModel) {
      // this can happen only on HMR-reload
      this.listViewModel.off('change', this.filtersChanged)
    }

    const historyKey = this.history
      ? [this.$route.path, this.filterHistoryKey].filter(i => i).join('.')
      : undefined
    const filterSource = this.filterSource === FilterSourceType.QUERY_STRING
      ? new CurrentRouteFilterSource(this.$router)
      : undefined

    if (this.models) {
      this.models_ = this.models
      this.meta_ = this.meta
    }

    this.listViewModel = new ListViewModel(this.listViewConfig)
      .filterSource(filterSource, !!filterSource)
      .historyKey(historyKey, this.history)
      .usedFilters(this.meta_.used_filters || null, this.meta_.count_search || 0)
      .initFilters({
        source: !!filterSource,
        history: !!historyKey,
        used: !!this.models
      })
      .on('change', this.filtersChanged) // listen to change

    this._filtersInitialized()

    if (this.models) {
      this.$emit('update:count', this.meta_.count_search)
    } else {
      this.load()
    }
  }

  @Watch('$route.query')
  routeQueryChanged () {
    if (this.filterSource === FilterSourceType.QUERY_STRING) {
      this.listViewModel.filterSourceChanged()
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
    this.listViewModel.resetFilters()
  }

  get filters () {
    return this.listViewModel.getFilters().getEntries()
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

    const request = this.listViewModel.getApiRequest()

    const {models, meta} = await new ListAction()
      .setRequest(request)
      .noEvents(!this.events)
      .load()

    if (!models) { // error happened
      this.isLoading = false
      this.$emit('update:isLoading', this.isLoading)
      return
    }

    this.models_ = models
    this.meta_ = meta

    if (this.meta_.used_filters) {
      this.listViewModel.initFromUsedFilters(this.meta_.used_filters, this.meta_.count_search)
    }

    this.isLoading = false
    this.$emit('update:isLoading', this.isLoading)

    this.$emit('update:count', this.meta_.count_search)
  }
}
