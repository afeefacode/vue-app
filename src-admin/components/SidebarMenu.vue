<template>
  <v-container
    d-flex
    flex-column
  >
    <v-list class="pa-0">
      <v-list-item
        v-for="item in config.items"
        :key="item.title"
        :to="item.to"
      >
        <v-list-item-icon class="ma-0 mr-4 align-self-center">
          <model-icon
            :modelClass="item.iconModel"
            size="1.8rem"
          />
        </v-list-item-icon>

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
    </v-list>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['config']
})
export default class SidebarMenu extends Vue {
}
</script>
