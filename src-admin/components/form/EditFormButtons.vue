<template>
  <a-row
    gap="1"
    v-bind="$attrs"
  >
    <v-btn
      fab
      small
      :disabled="($has.reset && !changed) || !valid"
      color="green white--text"
      title="Speichern"
      @click="$emit('save')"
    >
      <v-icon>
        $checkIcon
      </v-icon>
    </v-btn>

    <v-hover
      v-if="$has.reset && changed"
      v-slot="{ hover }"
    >
      <v-icon
        :small="small"
        :class="{disabled: !changed}"
        :color="hover ? '#666666' : '#999999'"
        text
        title="Formular zurücksetzen"
        @click="$emit('reset')"
      >
        {{ undoIcon }}
      </v-icon>
    </v-hover>
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
