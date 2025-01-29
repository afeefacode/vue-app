<template>
  <a-modal
    :beforeClose="beforeClose"
    :show.sync="show_"
    v-bind="$attrs"
    @destroyed="$emit('destroyed')"
  >
    <template #activator>
      <slot name="activator" />
    </template>

    <slot name="before-form" />

    <edit-form
      v-if="show_"
      ref="form"
      :model="model"
      :createModelToEdit="createModelToEdit"
    >
      <template #form="{modelToEdit, changed, valid}">
        <slot
          name="form"
          :modelToEdit="modelToEdit"
          :changed="changed"
          :valid="validFromOutside && valid"
        />

        <slot name="after-form-fields" />

        <a-row
          mt-8
          gap-2
          justify-end
        >
          <v-btn
            ref="deleteButton"
            v-if="deleteButton && modelToEdit.id"
            small
            color="error"
            @click="handleDelete"
          >
            Löschen
          </v-btn>

          <v-btn
            small
            @click="close"
          >
            Schließen
          </v-btn>

          <edit-form-buttons
            :changed="changed || forceChanged"
            :forceActive="forceActive"
            :valid="validFromOutside && valid"
            angular
            :has="{reset: reset && !!modelToEdit.id}"
            @save="$emit('save', modelToEdit, ignoreChangesOnClose, close)"
            @reset="resetForm"
          />
        </a-row>
      </template>
    </edit-form>

    <slot name="after-form" />
  </a-modal>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'
import { DialogEvent } from '@a-vue/events'

@Component({
  props: ['model', 'createModelToEdit', 'show', {deleteButton: false, reset: true, valid: true, forceChanged: false, forceActive: false}]
})
export default class EditModal extends Vue {
  show_ = false

  created () {
    if (!this.model && !this.createModelToEdit) {
      console.warn('You need to pass either a model or a model factory to <edit-modal>.')
    }

    if (this.show) { // open on create with v-show
      this.open()
    }
  }

  /**
   * visiblility changes from outside
   * this will trigger the show_ watcher,
   * forward the change to the modal and
   * later emit an open/close event
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

  get validFromOutside () {
    return this.valid
  }

  open () {
    this.show_ = true
  }

  async beforeClose () {
    // run only if show_ is true to prevent double checks with a-modal
    if (this.show_ && (this.$refs.form.changed || this.forceChanged)) {
      const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
        title: 'Änderungen verwerfen?',
        message: 'Im Formular sind nicht gespeicherte Änderungen. Sollen diese verworfen werden?',
        yesButton: 'Verwerfen'
      }))
      if (result !== DialogEvent.RESULT_YES) {
        return false
      }
    }
    return true
  }

  async close (force = false) {
    if (!force) {
      const result = await this.beforeClose()
      if (!result) {
        return
      }
    }
    this.show_ = false
  }

  async handleDelete () {
    const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
      anchor: this.$refs.form,
      title: 'Löschen bestätigen',
      message: 'Soll dieser Eintrag wirklich gelöscht werden?',
      yesButton: 'Löschen'
    }))
    if (result === DialogEvent.RESULT_YES) {
      this.$emit('delete', this.ignoreChangesOnClose, this.close)
      this.show_ = false
    }
  }

  /**
   * hook to allow to leave a just created (saved) model
   */
  ignoreChangesOnClose () {
    this.$refs.form.forceUnchanged()
  }

  resetChanged () {
    this.$refs.form.resetChanged()
  }

  resetForm () {
    this.$refs.form.reset()
    this.$emit('reset')
  }
}
</script>
