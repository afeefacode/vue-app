<template>
  <div>
    <v-row
      class="header ma-0"
      align="center"
    >
      <v-icon
        :color="icon.color"
        size="3rem"
        v-text="icon.icon"
      />

      <h2>{{ title }}</h2>
    </v-row>

    <v-row
      class="buttons mr-0"
      justify="end"
    >
      <router-link
        v-if="$has.add"
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
        <v-row
          align="center"
          class="item"
        >
          <v-icon
            :color="icon.color"
            size="2rem"
            v-text="icon.icon"
          />
          <slot
            name="model"
            :model="model"
          />
        </v-row>
      </template>
    </list-view>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['icon', 'title', 'newLink']
})
export default class ListRoute extends Vue {
  $hasOptions = ['add']
}
</script>


<style lang="scss" scoped>
.header {
  h2 {
    margin-left: 1rem;
  }
}

.item {
  gap: 1rem;
}

.button {
  display: block;
  margin-bottom: 2rem;
}

::v-deep .v-pagination {
  justify-content: left;
}
</style>
