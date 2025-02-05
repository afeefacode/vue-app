import { Component, Vue, Watch } from '@a-vue'
import { ListAction } from '@a-vue/api-resources/ApiActions'
import { sleep } from '@a-vue/utils/timeout'
import { ListViewModel } from '@afeefa/api-resources-client'
import axios from 'axios'

import { CurrentRouteFilterSource } from './CurrentRouteFilterSource'
import { FilterSourceType } from './FilterSourceType'

@Component({
  props: [
    'models', 'meta', // given, if already loaded
    'listAction',
    'filterHistoryKey',
    {
      filterSource: FilterSourceType.QUERY_STRING,
      loadOnlyIfKeyword: false,
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
  cancelSource = null

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
      this.lwm_setModels(this.models)
      this.meta_ = this.meta
    }

    this.listViewModel = new ListViewModel(this.listAction)
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
    this.$emit('update:filters', this.filters)
    this.$emit('update:listViewModel', this.listViewModel)

    if (this.models) {
      this.$emit('update:count', this.meta_.count_search)

      this.$emit('onLoad', {
        models: this.models_,
        meta: this.meta_
      })

      this._listLoaded()
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
    this.lwm_setModels(this.models)
    this.meta_ = this.meta
  }

  @Watch('listAction')
  listActionChanged () {
    this.init()
  }

  _filtersInitialized () {
  }

  _listLoaded () {
  }

  filtersChanged () {
    this.load()
  }

  reload () {
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

  async load () {
    if (this.loadOnlyIfKeyword && !this.filters.q.value) {
      this.lwm_setModels([])
      this.meta_ = {}
      this.$emit('update:count', 0)
      return
    }

    this.isLoading = true
    this.$emit('update:isLoading', this.isLoading)

    if (this.cancelSource) {
      this.cancelSource.cancel()
    }

    this.cancelSource = axios.CancelToken.source()
    const request = this.listViewModel.getApiRequest()

    const {models, meta} = await ListAction
      .fromRequest(request)
      .cancelSource(this.cancelSource)
      .dispatchGlobalLoadingEvents(this.events)
      .load()

    // await sleep(1)

    if (!models) { // error happened
      this.isLoading = false
      this.$emit('update:isLoading', false)
      return
    }

    this.lwm_setModels(models)
    this.meta_ = meta

    if (this.meta_.used_filters) {
      this.listViewModel.initFromUsedFilters(this.meta_.used_filters, this.meta_.count_search)
    }

    this.isLoading = false
    this.$emit('update:isLoading', false)

    this.$emit('update:count', this.meta_.count_search)

    this.$emit('onLoad', {
      models,
      meta
    })

    this._listLoaded()
  }

  lwm_setModels (models) {
    this.models_ = models
  }
}
