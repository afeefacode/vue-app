<template>
  <a-row
    :gap="gap || 4"
    class="mb-0"
  >
    <slot />
  </a-row>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['gap']
})
export default class ListFilterRow extends Vue {
}
</script>


<style scoped lang="scss">
:deep(.v-text-field__details) {
  display: none;
}
</style>
