<template>
  <div class="a-breadcrumbs d-flex align-start gap-2 mr-4">
    <div :class="['breadcrumbs d-flex align-center', {'flex-wrap': wrapBreadcrumbs_}]">
      <div
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
        class="item mr-2 d-flex align-center"
      >
        <v-icon v-if="index > 0">
          $chevronRightIcon
        </v-icon>

        <router-link
          :to="breadcrumb.to"
          :exact="true"
        >
          {{ breadcrumb.title }}
        </router-link>
      </div>
    </div>

    <v-avatar
      v-if="expandVisible"
      class="expand"
      color="#EEE"
      size="1.3rem"
      @click="wrapBreadcrumbs"
    >
      <a-icon>$caret{{ wrapBreadcrumbs_ ? 'Up' : 'Down' }}Icon</a-icon>
    </v-avatar>

    <div
      v-else
      class="expandDummy"
    />
  </div>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'
import { SaveEvent } from './save-indicator/SaveEvent'
import { routeConfigPlugin } from '@a-vue/plugins/route-config/RouteConfigPlugin'

@Component
export default class ABreadcrumbs extends Vue {
  breadcrumbs = []
  titleCache = {}
  lastRoute = null
  expandVisible = false
  wrapBreadcrumbs_ = false

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
    this.wrapBreadcrumbs_ = false

    this.scrollBreadcrumbs()
  }

  scrollBreadcrumbs () {
    this.$nextTick(() => {
      const objDiv = this.$el.querySelector('.breadcrumbs')
      if (objDiv.scrollWidth > objDiv.offsetWidth) {
        objDiv.scrollLeft = objDiv.scrollWidth
        this.expandVisible = true
      } else {
        objDiv.scrollLeft = 0
        this.expandVisible = false
      }
    })
  }

  wrapBreadcrumbs () {
    this.wrapBreadcrumbs_ = !this.wrapBreadcrumbs_
    if (this.wrapBreadcrumbs_) {
      const objDiv = this.$el.querySelector('.breadcrumbs')
      objDiv.scrollLeft = 0
    } else {
      this.scrollBreadcrumbs()
    }
  }
}
</script>


<style lang="scss" scoped>
.a-breadcrumbs {
  overflow: hidden;
}

.breadcrumbs {
  overflow: hidden;
}

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

.expand {
  cursor: pointer;
  margin-top: 1px;
}

.expandDummy {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
