<template>
  <v-icon
    :class="{button}"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </v-icon>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: [{button: false}]
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
