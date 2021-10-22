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
import { Component, Vue } from 'vue-property-decorator'
import { apiResources } from '@afeefa/api-resources-client'

@Component({
  props: ['title', 'newTitle', 'newLink', 'ModelClass']
})
export default class ListPage extends Vue {
  $hasOptions = ['add']

  get _title () {
    if (this.title) {
      return this.title
    }

    const type = apiResources.getType(this.ModelClass.type)
    return type.t('TITLE_PLURAL')
  }

  get _newTitle () {
    if (this.newTitle) {
      return this.newTitle
    }

    const type = apiResources.getType(this.ModelClass.type)
    return type.t('TITLE_SINGULAR')
  }

  get _icon () {
    if (this.icon) {
      return this.icon
    }
    return this.ModelClass.icon
  }

  get _newLink () {
    if (this.newLink) {
      if (typeof this.newLink === 'function') {
        return this.newLink(this.$route.params)
      } else {
        return this.newLink
      }
    }
    return this.ModelClass.getLink('new')
  }
}
</script>
