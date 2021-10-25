<template>
  <div class="detailProperty">
    <div class="header">
      <v-icon
        v-if="_icon"
        :color="_icon.color"
        size="2rem"
      >
        {{ _icon.icon }}
      </v-icon>
      <label :class="['label', {'label--withIcon': _icon != null}]">{{ label }}</label>
    </div>

    <div :class="['content', {'content--withIcon': _icon != null}]">
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
import { Component, Vue } from 'vue-property-decorator'
import { apiResources } from '@afeefa/api-resources-client'

@Component({
  props: ['icon', 'iconModelType', 'label']
})
export default class DetailProperty extends Vue {
  get _icon () {
    if (this.icon) {
      return this.icon
    }

    if (this.iconModelType) {
      const ModelClass = apiResources.getModelClass(this.iconModelType)
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
    .v-icon {
      flex: 0 0 40px;
      margin-right: 15px;
    }
    .label {
      display: block;
      text-transform: uppercase;
      letter-spacing: 2px;
      @media (max-width: 900px), (orientation : portrait) {
        padding-left: 55px;
        &--withIcon {
          padding-left: 0;
        }
      }
    }
  }
  .content {
    &--withIcon {
      padding-left: 55px;
    }
    @media (max-width: 900px), (orientation : portrait) {
      padding-left: 55px;
    }
  }

}
</style>
