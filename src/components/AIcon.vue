<template>
  <v-icon
    :class="{isButton}"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </v-icon>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['button']
})
export default class AIcon extends Vue {
  get isButton () {
    return this.button !== undefined
  }
}
</script>

<style lang="scss" scoped>
.v-icon:not(.isButton)::after {
  background: none;
}
</style>
