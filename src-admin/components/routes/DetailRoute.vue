<template>
  <model-view
    v-bind="$attrs"
    :model.sync="model"
    v-on="$listeners"
  >
    <template v-if="model">
      <v-row
        v-if="hasEdit || hasRemove || hasList"
        class="buttons mr-0"
        justify="end"
      >
        <v-btn
          v-if="hasRemove"
          color="red"
          text
          class="white--text"
          @click="removeModel"
        >
          Löschen
        </v-btn>

        <router-link
          v-if="hasList"
          class="button"
          :to="getListLink()"
        >
          <v-btn>Liste</v-btn>
        </router-link>

        <router-link
          v-if="hasEdit"
          class="button"
          :to="model.getLink('edit')"
        >
          <v-btn>Bearbeiten</v-btn>
        </router-link>
      </v-row>

      <slot />
    </template>
  </model-view>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { AlertEvent, DialogEvent, SaveEvent } from '@a-vue/events'
import { sleep } from '@a-vue/utils/timeout'

@Component({
  props: ['edit', 'remove', 'deleteAction', 'list', 'listLink']
})
export default class DetailRoute extends Vue {
  model = null

  get hasEdit () {
    return this.edit !== false
  }

  get hasRemove () {
    return this.remove !== false
  }

  get hasList () {
    return this.list !== false
  }

  getListLink () {
    if (this.listLink) {
      return this.listLink(this.$route.params)
    }
    return this.model.getLink('list')
  }

  async removeModel () {
    const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
      title: this.model.getTitle() + ' löschen?',
      message: 'Soll ' + this.model.getTitle() + 'gelöscht werden?',
      yesButton: 'Ja, Löschen!'
    }))

    if (result === DialogEvent.RESULT_YES) {
      this.$events.dispatch(new SaveEvent(SaveEvent.START_SAVING))

      const result = await this.deleteAction.request()
        .params({
          id: this.model.id
        })
        .send()

      await sleep()

      this.$events.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))

      if (result) {
        this.$events.dispatch(new AlertEvent(AlertEvent.MESSAGE, {
          message: 'Die Daten wurden gelöscht.'
        }))
        this.$router.push(this.model.getLink('list'))
      } else {
        this.$events.dispatch(new AlertEvent(AlertEvent.ERROR, {
          message: 'Die Daten wurden nicht gelöscht.'
        }))
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.buttons {
  gap: 1rem;
}

button, .button {
  display: block;
  margin-bottom: 2rem;
}
</style>
