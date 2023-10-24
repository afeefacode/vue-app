<template>
  <div>
    <div :class="['menuContainer', {first}]">
      <div class="menu">
        <div
          v-for="(title, index) in titles"
          :key="index"
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
import { Component, Vue } from '@a-vue'

@Component({
  props: [{first: false}]
})
export default class ATabs extends Vue {
  titles = []
  icons = []
  currentIndex = 0

  mounted () {
    this.titles = this.$children.map(c => c.title)
    this.icons = this.$children.map(c => c.icon)

    this.$children[this.currentIndex].show()
  }

  setTab (index) {
    this.currentIndex = index
    const tabs = this.$slots.default.map(s => s.componentInstance)
    tabs.forEach((tab, i) => {
      if (i === this.currentIndex) {
        tab.show()
      } else {
        tab.hide()
      }
    })
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
      background: #DDDDDD;
      color: #666666;
    }
  }
}

</style>
