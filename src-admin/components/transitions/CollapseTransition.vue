<template>
  <transition
    name="collapse-transition"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot />
  </transition>
</template>

<script>
// concepts by https://github.com/ivanvermeyen/vue-collapse-transition
import { Component, Vue } from '@a-vue'

@Component({
  props: [{ duration: 150, min: 0 }]
})
export default class CollapseTransition extends Vue {
  enter (el, done) {
    const h = el.offsetHeight

    el.style.height = this.min + 'px'
    el.style.overflow = 'hidden'

    getComputedStyle(el).height // force repaint

    el.style.transition = 'height ' + this.duration + 'ms'
    el.style.height = h + 'px'

    setTimeout(done, this.duration)
  }

  afterEnter (el) {
    el.style.transition = ''
    el.style.overflow = ''
    el.style.height = ''
  }

  leave (el, done) {
    const h = el.offsetHeight

    el.style.height = h + 'px'
    el.style.overflow = 'hidden'

    getComputedStyle(el).height // force repaint

    el.style.transition = 'height ' + this.duration + 'ms'
    el.style.height = this.min + 'px'

    setTimeout(done, this.duration)
  }

  afterLeave (el) {
    el.style.transition = ''
    el.style.overflow = ''
    el.style.height = ''
  }
}
</script>
