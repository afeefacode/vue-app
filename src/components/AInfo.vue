<template>
  <v-alert
    v-bind="$attrs"
    :type="type"
    :style="{display: inline ? 'inline-block' : 'block'}"
    :class="['a-info', {xSmall}]"
    dense
    border="left"
    colored-border
    elevation="3"
    v-on="$listeners"
  >
    <slot />
  </v-alert>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: [{inline: true, xSmall: false, type: 'info'}]
})
export default class AInfo extends Vue {
}
</script>

<style lang="scss" scoped>
.v-alert {
  :deep(.v-icon) {
    margin-right: .4rem;
  }

  &.xSmall {
    padding: .3rem .6rem;
    font-size: .9rem;

    :deep(.v-icon) {
      margin-left: .2rem;
      margin-right: .4rem;
    }
  }
}
</style>
