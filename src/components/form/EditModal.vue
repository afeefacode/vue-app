<template>
  <a-modal
    :anchor="anchor"
    title="Neue Fachleistung"
    :show.sync="show"
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
      v-if="show"
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
  props: ['anchor']
})
export default class EditModal extends Mixins(EditFormViewMixin) {
  show = false

  mounted () {
    if (this.$attrs.show) {
      this.open()
    }
  }

  @Watch('$attrs.show')
  attrsShowChanged () {
    if (this.$attrs.show) {
      this.open()
    } else {
      this.close()
    }
  }

  @Watch('show')
  showChanged () {
    if (this.show) {
      this.$emit('open')
    } else {
      this.$emit('close')
    }
  }

  open () {
    this.show = true
  }

  close () {
    this.show = false
  }

  _saved () {
    this.show = false
  }
}
</script>
