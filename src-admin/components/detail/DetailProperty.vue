<template>
  <div class="detailProperty d-flex align-start">
    <div class="icon">
      <v-icon
        v-if="_icon"
        :color="_icon.color"
        size="2rem"
      >
        {{ _icon.icon }}
      </v-icon>
    </div>

    <div>
      <label>{{ label }}</label>

      <a-row
        class="content"
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
      const model = apiResources.getModel(this.iconModelType)
      return model.icon
    }
  }
}
</script>


<style lang="scss" scoped>
.detailProperty {
  width: 100%;
  .icon {
    flex-basis: 50px;
  }

  label {
    display: block;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: .5rem;
  }
}
</style>
