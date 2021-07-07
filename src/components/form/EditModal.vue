<template>
  <a-modal
    :anchor="anchor"
    title="Neue Fachleistung"
    :show.sync="show_"
    v-bind="$attrs"
  >
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :on="on"
        :attrs="attrs"
      />
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
        <a-row class="mt-8 mb-2 gap-4">
          <v-btn
            small
            :disabled="!changed || !valid"
            color="green white--text"
            @click="save"
          >
            Speichern
          </v-btn>

          <v-btn
            v-if="changed"
            small
            text
            @click="reset"
          >
            Zurücksetzen
          </v-btn>

          <v-btn
            small
            @click="close"
          >
            Schließen
          </v-btn>
        </a-row>
      </template>
    </edit-form>
  </a-modal>
</template>


<script>
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { EditFormViewMixin } from './EditFormViewMixin'

@Component({
  props: ['show', 'anchor']
})
export default class EditModal extends Mixins(EditFormViewMixin) {
  show_ = false

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

  _saved () {
    this.close()
  }
}
</script>
