<template>
  <div :class="['a-search-select', widthClass]">
    <div
      class="activator"
      @click="open"
    >
      <slot
        v-if="!autoOpen"
        name="activator"
        :open="open"
        :close="close"
      >
        <a-icon class="contextButton">
          $dotsHorizontalIcon
        </a-icon>
      </slot>
    </div>

    <v-overlay
      :value="isOpen"
      :z-index="299"
      :opacity="0"
    />

    <div :class="panelCssClass">
      <div
        v-if="isOpen"
        class="controls"
        :style="cwm_widthStyle"
      >
        <div class="background elevation-6" />

        <search-select-filters
          v-if="filtersInitialized && showFilters"
          :filters="filters"
          :count="count"
        >
          <slot
            name="filters"
            :filters="filters"
            :count="count"
            :onSearchInputKey="{
              'keydown': searchFilterKeyDown
            }"
          />
        </search-select-filters>

        <a-loading-indicator
          absolute
          top
          left
          :class="[{showFilters}]"
          :isLoading="isLoading"
        />
      </div>
    </div>

    <div :class="listCssClass">
      <search-select-list
        v-if="isOpen"
        ref="list"
        :listAction="listAction"
        :q="q"
        :selectedItems="selectedItems"
        :isDisabled="isDisabled"
        :events="false"
        :history="false"
        :filterSource="filterSource"
        :loadOnlyIfKeyword="loadOnlyIfKeyword"
        :filters.sync="filters"
        :count.sync="count"
        :isLoading.sync="isLoading"
        :style="cwm_widthStyle"
        @onLoad="onLoad"
        @enter="selectItem"
        @backtab="setFocusToSearchInput"
      >
        <template #header>
          <slot name="header" />
        </template>

        <template #row="{ model }">
          <slot
            name="row"
            :model="model"
            :on="{ click: selectHandler(model) }"
          />
        </template>

        <template #not-found="{ filters }">
          <slot
            name="not-found"
            :filters="filters"
          />
        </template>
      </search-select-list>
    </div>
  </div>
</template>


<script>
import { Component, Watch, Mixins } from '@a-vue'
import { UsesPositionServiceMixin } from '../services/position/UsesPositionServiceMixin'
import { PositionConfig } from '../services/PositionService'
import { randomCssClass } from '../utils/random'
import { FilterSourceType } from '@a-vue/components/list/FilterSourceType'
import SearchSelectFilters from './search-select/SearchSelectFilters'
import SearchSelectList from './search-select/SearchSelectList'
import { CancelOnEscMixin } from '@a-vue/services/escape/CancelOnEscMixin'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'

@Component({
  props: [
    'listAction',
    'q',
    {
      diffXControls: '-1rem',
      diffYControls: '-1rem',
      getSearchInput: {
        default: () => () => {}
      },
      loadOnlyIfKeyword: false,
      autoOpen: false,
      closeOnSelect: true,
      selectedItems: [],
      isDisabled: {
        default: () => () => false
      }
    }
  ],
  components: {
    SearchSelectFilters,
    SearchSelectList
  }
})
export default class ASearchSelect extends Mixins(ComponentWidthMixin, UsesPositionServiceMixin, CancelOnEscMixin) {
  selectId = randomCssClass(10)
  isOpen = false
  items_ = []
  filterSource = FilterSourceType.OBJECT

  isLoading = false
  filters = []
  count = 0
  showFilters = false

  mounted () {
    if (this.autoOpen) {
      this.open()
    }
  }

  destroyed () {
    this.close()
  }

  @Watch('isLoading')
  isLoadingChanged () {
    if (!this.isLoading) {
      this.positionizeList()
    }
  }

  get filtersInitialized () {
    return Object.keys(this.filters).length
  }

  get widthClass () {
    if (this.width === 'auto') {
      return 'width-auto'
    }
  }

  get panelCssClass () {
    return 'searchSelect-' + this.selectId
  }

  get listCssClass () {
    return 'searchSelectList-' + this.selectId
  }

  getContainer () {
    return document.querySelector('.v-application')
  }

  get popUp () {
    const container = this.getContainer()
    return container.querySelector('.' + this.panelCssClass)
  }

  get listPopUp () {
    const container = this.getContainer()
    return container.querySelector('.' + this.listCssClass)
  }

  positionize () {
    const position = new PositionConfig()
      .setAnchor(this, '.activator')
      .setTarget(
        document.documentElement,
        '.' + this.panelCssClass + ' .controls'
      )
      .anchorTop().targetTop()
      .anchorLeft().targetLeft()
      .diffX(this.diffXControls).diffY(this.diffYControls)
      .onPosition(this.onListPositionChanged)

    this.urp_registerPositionWatcher(position)
  }

  positionizeList () {
    const position = new PositionConfig()
      .setAnchor(
        document.documentElement,
        '.' + this.panelCssClass + ' .controls'
      )
      .setTarget(
        document.documentElement,
        '.' + this.listCssClass + ' .searchSelectList'
      )
      .anchorBottom().targetTop()
      .diffY('.5rem')
      .alternativeY(p => {
        p
          .anchorTop()
          .targetBottom()
          .diffY('-.5rem')
      })
      .onPosition(this.onListPositionChanged)

    this.urp_registerPositionWatcher(position)
  }

  open () {
    this.showFilters = false

    this.$emit('beforeOpen')

    window.addEventListener('mousedown', this.onClickOutside)

    const container = this.getContainer()

    container.appendChild(this.popUp)
    this.positionize()

    container.appendChild(this.listPopUp)
    this.positionizeList()

    this.isOpen = true

    this.coe_watchCancel()

    this.$emit('open')
  }

  close () {
    if (!this.isOpen) {
      return
    }

    this.urp_unregisterPositionWatchers()

    window.removeEventListener('mousedown', this.onClickOutside)

    this.$el.appendChild(this.popUp)

    this.$el.appendChild(this.listPopUp)

    this.isOpen = false

    this.coe_unwatchCancel()

    this.$emit('close')
  }

  selectItem (model) {
    if (this.closeOnSelect) {
      this.close()
    }
    this.$emit('select', model)
  }

  selectHandler (model) {
    return event => {
      if (this.closeOnSelect) {
        this.close()
      }
      this.$emit('select', model, {
        event
      })
    }
  }

  coe_cancelOnEsc () {
    this.close()
    return false // stop esc propagation
  }

  onClickOutside (e) {
    const popUp = this.popUp

    // no popup present
    if (!popUp) {
      return
    }

    // popup clicked
    if (popUp.contains(e.target)) {
      return
    }

    // list popup clicked
    if (this.listPopUp.contains(e.target)) {
      return
    }

    // activator clicked
    const activator = this.$el.querySelector('.activator')
    if (activator && activator.contains(e.target)) {
      return
    }

    this.close()
  }

  onListPositionChanged () {
    const background = this.popUp.querySelector('.background')
    const controls = this.popUp.querySelector('.controls')
    const list = this.listPopUp.querySelector('.searchSelectList')
    const padding = '.5rem'
    const vPadding = this.showFilters ? '.5rem' : '0px'

    const top = Math.min(0, list.offsetTop - controls.offsetTop)
    background.style.left = `calc(0px - ${padding})`
    background.style.top = `calc(${top}px - ${vPadding})`
    background.style.width = `calc(${list.offsetWidth}px + 2 * ${padding})`
    background.style.height = `calc(${controls.clientHeight}px + ${list.clientHeight}px + 2 * ${padding} + ${vPadding})`
  }

  onLoad ({models, meta}) {
    this.showFilters = meta.used_filters.page_size < meta.count_all
    if (!this.showFilters) {
      this.setFocusToList()
    }
  }

  setFocusToList () {
    this.$refs.list.setFocus()
  }

  setFocusToSearchInput () {
    const searchInput = this.getSearchInput()
    if (searchInput) {
      searchInput.setFocus(true)
    }
  }

  setWidth (width) {
    this.cwm_width_ = width
  }

  searchFilterKeyDown (event) {
    if (['Tab', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      this.setFocusToList()
      event.preventDefault()
    }
  }
}
</script>


<style scoped lang="scss">
.background {
  background: white;
  position: absolute;
  z-index: 300;
}

.controls {
  width: 400px;
  position: absolute;
  z-index: 301;
  display: block;

  padding: 0 .5rem;

  > .searchSelectFilters {
    padding: .5rem 0;
    position: relative;
    z-index: 302;
  }

  :deep(.a-row) {
    overflow: unset;
  }
}

.searchSelectList {
  width: 400px;
  position: absolute;
  z-index: 301;

  max-height: 40vh;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;

  :deep(.a-table-row) {
    &:not(.selected) {
      cursor: pointer;
    }

    &.selected {
      pointer-events: none;
    }
  }
}

.loadingIndicator {
  z-index: 303;
  margin: 0 -.5rem;
  width: calc(100% + 1rem);
  transition: none;

  &.showFilters {
    margin-top: -.5rem;
  }
}
</style>
