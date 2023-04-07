<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-btn
        :class="'a-btn-standard removeButton-' + removeButtonId"
        fab
        :color="(hover ? 'red' : 'grey lighten-3')"
        :title="title"
        v-bind="{ small: isSmall, ...$attrs}"
        @click="remove"
      >
        <v-icon
          class="white--hover"
          :size="iconSize || '1.3rem'"
        >
          $trashCanIcon
        </v-icon>
      </v-btn>
    </v-hover>

    <remove-dialog
      ref="dialog"
      :anchor="'.removeButton-' + removeButtonId"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'
import { randomCssClass } from '@a-vue/utils/random'

@Component({
  props: ['iconSize']
})
export default class RemoveButton extends Vue {
  removeButtonId = randomCssClass(10)

  get isSmall () {
    return Object.keys(this.$attrs).filter(k => k.match(/x-small|default|large|x-large/)).length === 0
  }

  async remove () {
    this.$refs.dialog.remove()
  }

  get title () {
    return this.$attrs.title || 'Löschen'
  }
}
</script>
