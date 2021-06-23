<template>
  <component
    :is="Component"
    v-if="isLoaded"
    :models="models"
    :meta="meta"
  />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { eventBus } from '@a-vue/plugins/event-bus/EventBus'
import { LoadingEvent } from '@a-vue/events'
import { RouteParamsFilterSource } from '@a-vue/components/list/RouteParamsFilterSource'
import { RequestFilters } from '@afeefa/api-resources-client'
import { sleep } from '../../../src/utils/timeout'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

@Component
export default class ListRoute2 extends Vue {
  models = []
  isLoaded = false

  async beforeRouteEnter (to, from, next) {
    const routeDefinition = to.meta.routeDefinition
    const Component = routeDefinition.config.list
    const listConfig = Component.getListConfig(routeDefinition)

    eventBus.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))

    let action = null
    if (listConfig.ModelClass) {
      action = listConfig.ModelClass.getAction(routeDefinition, 'list')
    } else if (listConfig.action) {
      action = listConfig.action
    } else {
      console.warn('Component\'s getListConfig method must provide a list action.')
    }

    const querySource = new RouteParamsFilterSource(to)
    const requestFilters = action.createRequestFilters(null, querySource)

    const storedFilters = RequestFilters.fromHistory(to.path)
    if (storedFilters) {
      requestFilters.initFromUsed(storedFilters.serialize(), 1)
    }

    // await sleep()

    const result = await action
      .request()
      .fields(listConfig.fields)
      .filters(requestFilters.serialize())
      .send()

    eventBus.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))

    next(vm => {
      vm.models = result.data
      vm.meta = result.meta
      vm.isLoaded = true
    })
  }

  get Component () {
    return this.$routeDefinition.config.list
  }
}
</script>
