<template>
  <div
    id="flyingContextContainer"
    :class="{visible}"
  >
    <div class="closeButton">
      <v-btn
        fab
        x-small
        color="gray"
        target="_blank"
        title="Schließen"
        @click.prevent="hide"
      >
        <v-icon>
          $closeIcon
        </v-icon>
      </v-btn>
    </div>

    <div id="flyingContextContainer__children" />

    <div class="v-navigation-drawer__border" />
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { FlyingContextEvent } from '@a-vue/events'
import { getZIndex } from 'vuetify/lib/util/helpers'

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

    if (this.visible) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = 'auto'
    }
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
    if (!this.visible) {
      return
    }

    // check if trigger is clicked
    let parent = e.target
    while (parent) {
      if (parent.classList.contains('flyingContextTrigger')) {
        return
      }
      parent = parent.parentElement
    }

    // popup clicked
    const targetIndex = getZIndex(e.target)
    if (targetIndex > 200) {
      return
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
  height: 100%;
  min-width: 400px;
  max-width: 50vw;
  top: 0;
  background: white;
  transition: right .2s;
  padding: 2rem;
  overflow-y: auto;

  &:not(.visible) {
    right: -80vw;
  }

  .v-navigation-drawer__border {
    background-color: rgba(0, 0, 0, .12);
    left: 0;
  }

  .closeButton {
    margin: -1rem 0 2rem -1rem;
  }
}
</style>
