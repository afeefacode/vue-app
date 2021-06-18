<template>
  <div class="breadcrumbs">
    <v-icon class="pr-1">
      $chevronRightIcon
    </v-icon>

    <v-breadcrumbs
      :items="breadcrumbs"
      class="pa-0"
      dense
    >
      <template #divider>
        <v-icon>$chevronRightIcon</v-icon>
      </template>

      <template #item="{ item }">
        <breadcrumbs-item
          :to="item.to"
          :exact-path="true"
          :disabled="item.disabled"
        >
          {{ item.title.toUpperCase() }}
        </breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SaveEvent } from './save-indicator/SaveEvent'
import { routeConfigPlugin } from '@a-vue/plugins/route-config/RouteConfigPlugin'
import BreadcrumbsItem from './breadcrumbs/BreadcrumbsItem'

@Component({
  components: {
    BreadcrumbsItem
  }
})
export default class ABreadcrumbs extends Vue {
  breadcrumbs = []
  titleCache = {}
  lastRoute = null

  created () {
    this.$events.on(SaveEvent.STOP_SAVING, this.afterSave)

    this.init()
  }

  @Watch('$route.name')
  routeNameChanged () {
    this.afterRouteChange()
  }

  @Watch('$route.params')
  routeParamsChanged () {
    this.afterRouteChange()
  }

  afterRouteChange () {
    const routeJson = JSON.stringify({
      name: this.$route.name,
      params: this.$route.params
    })

    if (this.lastRoute === routeJson) {
      return
    }

    this.lastRoute = routeJson

    this.init()
  }

  afterSave () {
    this.titleCache = {}
    this.init()
  }

  async init () {
    const breadcrumbs = []

    const breadcrumbDefinitions = await routeConfigPlugin.getBreadcrumbs(this.$route.name)

    for (const d of breadcrumbDefinitions) {
      const item = d.toBreadcrumb(this.$route.params)
      if (d.getTitle) {
        const idKey = d.routeDefinition.idKey
        if (this.$route.params[idKey]) {
          const cacheKey = `${d.name}.${this.$route.params[idKey]}`
          if (!this.titleCache[cacheKey]) {
            this.titleCache[cacheKey] = item.title // set title to default for multiple parallel requests
            const title = await d.getTitle(this.$route.params)
            this.titleCache[cacheKey] = title
          }
          item.title = this.titleCache[cacheKey]
        }
      }
      breadcrumbs.push(item)
    }

    this.breadcrumbs = breadcrumbs
  }
}
</script>


<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;

  ::v-deep .v-breadcrumbs__divider {
    padding: 0 4px 0 8px;
  }
}
</style>
