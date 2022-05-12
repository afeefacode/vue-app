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

    return this.$t('Admin.Types', this.Model.type, null, 'TITLE_PLURAL', 'de')
  }

  get _newTitle () {
    if (this.newTitle) {
      return this.newTitle
    }

    return this.$t('Admin.Types', this.Model.type, null, 'TITLE_SINGULAR', 'de')
  }

  get _newLink () {
    return this.newLink || this.Model.getLink('new')
  }
}
</script>
