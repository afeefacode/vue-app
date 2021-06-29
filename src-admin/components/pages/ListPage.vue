<template>
  <div class="listPage">
    <app-bar-title
      :icon="_icon"
      :title="_title"
    />

    <app-bar-button v-if="$has.add">
      <v-btn
        v-if="$has.add"
        :to="_newLink"
        small
        color="green white--text"
      >
        <v-icon
          left
          class="mr-0"
        >
          $plusIcon
        </v-icon>
        Neu
      </v-btn>
    </app-bar-button>

    <list-view
      v-bind="$attrs"
      :models="models"
      :meta="meta"
      :action="action"
      :fields="fields"
      :table="table"
      v-on="$listeners"
    >
      <template #filters="{filters, count}">
        <div class="pl-2">
          <slot
            name="filters"
            :filters="filters"
            :count="count"
          />
        </div>
      </template>

      <template
        v-if="table"
        #header-table
      >
        <div />

        <slot name="header" />
      </template>

      <template
        v-if="table"
        #model-table="{ model }"
      >
        <v-icon
          :color="model.getIcon().color"
          size="1.5rem"
          v-text="model.getIcon().icon"
        />

        <slot
          name="model"
          :model="model"
        />

        <div class="lastColumn" />
      </template>

      <template
        v-if="!table"
        #model="{ model }"
      >
        <v-row
          align="center"
          class="gap-4"
        >
          <v-icon
            :color="model.getIcon().color"
            size="2rem"
            v-text="model.getIcon().icon"
          />

          <slot
            name="model"
            :model="model"
          />
        </v-row>
      </template>
    </list-view>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['models', 'meta', 'title', 'newLink', 'table']
})
export default class ListPage extends Vue {
  $hasOptions = ['add']

  created () {
    if (!this.$parent.constructor.getListConfig) {
      console.warn('<list-view> owner must provide a static getListConfig method.')
    }
  }

  get listConfig () {
    return this.$parent.constructor.getListConfig(this.$route)
  }

  get ModelClass () {
    return this.listConfig.ModelClass
  }

  get action () {
    if (this.listConfig.action) {
      return this.listConfig.action
    }
    return this.ModelClass.getAction(this.$routeDefinition, 'list')
  }

  get fields () {
    return this.listConfig.fields
  }

  get _title () {
    if (this.title) {
      return this.title
    }
    return this.ModelClass.title
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


<style lang="scss" scoped>
.lastColumn {
  width: 100%;
}
</style>
