<template>
  <div>
    <div
      v-if="countTabs > 1 || !hideSingle"
      :class="['menuContainer', {first}]"
    >
      <div class="menu">
        <div
          v-for="(title, index) in titles"
          :key="title + '-' + index"
          :class="['label', {selected: index === currentIndex}]"
          @click="setTab(index)"
        >
          <template v-if="icons[index]">
            <a-icon
              size="1.5rem"
              :color="icons[index].color"
              class="mt-n1 mr-1"
            >
              {{ icons[index].icon }}
            </a-icon>
          </template>

          {{ title }}
        </div>
      </div>
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
import { Component, Vue, Watch } from '@a-vue'

@Component({
  props: ['beforeChange', {first: false, hideSingle: false}]
})
export default class ATabs extends Vue {
  titles = []
  icons = []
  currentIndex = 0
  countTabs = 0

  mounted () {
    this.countTabs = this.getCountTabs()
  }

  updated () {
    this.countTabs = this.getCountTabs()
  }

  @Watch('countTabs')
  countTabsChanged (oldt, newt) {
    this.$nextTick(() => {
      this.titles = this.$children.map(c => c.title).filter(t => t)
      this.icons = this.$children.map(c => c.icon).filter(i => i)

      this.setTab(0)
    })
  }

  async setTab (index) {
    if (this.beforeChange) {
      const result = await this.beforeChange(index, this.currentIndex)
      if (!result) {
        return
      }
    }

    this.currentIndex = index
    const tabs = this.$slots.default.map(s => s.componentInstance).filter(i => i)
    tabs.forEach((tab, i) => {
      if (i === this.currentIndex) {
        tab.show()
      } else {
        tab.hide()
      }
    })
  }

  getCountTabs () {
    return this.$slots.default.filter(s => !!s.tag).length // removed slot has vm.tag === undefined
  }
}
</script>

<style lang="scss" scoped>
.menuContainer {
  border-bottom: 3px solid #DDDDDD;
  margin: 2rem 0;

  &.first {
    margin-top: 0;
  }
}

.menu {
  position: relative;
  display: flex;
  justify-content: center;

  .label {
    padding: .8rem 1.2rem .7rem;
    background: white;
    cursor: pointer;

    text-transform: uppercase;
    letter-spacing: 5px;
    color: #BBBBBB;
    font-size: .8rem;
    white-space: nowrap;

    &:hover {
      background: #F4F4F4;
      color: #AAAAAA;
    }

    &.selected {
      background: #EEEEEE;
      color: #666666;
    }
  }
}

</style>
