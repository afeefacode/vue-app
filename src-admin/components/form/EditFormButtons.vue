<template>
  <a-row
    gap="1"
    v-bind="$attrs"
  >
    <v-tooltip bottom>
      <template #activator="{ on }">
        <div v-on="disabled ? on : null">
          <v-btn
            :fab="!angular"
            small
            :disabled="disabled"
            color="green white--text"
            :title="saveTitle"
            @click="$emit('save')"
          >
            <v-icon
              :left="angular"
              :class="{['mr-1']: angular}"
            >
              $checkIcon
            </v-icon>

            <template v-if="angular">
              {{ saveTitle }}
            </template>
          </v-btn>
        </div>
      </template>

      <span v-if="disabled">
        <template v-if="!valid">
          Daten berichtigen,<br>um zu {{ saveTitle.toLowerCase() }}
        </template>
        <template v-else>
          Daten ändern,<br>um zu {{ saveTitle.toLowerCase() }}
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
    {
      angular: false,
      small: false,
      forceActive: false,
      saveTitle: 'Speichern'
    }
  ]
})
export default class EditFormButtons extends Vue {
  $hasOptions = ['reset']

  undoIcon = mdiRotateLeft

  get disabled () {
    if (!this.valid) {
      return true
    }

    if (this.forceActive) {
      return false
    }

    if (this.$has.reset) {
      return !this.changed
    }

    return false
  }
}
</script>
