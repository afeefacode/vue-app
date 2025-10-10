<template>
  <div
    class="listView"
    @mousedown="startShifting"
  >
    <div
      v-if="$has.filters"
      class="filters"
    >
      <slot
        name="filters"
        :filters="filters"
        :count="count"
      />
    </div>

    <slot
      v-if="$scopedSlots.models"
      name="before-models"
    />

    <template v-if="models_.length">
      <template v-if="$scopedSlots.models">
        <slot
          name="models"
          :models="models_"
          :filters="filters"
        />
      </template>

      <template v-else-if="$scopedSlots['model-table']">
        <div :class="['a-table-wrapper', _dragMode]">
          <a-table>
            <a-table-header>
              <div v-if="_bulkSelection" />

              <div v-if="$has.icon">
                <slot name="header-icon" />
              </div>

              <slot name="header-table" />
            </a-table-header>

            <template v-for="(model, index) in models_">
              <a-table-row
                :key="'model' + model.id"
                v-flying-context-trigger="hasFlyingContext"
                :class="[
                  getRowClasses(model),
                  { hasSubModels: !!getSubModels(model).length }
                ]"
                v-bind="getRowAttributes(model)"
                v-on="getRowListeners(model)"
                @click="emitFlyingContext(model)"
              >
                <div
                  v-if="_bulkSelection"
                  class="pr-2"
                >
                  <a-checkbox
                    :value="isSelected(model)"
                    hide-details
                    class="pa-0"
                    @input="selectModel(model)"
                  />
                </div>

                <v-icon
                  v-if="$has.icon"
                  :color="model.getIcon().color"
                  size="1.2rem"
                  v-text="model.getIcon().icon"
                />

                <slot
                  name="model-table"
                  :model="model"
                  :index="index"
                  :filters="filters"
                />
              </a-table-row>

              <a-table-row
                v-for="(subModel, subIndex) in getSubModels(model)"
                :key="subModel.id"
                small
                :class="{
                  ...getRowClasses(model),
                  last: subIndex === getSubModels(model).length - 1,
                  subModel: true
                }"
              >
                <div v-if="_bulkSelection" />

                <div v-if="$has.icon" />

                <slot
                  name="subModel-table"
                  :model="subModel"
                  :index="subIndex"
                  :filters="filters"
                />
              </a-table-row>
            </template>
          </a-table>
        </div>
      </template>

      <template v-else-if="$scopedSlots.model">
        <div
          v-for="model in models_"
          :key="model.id"
        >
          <slot
            name="model"
            :model="model"
            :filters="filters"
          />
        </div>
      </template>
    </template>

    <div v-else-if="!isLoading">
      <div v-if="$scopedSlots['not-found']">
        <slot name="not-found" />
      </div>

      <a-info
        v-else
        type="warning"
      >
        <div v-if="$has.filters && meta_.count_all">
          Nichts gefunden. <a
            href=""
            @click.prevent="resetFilters()"
          >Filter zurücksetzen</a>
        </div>

        <div v-else>
          Nichts gefunden.
        </div>
      </a-info>
    </div>

    <div
      v-if="$has.filters"
      class="filters filters-below"
    >
      <slot
        name="filters-below"
        :filters="filters"
        :count="count"
      />
    </div>
  </div>
</template>


<script>
import { Component, Watch, Mixins } from '@a-vue'
import { ListViewMixin } from '@a-vue/components/list/ListViewMixin'

@Component({
  props: [
    'rowAttributes',
    'rowClasses',
    'rowListeners',
    {
      bulkSelection: false,
      dragMode: 'grab',
      getSubModels: {
        default: () => model => []
      }
    }
  ]
})
export default class ListView extends Mixins(ListViewMixin) {
  $hasOptions = ['icon', 'filters']

  xStart = null
  scrollLeftStart = null
  scrollContainerX = null
  yStart = null
  scrollTopStart = null
  scrollContainerY = null

  selectedModels = []

  dragMode_ = null
  bulkSelection_ = null

  created () {
    this.dragMode_ = this.dragMode
    this.bulkSelection_ = this.bulkSelection
  }

  setDragMode (mode) {
    this.dragMode_ = mode
  }

  get _dragMode () {
    return this.dragMode_
  }

  setBulkSelection (mode) {
    this.bulkSelection_ = mode
  }

  get _bulkSelection () {
    return this.bulkSelection_
  }

  isSelected (model) {
    return this.selectedModels.includes(model)
  }

  deselectAll () {
    this.selectedModels = []
    this.$emit('update:selectedModels', this.selectedModels)
  }

  selectModel (model) {
    if (!this.isSelected(model)) {
      this.selectedModels.push(model)
    } else {
      this.selectedModels = this.selectedModels.filter(m => m !== model)
    }
    this.$emit('update:selectedModels', this.selectedModels)
  }

  _listLoaded () {
    this.deselectAll()
  }

  @Watch('isLoading')
  isLoadingChanged () {
    this.$emit('update:isLoading', this.isLoading)
  }

  getRowAttributes (model) {
    if (typeof this.rowAttributes === 'function') {
      return this.rowAttributes(model)
    }
    return this.rowAttributes || {}
  }

  getRowClasses (model) {
    let classes

    if (typeof this.rowClasses === 'function') {
      classes = this.rowClasses(model)
    } else {
      classes = this.rowClasses || {}
    }

    if (Array.isArray(classes)) { // ['a', {b: true/false}, 'c']
      classes = classes.reduce((ac, a) => {
        if (typeof a === 'object') { // {className: true/false}
          return {...ac, ...a}
        }
        return {...ac, [a]: true} // 'className'
      }, {})
    } else if (typeof classes === 'string') { // 'a b c'
      classes = {
        [classes]: true
      }
    } // else { a: true, b: true, c: true }

    classes = {
      clickable: this.hasClickListener,
      selectable: this.hasFlyingContext,
      ...classes
    }

    return classes
  }

  getRowListeners (model) {
    return (this.rowListeners && this.rowListeners(model)) || {}
  }

  get hasFlyingContext () {
    return !!this.$listeners.flyingContext
  }

  get hasClickListener () {
    return !!this.getRowListeners().click
  }

  emitFlyingContext (model) {
    if (window.getSelection().toString()) { // do not open if text selected
      // console.log(window.getSelection().toString())
      return
    }
    this.$emit('flyingContext', model)
  }

  startShifting (event) {
    if (this._dragMode !== 'grab') {
      return
    }

    this.scrollContainerX = this.getScrollParent(this.$el.querySelector('.a-table-wrapper'), 'h')
    this.scrollContainerY = this.getScrollParent(this.$el.querySelector('.a-table-wrapper'), 'v')

    if (this.scrollContainerX || this.scrollContainerY) {
      window.addEventListener('mouseup', this.stopShifting)
      window.addEventListener('mousemove', this.shift)

      this.$el.style.userSelect = 'none'

      if (this.scrollContainerX) {
        this.xStart = event.clientX
        this.scrollLeftStart = this.scrollContainerX.scrollLeft
      }

      if (this.scrollContainerY) {
        this.yStart = event.clientY
        this.scrollTopStart = this.scrollContainerY.scrollTop
      }
    }
  }

  stopShifting (event) {
    window.removeEventListener('mouseup', this.stopShifting)
    window.removeEventListener('mousemove', this.shift)

    this.$el.style.userSelect = 'auto'
  }

  shift (event) {
    if (this.scrollContainerX || this.scrollContainerY) {
      if (this.scrollContainerX) {
        const diffX = this.xStart - event.clientX
        this.scrollContainerX.scrollLeft = this.scrollLeftStart + diffX
      }

      if (this.scrollContainerY) {
        const diffY = this.yStart - event.clientY
        this.scrollContainerY.scrollTop = this.scrollTopStart + diffY
      }
    }
  }

  @Watch('$route.name')
  routeChanged () {
    if (this.scrollContainerX) {
      this.scrollContainerX.scrollLeft = 0
    }

    if (this.scrollContainerY) {
      this.scrollContainerY.scrollTop = 0
    }
  }

  getScrollParent (node, direction) {
    if (node == null) {
      return null
    }

    if (direction === 'h' && (node.scrollWidth > node.clientWidth)) {
      return node
    }

    if (direction === 'v' && (node.scrollHeight > node.clientHeight)) {
      return node
    }

    return this.getScrollParent(node.parentNode, direction)
  }
}
</script>


<style lang="scss" scoped>
.listView {
  max-width: 100%;
  padding-top: .2rem; // unless, floating input labels might be cut
}

.a-table-wrapper {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 1rem;

  &.grab {
    cursor: grab;
  }
}

.filters:not(:empty) {
  margin-left: 4px;
  margin-bottom: 1rem;
}

filters-below:not(:empty) {
  margin-left: 4px;
  margin-top: 2rem;
}

:deep(.a-table-row > :last-child) {
  width: 100%;
}

.a-table-row.clickable {
  cursor: pointer;
}

:deep(.a-table-row.hasSubModels) > * {
  padding-bottom: 0;
  border: none;
}

:deep(.a-table-row.small.subModel) > * {
  padding-top: 0;
  color: gray;
}

:deep(.a-table-row.small.subModel):not(.last) > * {
  border: none;
  padding-bottom: 0;
}
</style>
