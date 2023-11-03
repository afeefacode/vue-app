<template>
  <div class="detailProperty">
    <div class="header">
      <v-icon
        v-if="icon"
        :color="icon.color"
        size="2.75rem"
      >
        {{ icon.icon }}
      </v-icon>

      <div
        v-else
        class="iconPlaceholder"
      />

      <label class="label">{{ label }}</label>

      <div class="pl-2">
        <slot name="actionButton" />
      </div>
    </div>

    <div class="content">
      <a-row
        vertical
        gap="6"
      >
        <slot />
      </a-row>
    </div>
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['icon', 'label']
})
export default class DetailProperty extends Vue {
}
</script>


<style lang="scss" scoped>
.detailProperty {
  width: 100%;

  .header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 40px;

    > .v-icon {
      flex: 0 0 2.5rem;
      margin-right: 1rem;
    }

    .iconPlaceholder {
      width: 3.5rem;
    }

    .label {
      display: block;
      text-transform: uppercase;
      letter-spacing: 3px;
      border-bottom: 5px solid #DDDDDD;
      color: #666666;
    }
  }

  .content {
    margin-top: .75rem;
    padding-left: 3.75rem;
  }
}
</style>
