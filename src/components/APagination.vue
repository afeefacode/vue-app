<template>
  <a-row gap="3">
    <v-pagination
      ref="pagination"
      class="pagination-nav"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <slot />
  </a-row>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['content']
})
export default class APagination extends Vue {
  mounted () {
    // fix auto size pagination, since it does not work in flex containers
    // https://github.com/vuetifyjs/vuetify/issues/13739
    const pagination = this.$refs.pagination
    const totalVisible = this.$attrs.totalVisible === undefined ? 7 : this.$attrs.totalVisible // allow 0 for totalVisible
    pagination.onResize = () => {
      pagination.maxButtons = totalVisible
    }
  }
}
</script>


<style scoped lang="scss">
::v-deep .v-pagination {
  gap: .3rem;
  .v-pagination__item,
  .v-pagination__more,
  .v-pagination__navigation {
    margin: 0;
    width: 28px;
    height: 28px;
  }
}
</style>
