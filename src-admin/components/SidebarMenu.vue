<template>
  <v-container class="pl-8 d-flex flex-column">
    <div
      v-for="item in config.items"
      :key="item.title"
      class="item"
    >
      <model-icon
        :modelClass="item.iconModel"
        class="mr-1"
        size="1.5rem"
      />

      <router-link
        :to="item.to"
        :exactPath="false"
      >
        {{ item.title }}
      </router-link>

      <component
        :is="item.badge.component"
        v-if="item.badge"
        v-bind="item.badge.props"
      />
    </div>
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

<style scoped lang="scss">
.item {
  display: flex;
  align-items: center;
  gap: .3rem;
  margin-bottom: 1rem;

  a.active {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.38);
  }
}
</style>
