<template>
  <div class="detailPage ml-4 mt-12">
    <app-bar-title
      :icon="_icon"
      :title="model.getTitle()"
    />

    <app-bar-button v-if="$has.remove">
      <v-btn
        small
        color="red white--text"
        class="removeButton"
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

    <a-dialog
      id="removeDialog"
      :anchor="[document, '.removeButton']"
      :active="protectRemove ? removeKey === removeConfirmed : true"
    >
      <template
        v-if="protectRemove"
        #default="{isOpen}"
      >
        <div>Bitte folgenden Key eingeben: <strong class="removeKey">{{ removeKey }}</strong></div>

        <a-text-field
          v-model="removeConfirmed"
          label="Key"
          :focus="isOpen"
          width="100"
        />
      </template>
    </a-dialog>
  </div>
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RemoveAction } from '@a-vue/api-resources/ApiActions'

@Component({
  props: ['model', 'icon', 'removeAction', 'protectRemove', 'listLink']
})
export default class DetailPage extends Vue {
  $hasOptions = ['edit', 'remove', 'list']

  removeKey = null
  removeConfirmed = null

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

  get document () {
    return document
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
    if (this.removeAction) {
      return this.removeAction
    }
    return this.ModelClass.getAction(this.$routeDefinition, 'delete')
  }

  async remove () {
    this.removeKey = [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

    const result = await new RemoveAction()
      .setAction(this._deleteAction)
      .setId(this.model.id)
      .setDialog({
        id: 'removeDialog',
        title: this.model.getTitle() + ' löschen?',
        message: 'Soll ' + this.model.getTitle() + 'gelöscht werden?',
        yesButton: 'Löschen!',
        yesColor: 'red white--text'
      })
      .delete()

    if (result) {
      this.$router.push(this.model.getLink('list'))
    }
  }
}
</script>


<style lang="scss" scoped>
.removeKey {
  user-select: none;
}
</style>
