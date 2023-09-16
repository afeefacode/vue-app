<template>
  <div class="detailProperty">
    <div class="header">
      <v-avatar
        v-if="_icon"
        color="#F4F4F4"
        size="2.5rem"
      >
        <v-icon
          :color="_icon.color"
          size="1.5rem"
        >
          {{ _icon.icon }}
        </v-icon>
      </v-avatar>

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
  props: ['icon', 'iconModelType', 'label']
})
export default class DetailProperty extends Vue {
  get _icon () {
    if (this.icon) {
      return this.icon
    }

    if (this.iconModelType) {
      const ModelClass = this.$apiResources.getModelClass(this.iconModelType)
      return ModelClass.icon
    }
  }
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
    margin-bottom: .5rem;

    .v-avatar {
      flex: 0 0 40px;
      margin-right: 15px;
    }

    .iconPlaceholder {
      width: 55px;
    }

    .label {
      display: block;
      text-transform: uppercase;
      letter-spacing: 3px;
      border-bottom: 5px solid #CCCCCC;
      color: #666666;
    }
  }

  .content {
    padding-left: 55px;
  }
}
</style>
