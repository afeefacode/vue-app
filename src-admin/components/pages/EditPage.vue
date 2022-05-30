<template>
  <edit-form
    ref="form"
    :model="model"
    :createModelToEdit="createModelToEdit"
  >
    <template #default="{model, changed, valid}">
      <slot
        :model="model"
        :changed="changed"
        :valid="valid"
      />

      <edit-form-buttons
        :changed="changed"
        :valid="valid"
        @save="$emit('save', model)"
        @reset="$refs.form.reset()"
      />
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

  created () {
    this.unregisterRouterHook = this.$router.beforeEach(async (to, from, next) => {
      if (this.$refs.form.changed) {
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
}
</script>
