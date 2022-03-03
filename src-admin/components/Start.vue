<template>
  <v-app>
    <router-view @appLoaded="appLoaded" />
    <a-alert />
  </v-app>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['splash']
})
export default class Index extends Vue {
  appLoaded () {
    this.splash.$destroy()
  }
}
</script>
