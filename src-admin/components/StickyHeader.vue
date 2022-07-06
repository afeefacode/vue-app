<template>
  <div
    id="stickyHeader"
    :class="['d-flex align-center', {visible}]"
  >
    <app-bar-title-container class="appBarTitle flex-grow-1" />
    <app-bar-buttons class="appBarButtons mr-2" />
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import AppBarButtons from './app/AppBarButtons'
import AppBarTitleContainer from './app/AppBarTitleContainer'

@Component({
  components: {
    AppBarButtons,
    AppBarTitleContainer
  }
})
export default class StickyHeader extends Vue {
  visible = false

  mounted () {
    // watch mutation
    this.mutationWatcher = new MutationObserver(this.domChanged)
    this.mutationWatcher.observe(this.$el.querySelector('.appBarTitle'), { childList: true })
    this.mutationWatcher.observe(this.$el.querySelector('.appBarButtons'), { childList: true })

    // watch intersection
    const el = document.querySelector('#stickyHeader')
    const observer = new IntersectionObserver(
      ([e]) => {
        e.target.classList.toggle('is-pinned', e.intersectionRatio < 1)
      },
      { threshold: [1] }
    )
    observer.observe(el)

    this.domChanged()
  }

  domChanged () {
    this.visible = this.hasItems()
  }

  hasItems () {
    return !!(this.$el.querySelector('.appBarTitle').children.length +
      this.$el.querySelector('.appBarButtons').children.length)
  }
}
</script>


<style lang="scss" scoped>
#stickyHeader {
  position: sticky;
  top: -1px;
  margin: -1rem -2rem 2rem;
  padding: 1rem 2rem;

  &:not(.visible) {
    display: none !important;
  }

  &.is-pinned {
    background: white;
    z-index: 2;
    box-shadow: 0 4px 7px -4px #00000033;
  }
}
</style>
