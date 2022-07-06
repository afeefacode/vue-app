<template>
  <edit-form
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

      <app-bar-button>
        <edit-form-buttons
          :changed="changed"
          :valid="valid"
          :has="{reset: !!modelToEdit.id}"
          @save="$emit('save', modelToEdit, ignoreChangesOnRouteChange)"
          @reset="$refs.form.reset()"
        />
      </app-bar-button>
    </template>
  </edit-form>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { DialogEvent } from '@a-vue/events'

@Component({
  props: ['model', 'createModelToEdit']
})
export default class EditPage extends Vue {
  unregisterRouterHook = null
  ignoreChangesOnRouteChange_ = false

  created () {
    this.unregisterRouterHook = this.$router.beforeEach(async (to, from, next) => {
      if (this.$refs.form.changed && !this.ignoreChangesOnRouteChange_) {
        const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
          title: 'Änderungen verwerfen?',
          message: 'Im Formular sind nicht gespeicherte Änderungen. Sollen diese verworfen werden?',
          yesButton: 'Verwerfen'
        }))
        if (result === DialogEvent.RESULT_YES) {
          next()
        }
        return
      }
      next()
    })
  }

  destroyed () {
    this.unregisterRouterHook()
  }

  /**
   * hook to allow to leave a just created (saved) model
   */
  ignoreChangesOnRouteChange () {
    // this.$refs.form.forceUnchanged()
    console.info('TODO switch form to forceUnchanged')
    this.ignoreChangesOnRouteChange_ = true
  }
}
</script>
