<template>
  <div class="detailProperty">
    <div class="header">
      <v-avatar
        v-if="_icon"
        color="#EEEEEE"
        size="2.5rem"
      >
        <v-icon
          :color="_icon.color"
          size="1.5rem"
        >
          {{ _icon.icon }}
        </v-icon>
      </v-avatar>

      <label :class="['label', {'label--withIcon': !!_icon}]">{{ label }}</label>
    </div>

    <div :class="['content', {'content--withIcon': !!_icon}]">
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

    .v-avatar {
      flex: 0 0 40px;
      margin-right: 15px;
    }

    .label {
      display: block;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding-left: 55px;
      &--withIcon {
        padding-left: 0;
      }
    }
  }
  .content {
    padding-left: 55px;
    &--withIcon {
      padding-left: 55px;
    }
  }
}
</style>
