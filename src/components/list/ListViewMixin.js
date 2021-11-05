import { ListAction } from '@a-vue/api-resources/ApiActions'
import { ListViewModel } from '@afeefa/api-resources-client'
import { Component, Vue, Watch } from 'vue-property-decorator'

import { FilterSourceType } from './FilterSourceType'
import { RouteFilterSource } from './RouteFilterSource'

@Component({
  props: [
    'models', 'meta', // if already loaded
    'listViewConfig',
    'noEvents', 'noHistory',
    'filterHistoryKey', 'filterSource',
    'loadOnlyIfKeyword'
  ]
})
export class ListViewMixin extends Vue {
  LIST_VIEW = true

  models_ = []
  meta_ = {}
  isLoading = false
  listViewModel = null

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

    const historyKey = this.noHistory
      ? undefined
      : [this.$route.path, this.filterHistoryKey].filter(i => i).join('.')
    const filterSource = this.filterSource === FilterSourceType.OBJECT ? undefined : new RouteFilterSource(this.$router)

    if (this.models) {
      this.models_ = this.models
      this.meta_ = this.meta
    }

    this.listViewModel = new ListViewModel(this.listViewConfig)
      .filterSource(filterSource, true)
      .historyKey(historyKey, true)
      .usedFilters(this.meta_.used_filters || null, this.meta_.count_search || 0)
      .initFilters({
        source: true,
        history: true,
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
    if (this.filterSource !== FilterSourceType.QUERY_STRING) {
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
      .noEvents(this.noEvents === true)
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
