<template>
  <div>
    <slot name="before-form" />

    <edit-form
      ref="form"
      :model="model"
      :createModelToEdit="createModelToEdit"
      v-on="$listeners"
    >
      <template #form="{form, modelToEdit, model, getField, changed, valid}">
        <slot
          name="form"
          :form="form"
          :modelToEdit="modelToEdit"
          :model="model"
          :getField="getField"
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

    <slot name="after-form" />
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { DialogEvent } from '@a-vue/events'

@Component({
  props: ['model', 'createModelToEdit']
})
export default class EditPage extends Vue {
  unregisterRouterHook = null

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
    this.$refs.form.forceUnchanged()
  }
}
</script>
