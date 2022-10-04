<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-btn
        :class="'a-btn-standard removeButton-' + dialogId"
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

    <a-dialog
      :id="dialogId"
      :anchor="'.removeButton-' + dialogId"
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
  props: ['iconSize', 'title', 'message', 'info', 'itemTitle', 'protect']
})
export default class EditPage extends Vue {
  dialogId = randomCssClass(10)
  removeKey = null
  removeConfirmed = null

  get isSmall () {
    return Object.keys(this.$attrs).filter(k => k.match(/x-small|default|large|x-large/)).length === 0
  }

  async remove () {
    if (this.protect) {
      this.removeKey = [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    }

    const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
      id: this.dialogId,
      title: this.itemTitle + ' löschen?',
      message: ['Soll ' + this.itemTitle + ' gelöscht werden?', this.message].filter(m => m).join('<br><br>'),
      info: this.info,
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
