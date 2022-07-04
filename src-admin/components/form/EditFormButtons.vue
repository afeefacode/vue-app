<template>
  <a-row
    gap="2"
    v-bind="$attrs"
  >
    <v-btn
      :small="small"
      :disabled="($has.reset && !changed) || !valid"
      color="green white--text"
      @click="$emit('save')"
    >
      Speichern
    </v-btn>

    <v-icon
      v-if="$has.reset && changed"
      :small="small"
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
    'small'
  ]
})
export default class EditFormButtons extends Vue {
  $hasOptions = ['reset']

  undoIcon = mdiRotateLeft
}
</script>
