<template>
  <a-dialog
    :id="dialogId"
    :anchor="anchor"
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
</template>


<script>
import { Component, Vue } from '@a-vue'
import { DialogEvent } from '@a-vue/events'
import { randomCssClass } from '@a-vue/utils/random'

@Component({
  props: ['anchor', 'title', 'message', 'info', 'itemTitle', {protect: false, dialog: true}]
})
export default class RemoveDialog extends Vue {
  dialogId = randomCssClass(10)
  removeKey = null
  removeConfirmed = null

  get isSmall () {
    return Object.keys(this.$attrs).filter(k => k.match(/x-small|default|large|x-large/)).length === 0
  }

  async remove () {
    if (!this.dialog) {
      this.$emit('remove')
      return
    }

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
    } else {
      this.$emit('cancel')
    }
  }
}
</script>


<style lang="scss" scoped>
.removeKey {
  user-select: none;
}
</style>
