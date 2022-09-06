<template>
  <a-row
    gap="1"
    v-bind="$attrs"
  >
    <v-tooltip bottom>
      <template #activator="{ on }">
        <div v-on="disabled ? on : null">
          <v-btn
            fab
            small
            :disabled="disabled"
            color="green white--text"
            title="Speichern"
            @click="$emit('save')"
          >
            <v-icon>
              $checkIcon
            </v-icon>
          </v-btn>
        </div>
      </template>
      <span v-if="disabled">
        <template v-if="!valid">
          Daten berichtigen,<br>um zu speichern
        </template>
        <template v-else>
          Daten ändern,<br>um zu speichern
        </template>
      </span>
    </v-tooltip>

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

  get disabled () {
    return (this.$has.reset && !this.changed) || !this.valid
  }
}
</script>
