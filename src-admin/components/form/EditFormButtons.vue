<template>
  <a-row
    gap="2"
    v-bind="$attrs"
  >
    <a-icon-button
      :small="small"
      :disabled="($has.reset && !changed) || !valid"
      color="green white--text"
      icon="$checkIcon"
      text="Speichern"
      @click="$emit('save')"
    />

    <v-icon
      v-if="$has.reset"
      :small="small"
      :class="{disabled: !changed}"
      :disabled="!changed"
      text
      title="Formular zurücksetzen"
      @click="$emit('reset')"
    >
      {{ undoIcon }}
    </v-icon>
  </a-row>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { mdiRotateLeft} from '@mdi/js'

@Component({
  props: [
    'changed',
    'valid',
    {small: false}
  ]
})
export default class EditFormButtons extends Vue {
  $hasOptions = ['reset']

  undoIcon = mdiRotateLeft
}
</script>


<style lang="scss" scoped>
.v-icon--disabled {
  opacity: .3;
}
</style>
