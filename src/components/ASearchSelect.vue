<template>
  <div :class="['a-search-select', widthClass]">
    <div
      class="activator"
      style="width: max-content;"
      @click="open"
    >
      <slot name="activator">
        <a-icon class="contextButton">
          $dotsHorizontalIcon
        </a-icon>
      </slot>
    </div>

    <div :class="panelCssClass">
      <div
        v-if="isOpen"
        class="controls"
      >
        <div class="background elevation-6" />

        <search-select-filters
          v-if="filtersInitialized"
          :filters="filters"
          :count="count"
        >
          <slot
            name="filters"
            :filters="filters"
            :count="count"
          />
        </search-select-filters>

        <a-loading-indicator
          absolute
          top
          left
          class="loadingIndicator"
          :isLoading="isLoading"
        />
      </div>
    </div>

    <div :class="listCssClass">
      <search-select-list
        v-if="isOpen"
        v-bind="listConfig"
        :q="q"
        :noEvents="true"
        :noHistory="true"
        :filterSource="filterSource"
        :loadOnlyIfKeyword="_loadOnlyIfKeyword"
        :filters.sync="filters"
        :count.sync="count"
        :isLoading.sync="isLoading"
      >
        <template #header>
          <div />

          <slot name="header" />
        </template>

        <template #row="{ model }">
          <v-icon
            :color="model.getIcon().color"
            size="1.5rem"
            v-text="model.getIcon().icon"
          />

          <slot
            name="row"
            :model="model"
            :on="{ click: selectHandler(model) }"
          />

          <div class="lastColumn" />
        </template>

        <template #not-found>
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
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { UsesPositionServiceMixin } from '../services/position/UsesPositionServiceMixin'
import { PositionConfig } from '../services/PositionService'
import { randomCssClass } from '../utils/random'
import { QuerySourceType } from '@a-vue/components/list/QuerySourceType'
import SearchSelectFilters from './search-select/SearchSelectFilters'
import SearchSelectList from './search-select/SearchSelectList'
import { CancelOnEscMixin } from '@a-vue/services/escape/CancelOnEscMixin'

@Component({
  props: ['listConfig', 'q', 'width', 'closeOnSelect', 'loadOnlyIfKeyword'],
  components: {
    SearchSelectFilters,
    SearchSelectList
  }
})
export default class ASearchSelect extends Mixins(UsesPositionServiceMixin, CancelOnEscMixin) {
  selectId = randomCssClass(10)
  isOpen = false
  items_ = []
  filterSource = QuerySourceType.OBJECT

  isLoading = false
  filters = []
  count = 0

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

  get _loadOnlyIfKeyword () {
    return this.loadOnlyIfKeyword === undefined || this.loadOnlyIfKeyword
  }

  get _closeOnSelect () {
    return this.closeOnSelect === undefined || this.closeOnSelect
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
      .diffX('-1rem').diffY('-1rem')
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
          .diffY('-1rem')
      })
      .onPosition(this.onListPositionChanged)

    this.urp_registerPositionWatcher(position)
  }

  open () {
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

  selectHandler (model) {
    return event => {
      if (this._closeOnSelect) {
        this.close()
      }
      this.$emit('select', model, {
        event
      })
    }
  }

  coe_cancelOnEsc () {
    this.close()
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

    const top = Math.min(0, list.offsetTop - controls.offsetTop)
    background.style.left = `calc(0px - ${padding})`
    background.style.top = `calc(${top}px - ${padding})`
    background.style.width = `calc(${list.offsetWidth}px + 2 * ${padding})`
    background.style.height = `calc(${controls.clientHeight}px + ${list.clientHeight}px + 3 * ${padding})`
  }
}
</script>


<style scoped lang="scss">
.background {
  background: white;
  position: absolute;
  z-index: -1;
}

.controls {
  min-width: 400px;
  position: absolute;
  z-index: 300;
  display: block;
  padding: 0 0.5rem;
}

.searchSelectList {
  min-width: 400px;
  position: absolute;
  z-index: 301;

  max-height: 40vh;
  overflow-y: auto;
  overscroll-behavior: contain;

  ::v-deep .a-table-row > * {
    cursor: pointer;
  }
}

.loadingIndicator {
  margin: -.5rem;
  width: calc(100% + 1rem);
}
</style>
