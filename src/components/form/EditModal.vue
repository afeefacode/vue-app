<template>
  <a-modal
    :title="title"
    :show.sync="show_"
    v-bind="$attrs"
  >
    <template #activator>
      <slot name="activator" />
    </template>

    <edit-form
      v-if="show_"
      :model="model"
    >
      <template #fields>
        <slot
          name="fields"
          :model="model"
        />
      </template>

      <template #default="{changed, valid}">
        <a-row
          class="mt-8 mb-1 pb-1 gap-4"
          right
        >
          <v-btn
            small
            @click="close"
          >
            Schließen
          </v-btn>

          <a-row gap="2">
            <v-btn
              small
              :disabled="!changed || !valid"
              color="green white--text"
              @click="save"
            >
              Speichern
            </v-btn>

            <v-icon
              v-if="changed"
              small
              text
              @click="reset"
            >
              {{ undoIcon }}
            </v-icon>
          </a-row>
        </a-row>
      </template>
    </edit-form>
  </a-modal>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'
import { mdiRotateLeft} from '@mdi/js'

@Component({
  props: ['model', 'title', 'show']
})
export default class EditModal extends Vue {
  show_ = false

  undoIcon = mdiRotateLeft

  /**
   * visiblility changes from outside
   * this will trigger the show_ watcher,
   * forward the change to the modal and
   * later emit a open/close event
   */
  @Watch('show')
  showChanged () {
    if (this.show) {
      this.open()
    } else {
      this.close()
    }
  }

  /**
   * visiblility changes by modal close
   */
  @Watch('show_')
  show_Changed () {
    if (this.show_) {
      this.reset()
      this.$emit('open')
    } else {
      this.$emit('close')
    }
  }

  open () {
    this.show_ = true
  }

  close () {
    this.show_ = false
  }

  reset () {
    this.$emit('reset')
  }

  save () {
    this.$emit('save')
  }
}
</script>
