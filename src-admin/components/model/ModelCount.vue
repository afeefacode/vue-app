<template>
  <a-badge
    color="#EEEEEE"
    class="black--text"
    inline
    v-bind="$attrs"
    :content="content"
  />
</template>


<script>
import { Component, Vue } from '@a-vue'
import { modelCountService } from './ModelCountService'
import { SaveEvent } from '@a-vue/events'

@Component({
  props: ['action', 'field']
})
export default class ModelCount extends Vue {
  countRequest = null
  content = null

  created () {
    this.$events.on(SaveEvent.STOP_SAVING, this.loadCount)

    this.countRequest = modelCountService.addAction(this.action)
    this.loadCount()
  }

  loadCount () {
    this.content = this.countRequest.get(this.field)
  }
}
</script>
