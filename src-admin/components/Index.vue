<template>
  <div>
    <splash v-if="isLoading" />

    <router-view :isLoading.sync="isLoading" />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Index extends Vue {
  isLoading = true
}
</script>
