<template>
  <v-chip
    :class="['select2Chip', { exclude: polarity === 'exclude' }]"
    small
    :close="closable && !disabled"
    :color="chipColor"
    :text-color="chipTextColor"
    :title="title"
    @click:close="$emit('remove')"
  >
    <span class="label">
      <slot>{{ title }}</slot>
    </span>
  </v-chip>
</template>

<script>
import { Component, Vue } from '@a-vue'

// Chip auf Basis von v-chip — an mehreren Stellen genutzt:
// - im ASelect2-Feld (item = Model, Titel aus getTitle)
// - unter der Filterleiste (Inhalt per Default-Slot)
// - als Auswahl-Umschalt-Chip ("N ausgewählt", closable=false, color override)
// include = heller Grau-Chip, exclude = rot/durchgestrichen.
@Component({
  props: [
    'item',
    'getTitle',
    'color',
    'textColor',
    {
      polarity: 'include',
      disabled: false,
      closable: true
    }
  ]
})
export default class Select2Chip extends Vue {
  get title () {
    if (!this.item) {
      return null
    }
    return this.getTitle ? this.getTitle(this.item) : this.item.getTitle()
  }

  // Externe color/textColor haben Vorrang; sonst Polaritäts-Default
  // (include = heller Grau-Chip, exclude = rot).
  get chipColor () {
    if (this.color) {
      return this.color
    }
    return this.polarity === 'exclude' ? 'rgba(198, 40, 40, .12)' : '#EEEEEE'
  }

  get chipTextColor () {
    if (this.textColor) {
      return this.textColor
    }
    return this.polarity === 'exclude' ? '#C62828' : '#666666'
  }
}
</script>

<style scoped lang="scss">
.select2Chip {
  max-width: 100%;

  // Ellipsis greift nur, wenn das Label als Flex-Child schrumpfen darf (min-width: 0).
  .label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.exclude .label {
    text-decoration: line-through;
  }
}
</style>
