<template>
  <information-bar-item
    v-if="sidebar"
    v-bind="$attrs"
  >
    <template #actionButton>
      <slot name="actionButton" />
    </template>

    <slot />
  </information-bar-item>

  <detail-property
    v-else
    v-bind="$attrs"
  >
    <template #actionButton>
      <slot name="actionButton" />
    </template>

    <slot />
  </detail-property>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: [{sidebar: false}]
})
export default class DetailOrInfo extends Vue {
}
</script>
