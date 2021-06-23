<template>
  <component
    :is="Component"
    v-if="model"
    :model="model"
  />
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { GetAction } from './LoadActions'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

function load (routeDefinition, params) {
  const Component = routeDefinition.config.edit
  const editConfig = Component.getEditConfig(routeDefinition)

  let action = null
  if (editConfig.ModelClass) {
    action = editConfig.ModelClass.getAction(routeDefinition, 'get')
  } else {
    action = editConfig.getAction
  }

  return new GetAction()
    .setAction(action)
    .setFields(editConfig.fields)
    .setId(params[routeDefinition.idKey])
    .load()
}

@Component
export default class EditRoute extends Vue {
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
    this.reset()
  }

  get Component () {
    return this.$routeDefinition.config.edit
  }
}
</script>
