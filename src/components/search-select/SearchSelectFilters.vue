<template>
  <div class="searchSelectFilters">
    <slot
      :filters="filters"
      :count="count"
    />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['filters', 'count']
})
export default class SearchSelectFilters extends Vue {
  LIST_VIEW = true
}
</script>


<style scoped lang="scss">
</style>
