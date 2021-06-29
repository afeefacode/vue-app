<template>
  <div>
    <template v-if="filter.type === 'Afeefa.KeywordFilter'">
      <a-text-field
        v-model="filter.value"
        :label="label || name"
        :debounce="500"
        clearable
      />
    </template>

    <template v-if="filter.type === 'Afeefa.OrderFilter'">
      <a-select
        v-model="filter.value"
        :label="label || name"
        :items="orderItems"
        item-text="itemText"
        item-value="itemValue"
        :clearable="!filter.hasDefaultValue()"
        :value-comparator="compareOrderValues"
      />
    </template>

    <template v-if="filter.type === 'Afeefa.BooleanFilter' && filter.options.includes(false)">
      <a-select
        v-model="filter.value"
        :label="label || name"
        :items="booleanOptions"
        itemText="itemTitle"
        itemValue="itemValue"
        :clearable="filter.value !== null"
      />
    </template>

    <template v-else-if="filter.type === 'Afeefa.BooleanFilter'">
      <p>
        <input
          :id="'checkbox-' + name"
          v-model="filter.value"
          type="checkbox"
        > <label :for="'checkbox-' + name">{{ label || name }}</label>
      </p>
    </template>

    <template v-if="filter.type === 'Afeefa.IdFilter'">
      <a-select
        v-model="filter.value"
        :label="label || name"
        :items="getIdItems(filter)"
        itemText="itemTitle"
        itemValue="itemValue"
        :clearable="filter.value !== null"
        :value-comparator="compareOrderValues"
      />
    </template>
  </div>
</template>


<script>
import { Component, Mixins } from 'vue-property-decorator'
import ListFilterMixin from './ListFilterMixin'

@Component
export default class ListFilter extends Mixins(ListFilterMixin) {
  compareOrderValues (a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  get orderItems () {
    const items = []
    for (const [fieldName, directions] of Object.entries(this.filter.options)) {
      for (const direction of directions) {
        items.push({
          // itemText, itemValue instead of title, value:
          // https://github.com/vuetifyjs/vuetify/issues/13434
          itemText: fieldName + ' ' + direction,
          itemValue: {
            [fieldName]: direction
          }
        })
      }
    }
    return items
  }

  get booleanOptions () {
    return [
      {
        itemTitle: 'Alle',
        itemValue: null
      },
      ...this.filter.options.map(o => ({
        itemTitle: o ? 'Ja' : 'Nein',
        itemValue: o
      }))
    ]
  }

  async getIdItems (filter) {
    const result = await filter.request.send()
    const items = result.data

    return [
      {
        itemTitle: 'Alle',
        itemValue: null
      },
      ...items.map(i => {
        const count = filter.name === 'tag_id' ? i.count_users : i.count_articles
        return {
          itemTitle: `${i.name} (${count})`,
          itemValue: i.id
        }
      })
    ]
  }
}
</script>
