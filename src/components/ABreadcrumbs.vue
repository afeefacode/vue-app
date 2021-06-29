<template>
  <div class="d-flex flex-wrap align-center">
    <div
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="index"
      class="item mr-1 d-flex align-center"
    >
      <v-icon class="">
        $chevronRightIcon
      </v-icon>

      <router-link
        :to="breadcrumb.to"
        :exact="true"
      >
        {{ getItemTitle(breadcrumb.title) }}
      </router-link>
    </div>
  </div>
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SaveEvent } from './save-indicator/SaveEvent'
import { routeConfigPlugin } from '@a-vue/plugins/route-config/RouteConfigPlugin'

@Component
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
    let breadcrumbs = []

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
            if (title) { // item might be removed
              this.titleCache[cacheKey] = title
            }
          }
          item.title = this.titleCache[cacheKey]
        }
      }
      breadcrumbs.push(item)
    }


    // breadcrumbs = breadcrumbs.concat(breadcrumbs).concat(breadcrumbs)
    if (breadcrumbs.length > 5) {
      breadcrumbs = breadcrumbs.slice(0, 2).concat([
        {
          to: {},
          title: '...'
        }
      ]).concat(breadcrumbs.slice(-2))
    }

    this.breadcrumbs = breadcrumbs
  }

  getItemTitle (title) {
    // title = title.concat(title).concat(title)
    if (title.length > 20) {
      title = title.slice(0, 10).trim() + '...' + title.slice(-10).trim()
    }
    return title.toUpperCase()
  }
}
</script>


<style lang="scss" scoped>
.item {
  white-space: nowrap;

  .v-icon {
    margin-right: -2px;
  }

  a {
    text-decoration: none;

    &.active {
      color: rgba(0,0,0,.38);
    }
  }
}
</style>
