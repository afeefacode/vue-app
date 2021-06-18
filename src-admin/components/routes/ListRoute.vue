<template>
  <div>
    <v-row
      class="buttons mr-0"
      justify="end"
    >
      <router-link
        v-if="add !== false"
        class="button"
        :to="newLink"
      >
        <v-btn>Neu</v-btn>
      </router-link>
    </v-row>

    <list-view
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template #filters>
        <slot name="filters" />
      </template>

      <template #model="{ model }">
        <slot
          name="model"
          :model="model"
        />
      </template>
    </list-view>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['add', 'newLink']
})
export default class ListRoute extends Vue {
}
</script>


<style lang="scss" scoped>
.button {
  display: block;
  margin-bottom: 2rem;
}

::v-deep .v-pagination {
  justify-content: left;
}
</style>
