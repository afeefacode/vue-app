<template>
  <a-modal
    :beforeClose="beforeClose"
    :show.sync="show_"
    v-bind="$attrs"
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
          :valid="valid"
        />

        <slot name="after-form-fields" />

        <a-row
          mt-8
          gap-2
          justify-end
        >
          <v-btn
            small
            @click="close"
          >
            Schließen
          </v-btn>

          <edit-form-buttons
            :changed="changed"
            :valid="valid"
            angular
            :has="{reset: !!modelToEdit.id}"
            @save="$emit('save', modelToEdit, ignoreChangesOnClose, close)"
            @reset="$refs.form.reset()"
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
  props: ['model', 'createModelToEdit', 'show']
})
export default class EditModal extends Vue {
  show_ = false
  ignoreChangesOnClose_ = false

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

  open () {
    this.show_ = true
  }

  async beforeClose () {
    // run only if show_ is true to prevent double checks with a-modal
    if (this.show_ && this.$refs.form.changed && !this.ignoreChangesOnClose_) {
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

  /**
   * hook to allow to leave a just created (saved) model
   */
  ignoreChangesOnClose () {
    // this.$refs.form.forceUnchanged()
    console.info('TODO switch form to forceUnchanged')
    this.ignoreChangesOnClose_ = true
  }
}
</script>
