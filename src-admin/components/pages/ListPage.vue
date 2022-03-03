<template>
  <div class="listPage">
    <app-bar-title
      :icon="_icon"
      :title="_title"
    />

    <app-bar-button v-if="$has.add">
      <a-icon-button
        v-if="$has.add"
        :to="_newLink"
        icon="$plusIcon"
        :text="_newTitle"
        color="green white--text"
      />
    </app-bar-button>

    <slot />
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { apiResources } from '@afeefa/api-resources-client'

@Component({
  props: ['icon', 'title', 'newTitle', 'newLink', 'Model']
})
export default class ListPage extends Vue {
  $hasOptions = ['add']

  get _icon () {
    return this.icon || this.Model.icon
  }

  get _title () {
    if (this.title) {
      return this.title
    }

    const type = apiResources.getType(this.Model.type)
    return type.t('TITLE_PLURAL')
  }

  get _newTitle () {
    if (this.newTitle) {
      return this.newTitle
    }

    const type = apiResources.getType(this.Model.type)
    return type.t('TITLE_SINGULAR')
  }

  get _newLink () {
    return this.newLink || this.Model.getLink('new')
  }
}
</script>
