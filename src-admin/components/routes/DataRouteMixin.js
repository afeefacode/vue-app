import { Component, Vue } from '@a-vue'

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
  drm_isLoaded = false

  async beforeRouteEnter (to, from, next) {
    routerHookCalled = true
    const result = await load(to)

    next(vm => {
      if (result !== false) {
        vm.drm_onLoad(result)
        vm.drm_isLoaded = true
      }
      routerHookCalled = false
    })
  }

  /**
   * triggered both, if route name or route params change
   @Watch('$route.params')
   async routeParamsChanged () {
     if (routerHookCalled) {
       return
     }

     if (!this.drm_isLoaded) {
       const result = await load(this.$route)

       if (result !== false) {
         this.drm_onLoad(result)
         this.drm_isLoaded = true
       }
     }
   }
   */

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
