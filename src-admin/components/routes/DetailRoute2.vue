<template>
  <component
    :is="Component"
    v-if="model"
    :model="model"
  />
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { DetailAction } from './LoadActions'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

function load (routeDefinition, params) {
  const Component = routeDefinition.config.detail
  const detailConfig = Component.getDetailConfig(routeDefinition)

  let action = null
  if (detailConfig.ModelClass) {
    action = detailConfig.ModelClass.getAction(routeDefinition, 'get')
  } else {
    action = detailConfig.action
  }

  return new DetailAction()
    .setAction(action)
    .setFields(detailConfig.fields)
    .setId(params[routeDefinition.idKey])
    .load()
}

@Component
export default class DetailRoute2 extends Vue {
  model = null

  async beforeRouteEnter (to, from, next) {
    const model = await load(to.meta.routeDefinition, to.params)
    next(vm => {
      vm.model = model
    })
  }

  @Watch('$route.params')
  async routeParamsChanged () {
    this.model = await load(this.$routeDefinition, this.$route.params)
  }

  get Component () {
    return this.$routeDefinition.config.detail
  }
}
</script>
