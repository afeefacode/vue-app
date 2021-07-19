<template>
  <v-container
    d-flex
    flex-column
  >
    <v-list class="pa-0">
      <template v-for="item in config.items">
        <v-list-group
          v-if="item.group"
          :key="item.title"
          :value="false"
        >
          <template #activator>
            <sidebar-menu-item :item="item" />
          </template>

          <sidebar-menu-item
            v-for="subItem in item.items"
            :key="subItem.to.name"
            :item="subItem"
          />
        </v-list-group>

        <sidebar-menu-item
          v-else
          :key="item.to.name"
          :item="item"
        />
      </template>
    </v-list>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import SidebarMenuItem from './menu/SidebarMenuItem'

@Component({
  props: ['config'],
  components: {
    SidebarMenuItem
  }
})
export default class SidebarMenu extends Vue {
}
</script>


<style lang="scss" scoped>
::v-deep .v-list-group {
  > .v-list-item {
    padding: 0;
    > .v-list-item {
        padding: 0;
        padding-left: 19px;
        flex: 0;
        color: #999999 !important;

      .v-list-item__icon {
        margin-right: 18px !important;
      }
    }

    .v-list-item__icon {
      margin-left: .3rem;
      justify-content: flex-start;
    }
  }
}
</style>
