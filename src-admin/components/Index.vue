<template>
  <router-view @appLoaded="appLoaded" />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['splash']
})
export default class Index extends Vue {
  appLoaded () {
    this.splash.$destroy()
  }
}
</script>
