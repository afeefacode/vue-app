<template>
  <div>
    <!-- ohne gespeicherten Startfilter: Klick speichert direkt -->
    <v-btn
      v-if="!hasStartFilter"
      class="startFilterButton"
      title="Aktuelle Filter als Startfilter speichern"
      small
      @click="saveStartFilter"
    >
      <v-icon
        color="#999999"
        size="1rem"
        class="mr-1"
      >
        {{ mdiPinOutline }}
      </v-icon>
      Filter
    </v-btn>

    <!-- mit gespeichertem Startfilter: Kontext-Menü -->
    <a-context-menu v-else>
      <template #activator>
        <v-btn
          class="startFilterButton"
          title="Startfilter gespeichert"
          small
        >
          <v-icon
            color="#999999"
            size="1rem"
            class="mr-1"
          >
            {{ mdiPin }}
          </v-icon>
          Filter
        </v-btn>
      </template>

      <a-context-menu-item @click="applyStartFilter">
        <v-icon>
          {{ mdiPin }}
        </v-icon>
        Liste auf Startfilter setzen
      </a-context-menu-item>

      <a-context-menu-item @click="saveStartFilter">
        <v-icon>
          {{ mdiContentSaveOutline }}
        </v-icon>
        Startfilter ersetzen
      </a-context-menu-item>

      <a-context-menu-item @click="removeStartFilter">
        <v-icon>
          {{ mdiTrashCanOutline }}
        </v-icon>
        Startfilter löschen
      </a-context-menu-item>
    </a-context-menu>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { StartFilterStorage } from '@a-vue/services/start-filter/StartFilterStorage'
import { mdiContentSaveOutline, mdiPin, mdiPinOutline, mdiTrashCanOutline } from '@mdi/js'

// Filter, die nicht zum Startfilter gehören:
// Seitenzahl und Suchfeld (zählen auch in der Filterleiste nicht als gesetzte Filter)
const EXCLUDED_FILTERS = ['page', 'q', 'qfield']

@Component({
  props: ['filters', 'storageKey']
})
export default class ListStartFilterButton extends Vue {
  mdiPin = mdiPin
  mdiPinOutline = mdiPinOutline
  mdiContentSaveOutline = mdiContentSaveOutline
  mdiTrashCanOutline = mdiTrashCanOutline

  hasStartFilter = false

  created () {
    this.hasStartFilter = StartFilterStorage.has(this.storageKey)
  }

  saveStartFilter () {
    StartFilterStorage.save(this.storageKey, this.getCurrentFilterQuery())
    this.hasStartFilter = true
  }

  /**
   * Wendet den gespeicherten Startfilter auf die lebende Ansicht an:
   * Query pushen, der $route.query-Watcher der Liste übernimmt den Rest
   * (Filter ohne Query-Wert fallen auf Default zurück, inkl. Suche/Seite).
   */
  applyStartFilter () {
    const query = StartFilterStorage.load(this.storageKey) || {}
    // Duplicate-Push vermeiden (JSON-Vergleich ist key-Reihenfolge-sensitiv,
    // daher zusätzlich catch gegen NavigationDuplicated)
    if (JSON.stringify(this.$router.currentRoute.query) !== JSON.stringify(query)) {
      this.$router.push({ query }).catch(() => {})
    }
  }

  removeStartFilter () {
    StartFilterStorage.clear(this.storageKey)
    this.hasStartFilter = false
  }

  getCurrentFilterQuery () {
    let query = {}
    for (const filter of Object.values(this.filters)) {
      if (EXCLUDED_FILTERS.includes(filter.name)) {
        continue
      }
      query = { ...query, ...filter.toQuerySource() }
    }
    return query
  }
}
</script>
