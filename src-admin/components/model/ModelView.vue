<template>
  <component
    :is="Wrapper"
    @modelSaved="modelSaved"
  >
    <slot />
  </component>
</template>


<script>
import { Component, Watch, Mixins } from 'vue-property-decorator'
import ModelViewMixin from '@a-vue/components/model/ModelViewMixin'
import { LoadingEvent } from '@a-vue/events'

@Component
export default class ModelView extends Mixins(ModelViewMixin) {
  modelSaved () {
    this.load()
  }

  @Watch('isLoading')
  isLoadingChanged () {
    if (this.isLoading) {
      this.$events.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
    } else {
      this.$events.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
    }
  }

  get Wrapper () {
    return {
      template: '<div><slot /></div>'
    }
  }
}
</script>
