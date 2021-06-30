<template>
  <div class="detailProperty d-flex align-start">
    <div class="icon">
      <v-icon
        v-if="icon"
        :color="icon.color"
        size="2rem"
      >
        {{ icon.icon }}
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

@Component({
  props: ['icon', 'label']
})
export default class DetailProperty extends Vue {
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
