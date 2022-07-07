<template>
  <div>
    <v-btn
      :class="'removeButton-' + dialogId"
      fab
      small
      color="red white--text"
      title="Löschen"
      @click="remove"
    >
      <v-icon>
        $trashCanIcon
      </v-icon>
    </v-btn>

    <a-dialog
      :id="dialogId"
      :anchor="[document, '.removeButton-' + dialogId]"
      :active="protect ? removeKey === removeConfirmed : true"
    >
      <template v-if="protect">
        <div>Bitte folgenden Key eingeben: <strong class="removeKey">{{ removeKey }}</strong></div>

        <a-text-field
          v-model="removeConfirmed"
          label="Key"
          :focus="true"
          width="100"
        />
      </template>
    </a-dialog>
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'
import { DialogEvent } from '@a-vue/events'
import { randomCssClass } from '@a-vue/utils/random'

@Component({
  props: ['itemTitle', 'protect']
})
export default class EditPage extends Vue {
  dialogId = randomCssClass(10)
  document = document
  removeKey = null
  removeConfirmed = null

  async remove () {
    if (this.protect) {
      this.removeKey = [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    }

    const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
      id: this.dialogId,
      title: this.itemTitle + ' löschen?',
      message: 'Soll ' + this.itemTitle + ' gelöscht werden?',
      yesButton: 'Löschen',
      yesColor: 'red white--text'
    }))

    if (result === DialogEvent.RESULT_YES) {
      this.$emit('remove')
    }
  }
}
</script>


<style lang="scss" scoped>
.removeKey {
  user-select: none;
}
</style>
