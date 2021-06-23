<template>
  <div class="detailPage">
    <v-row
      class="header ma-0"
      align="center"
    >
      <v-icon
        :color="_icon.color"
        size="3rem"
        v-text="_icon.icon"
      />

      <h2>{{ model.getTitle() }}</h2>
    </v-row>

    <v-row
      v-if="$has.edit || $has.remove || $has.list"
      class="buttons mr-0"
      justify="end"
    >
      <v-btn
        v-if="$has.remove"
        color="red"
        text
        class="white--text"
        @click="removeModel"
      >
        Löschen
      </v-btn>

      <router-link
        v-if="$has.list"
        class="button"
        :to="_listLink"
      >
        <v-btn>Liste</v-btn>
      </router-link>

      <router-link
        v-if="$has.edit"
        class="button"
        :to="model.getLink('edit')"
      >
        <v-btn>Bearbeiten</v-btn>
      </router-link>
    </v-row>

    <slot
      name="model"
      :model="model"
    />
  </div>
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AlertEvent, DialogEvent, SaveEvent } from '@a-vue/events'
import { sleep } from '@a-vue/utils/timeout'

@Component({
  props: ['model', 'icon', 'deleteAction', 'listLink']
})
export default class DetailPage extends Vue {
  $hasOptions = ['edit', 'remove', 'list']

  created () {
    if (!this.$parent.constructor.getDetailConfig) {
      console.warn('<detail-page> owner must provide a static getDetailConfig method.')
    }
    this.$emit('model', this.model)
  }

  @Watch('model')
  modelChanged () {
    this.$emit('model', this.model)
  }

  get detailConfig () {
    return this.$parent.constructor.getDetailConfig(this.$routeDefinition)
  }

  get ModelClass () {
    return this.detailConfig.ModelClass
  }

  get _listLink () {
    if (this.listLink) {
      if (typeof this.listLink === 'function') {
        return this.listLink(this.$route.params)
      } else {
        return this.listLink
      }
    }
    return this.model.getLink('list')
  }

  get _icon () {
    if (this.icon) {
      return this.icon
    }
    return this.model.getIcon()
  }

  get _deleteAction () {
    if (this.deleteAction) {
      return this.deleteAction
    }
    return this.ModelClass.getAction(this.$routeDefinition, 'delete')
  }

  async removeModel () {
    const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
      title: this.model.getTitle() + ' löschen?',
      message: 'Soll ' + this.model.getTitle() + 'gelöscht werden?',
      yesButton: 'Ja, Löschen!'
    }))

    if (result === DialogEvent.RESULT_YES) {
      this.$events.dispatch(new SaveEvent(SaveEvent.START_SAVING))

      const result = await this._deleteAction.request()
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
.header {
  h2 {
    margin-left: 1rem;
  }
}

.buttons {
  gap: 1rem;
}

button, .button {
  display: block;
  margin-bottom: 2rem;
}
</style>
