<template>
  <div class="detailPage">
    <app-bar-title
      :icon="_icon"
      :title="model.getTitle()"
    />

    <app-bar-button v-if="$has.remove && false">
      <v-btn
        small
        color="red"
        class="white--text"
        @click="remove"
      >
        Löschen
      </v-btn>
    </app-bar-button>

    <app-bar-button v-if="$has.edit">
      <v-btn
        :to="model.getLink('edit')"
        small
        color="green white--text"
      >
        <v-icon left>
          $pencilIcon
        </v-icon>
        Bearbeiten
      </v-btn>
    </app-bar-button>

    <slot
      name="model"
      :model="model"
    />
  </div>
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { DeleteAction } from '@a-vue/api-resources/ApiActions'

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
    return this.$parent.constructor.getDetailConfig(this.$route)
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

  async remove () {
    const result = await new DeleteAction()
      .setAction(this._deleteAction)
      .setId(this.model.id)
      .setDialog({
        title: this.model.getTitle() + ' löschen?',
        message: 'Soll ' + this.model.getTitle() + 'gelöscht werden?',
        yesButton: 'Ja, Löschen!'
      })
      .delete()

    if (result) {
      this.$router.push(this.model.getLink('list'))
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
</style>
