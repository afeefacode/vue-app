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
  currentIndex = 0

  mounted () {
    console.log(this.$children)

    this.titles = this.$children.map(c => c.title)

    this.$children[this.currentIndex].show()
  }

  setTab (index) {
    this.currentIndex = index
    this.$children.forEach((tab, i) => {
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
  border-bottom: 2px solid #EEEEEE;
  margin: 2rem 0;

  &.first {
    margin-top: 0;
  }
}

.menu {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: -2px;

  .label {
    padding: .6rem 1.5rem .5rem;
    border-bottom: 2px solid #EEEEEE;
    // border-top-left-radius: 6px;
    // border-top-right-radius: 6px;
    background: white;
    cursor: pointer;

    text-transform: uppercase;
    letter-spacing: 5px;
    color: #CCCCCC;
    font-size: .8rem;
    white-space: nowrap;

    &.selected {
      padding-top: .3rem;

      border-left: 2px solid #EEEEEE;
      border-top: 2px solid #EEEEEE;
      border-right: 2px solid #EEEEEE;
      border-bottom: none;
    }
  }
}

</style>
