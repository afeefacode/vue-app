<template>
  <v-btn
    small
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-icon
      left
      class="mr-0"
    >
      {{ icon }}
    </v-icon>
    {{ text }}
  </v-btn>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['icon', 'text']
})
export default class AIconButton extends Vue {
}
</script>
