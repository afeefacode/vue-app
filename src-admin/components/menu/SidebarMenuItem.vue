<template>
  <v-list-item
    :to="item.to"
    :exactPath="item.exact"
  >
    <v-list-item-icon
      v-if="item.iconModel"
      class="ma-0 mr-4 align-self-center"
    >
      <model-icon
        :modelClass="item.iconModel"
        size="1.8rem"
      />
    </v-list-item-icon>

    <v-list-item-icon
      v-else-if="item.icon"
      class="ma-0 mr-4 align-self-center"
    >
      <v-icon :color="item.iconColor">
        {{ item.icon }}
      </v-icon>
    </v-list-item-icon>

    <div
      v-else
      class="mr-11"
    />

    <v-list-item-content>
      <div class="d-flex align-baseline">
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>

        <component
          :is="item.badge.component"
          v-if="item.badge"
          v-bind="item.badge.props"
          class="ml-1"
        />
      </div>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['item']
})
export default class SidebarMenuItem extends Vue {
}
</script>
