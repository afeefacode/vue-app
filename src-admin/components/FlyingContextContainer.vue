<template>
  <div
    id="flyingContextContainer"
    :class="{visible}"
  >
    <a
      href=""
      @click.prevent="hide"
    >close</a>

    <br>
    <br>

    <div id="flyingContextContainer__children" />
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { FlyingContextEvent } from '@a-vue/events'

@Component({
  props: []
})
export default class FlyingContextContainer extends Vue {
  visible = false

  mounted () {
    this.mutationWatcher = new MutationObserver(this.domChanged)
    this.mutationWatcher.observe(this.getChildrenContainer(), { childList: true })

    window.addEventListener('mousedown', this.onClickOutside)
  }

  domChanged () {
    const container = this.getChildrenContainer()
    this.visible = !!container.children.length
  }

  hide () {
    if (this.visible) {
      this.$events.dispatch(new FlyingContextEvent(FlyingContextEvent.HIDE_ALL))
    }
  }

  getChildrenContainer () {
    return this.$el.querySelector('#flyingContextContainer__children')
  }

  onClickOutside (e) {
    // check if trigger is clicked
    let parent = e.target
    while (parent) {
      if (parent.classList.contains('flyingContextTrigger')) {
        return
      }
      parent = parent.parentElement
    }

    // check if flying context ist clicked
    if (!this.$el.contains(e.target)) {
      this.hide()
    }
  }
}
</script>


<style lang="scss" scoped>
#flyingContextContainer {
  position: fixed;
  z-index: 200;
  right: 0;
  width: 60vw;
  height: 80vh;
  top: 10vh;
  background: rgba($color: white, $alpha: .6);
  border: 1px solid black;
  transition: right .2s;

  &:not(.visible) {
    right: -80vw;
  }
}
</style>
