import { Component, Vue, Watch } from '@a-vue'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

let onLoadCallback = () => {}
let routerHookCalled = false
let lastResult = null // cache last result because of hmr reload

function onLoad (callback) {
  onLoadCallback = callback
}

function load (route) {
  const Component = [...route.matched].pop().components.default

  if (!Component.drm_getActions) {
    console.warn('A data route component must implement a static drm_getActions() method.')
  }

  const request = Component.drm_getActions(route, onLoad)
  if (Array.isArray(request)) {
    return Promise.all(request.map(request => {
      return request
        .dispatchGlobalLoadingEvents()
        .execute()
    }))
  } else {
    return request
      .dispatchGlobalLoadingEvents()
      .execute()
  }
}

@Component
export class DataRouteMixin extends Vue {
  async beforeRouteEnter (to, from, next) {
    routerHookCalled = true
    const result = await load(to)
    next(vm => {
      if (result !== false) {
        vm.drm_onLoad(result)
      }
      routerHookCalled = false
    })
  }


  // watches (if defined) route idKey and reloads data if changed
  @Watch('drm_id')
  async drm_routeParamsChanged () {
    if (routerHookCalled) {
      return
    }

    const result = await load(this.$route)

    if (result !== false) {
      this.drm_onLoad(result)
    }
  }

  // return route config idKey
  get drm_id () {
    return this.$route.params[this.$routeDefinition.idKey]
  }

  drm_onLoad (result) {
    onLoadCallback(this, result)
    lastResult = result
  }

  created () {
    // hmr reload creates vm but not triggers route enter
    if (!routerHookCalled) {
      onLoadCallback(this, lastResult)
    }
  }
}
