<template>
  <div :class="['collapsible-section', {collapsed}]">
    <h-separator
      v-bind="{...$attrs, collapsible: true}"
      :collapsed.sync="collapsed"
    />

    <a-info
      v-if="showHint && hint"
      type="info"
      x-small
    >
      Inhalt eingeklappt. <a @click="collapsed = !collapsed">ausklappen</a>
    </a-info>

    <div style="height: 1px;" />

    <collapse-transition>
      <div
        v-show="!collapsed"
        class="content"
      >
        <slot />
      </div>
    </collapse-transition>
  </div>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'

@Component({
  props: [{showHint: true, isCollapsed: false}]
})
export default class CollapsibleSection extends Vue {
  collapsed = this.isCollapsed
  hint = false

  @Watch('collapsed')
  collapsedChanged () {
    if (this.collapsed) {
      setTimeout(() => {
        this.hint = this.collapsed
      }, 150)
    } else {
      this.hint = false
    }
  }
}
</script>


<style lang="scss" scoped>
.collapsible-section {
  position: relative;
}

.a-info  {
  position: absolute;
  margin-top: -1rem;
  color: #666666;
}
</style>
