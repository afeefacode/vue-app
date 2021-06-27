<template>
  <component
    :is="Component"
    v-if="model"
    :model="model"
  />
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { GetAction } from '@a-vue/api-resources/ApiActions'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

function load (route) {
  const routeDefinition = route.meta.routeDefinition
  const Component = routeDefinition.config.edit
  const editConfig = Component.getEditConfig(route)

  let action = null
  if (editConfig.ModelClass) {
    action = editConfig.ModelClass.getAction(routeDefinition, 'get')
  } else {
    action = editConfig.getAction
  }

  return new GetAction()
    .setAction(action)
    .setFields(editConfig.fields)
    .setId(route.params[routeDefinition.idKey])
    .load()
}

@Component
export default class EditRoute extends Vue {
  model = null

  async beforeRouteEnter (to, from, next) {
    const model = await load(to)
    next(vm => {
      vm.model = model
    })
  }

  @Watch('$route.params')
  async routeParamsChanged () {
    this.model = await load(this.$route)
  }

  get Component () {
    return this.$routeDefinition.config.edit
  }
}
</script>
