<template>
  <v-icon
    :class="{button}"
    :color="icon && icon.color || $attrs.color"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-if="icon">
      {{ icon.icon }}
    </template>

    <slot v-else />
  </v-icon>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['icon', {button: false}]
})
export default class AIcon extends Vue {
}
</script>

<style lang="scss" scoped>
.v-icon:not(.button)::after {
  background: none;
}

.v-icon.button {
  cursor: pointer;
}
</style>
