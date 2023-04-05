<template>
  <v-alert
    v-bind="$attrs"
    :style="{display: inline ? 'inline-block' : 'block'}"
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
  props: [{inline: true}]
})
export default class AInfo extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
