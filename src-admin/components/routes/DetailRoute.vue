<template>
  <div>
    <v-row
      v-if="hasEdit || hasRemove"
      class="buttons"
    >
      <router-link
        v-if="hasEdit"
        class="button"
        :to="model.getLink('edit')"
      >
        <v-btn>Bearbeiten</v-btn>
      </router-link>

      <v-btn
        v-if="hasRemove"
        color="red"
        class="white--text"
        @click="remove"
      >
        Löschen
      </v-btn>
    </v-row>

    <component
      :is="Component"
      :model="model"
    />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { AlertEvent, DialogEvent, SaveEvent } from '@a-vue/events'
import { sleep } from '@a-vue/utils/timeout'

@Component({
  props: ['model']
})
export default class DetailRoute extends Vue {
  get Component () {
    return this.$routeDefinition.config.routing.detail.Component
  }

  get deleteAction () {
    const config = this.$routeDefinition.config.routing.delete
    return config.action
  }

  get hasEdit () {
    const config = this.$routeDefinition.config.routing.detail
    return config.edit !== false
  }

  get hasRemove () {
    const config = this.$routeDefinition.config.routing.detail
    return config.remove !== false
  }

  async remove () {
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

.button {
  display: block;
  margin-bottom: 2rem;
}
</style>
