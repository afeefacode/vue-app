<template>
  <model-view
    :id="id"
    :action="action"
    :fields="fields"
    :model.sync="model"
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
          @click="remove"
        >
          Löschen
        </v-btn>

        <router-link
          v-if="hasList"
          class="button"
          :to="listLink"
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

      <component
        :is="Component"
        :model="model"
      />
    </template>
  </model-view>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { AlertEvent, DialogEvent, SaveEvent } from '@a-vue/events'
import { sleep } from '@a-vue/utils/timeout'

@Component
export default class DetailRoute extends Vue {
  model = null

  get config () {
    return this.$routeDefinition.config.routing.detail
  }

  get idKey () {
    return this.$routeDefinition.idKey
  }

  get id () {
    return this.$route.params[this.idKey]
  }

  get fields () {
    return this.config.fields
  }

  get action () {
    return this.config.action
  }

  get Component () {
    return this.config.Component
  }

  get deleteAction () {
    const config = this.$routeDefinition.config.routing.delete
    return config.action
  }

  get hasEdit () {
    return this.config.edit !== false
  }

  get hasRemove () {
    return this.config.remove !== false
  }

  get hasList () {
    return this.config.list !== false
  }

  get listLink () {
    if (this.config.listLink) {
      return this.config.listLink(this.$route.params)
    }
    return this.model.getLink('list')
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

button, .button {
  display: block;
  margin-bottom: 2rem;
}
</style>
