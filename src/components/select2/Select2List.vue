<template>
  <div class="select2List">
    <div
      ref="scroll"
      class="scroll"
      tabindex="0"
      @keydown.down.prevent="moveActive(1)"
      @keydown.up.prevent="moveActive(-1)"
      @keydown.enter.ctrl.prevent="$emit('apply')"
      @keydown.enter.exact.prevent="activateEnter"
      @keydown.space.exact.prevent="activateEnter"
      @keydown.enter.shift.prevent="activateExclude"
      @keydown.tab.shift.prevent="$emit('backtab')"
    >
      <!-- Rendering wie SearchSelectList: a-table / a-table-row. border bringt
           den Zeilen-Einzug (links/rechts) + Trennlinien wie bei Version 1. -->
      <a-table
        v-if="items.length"
        fixed
        border
      >
        <a-table-row
          v-for="(model, index) in items"
          :key="model.type + '-' + model.id"
          small
          border
          :selected="isSelected(model)"
          :disabled="rowDisabled(model)"
          :class="['row', 'row-' + index, {
            included: polarityOf(model) === 'include',
            excluded: polarityOf(model) === 'exclude',
            active: activeIndex === index
          }]"
          @click="onRowClick(model)"
        >
          <div class="d-flex align-center gap-2">
            <slot
              name="row"
              :item="model"
              :selected="isSelected(model)"
              :polarity="polarityOf(model)"
            >
              <!-- Checkbox vorn (nur Mehrfachauswahl): zeigt den gewählt-Zustand.
                   Reine Anzeige — der Klick auf die ganze Zeile toggelt. -->
              <v-simple-checkbox
                v-if="showCheckbox"
                class="rowCheckbox"
                :value="isSelected(model)"
                :disabled="rowDisabled(model)"
                dense
                hide-details
                @input="onRowClick(model)"
              />

              <a-icon
                v-if="getIcon"
                :icon="getIcon(model)"
              />

              <div
                class="flex-grow-1"
                style="min-width: 0;"
              >
                <!-- Nativer Tooltip immer mit vollem Titel — lange Titel werden
                     per Ellipsis gekappt (und beim Hover vom nicht-Button überdeckt). -->
                <div
                  class="rowTitle"
                  :title="title(model)"
                >
                  {{ title(model) }}
                </div>
                <div
                  v-if="subtitle(model)"
                  class="grey--text"
                  style="font-size: .8125rem;"
                >
                  {{ subtitle(model) }}
                </div>
              </div>

              <!-- "Nicht"-Button (Polarität): toggelt include ⇄ exclude.
                   Aktiv (exclude) = rot/gefüllt und bleibt sichtbar; sonst grau
                   und nur bei Zeilen-Hover (excludeBtn). -->
              <v-btn
                v-if="allowExclude"
                :class="['excludeBtn', { active: polarityOf(model) === 'exclude' }]"
                x-small
                depressed
                :tabindex="-1"
                :color="polarityOf(model) === 'exclude' ? 'error' : 'grey lighten-3'"
                :title="polarityOf(model) === 'exclude' ? 'Einschließen' : 'Ausschließen'"
                @click.stop="onExcludeClick(model)"
              >
                Nicht
              </v-btn>
            </slot>
          </div>
        </a-table-row>
      </a-table>

      <!-- Endlos-Scroll-Sentinel: wird sichtbar → @load-more (siehe ASelect2) -->
      <div
        v-if="hasMore"
        ref="sentinel"
        class="sentinel"
      />

      <!-- "Nichts gefunden" erst zeigen, wenn nicht (mehr) geladen wird — der
           Lade-Spinner sitzt oben am Popup-Rand (ASelect2 .topLoader). -->
      <div
        v-if="!items.length && !isLoading"
        class="notFound"
      >
        <slot name="not-found">
          Nichts gefunden.
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue, Watch } from '@a-vue'

// Trefferliste mit Endlos-Scroll (Etappe 2). Rendering wie SearchSelectList
// (a-table / a-table-row small), erweitert um Polarität (ein-/ausschließen) und
// einen IntersectionObserver-Sentinel fürs Endlos-Nachladen.
//
// Endlos-Scroll über IntersectionObserver auf einem unsichtbaren Sentinel am
// Listenende: wird er sichtbar (und es gibt mehr Seiten), feuert @load-more.
// Kein Scroll-Event/Offset-Rechnen.
//
// Diese Komponente ist rein präsentational: sie kennt keine Auswahl-Logik,
// sondern meldet Klicks per @toggle an ASelect2. Die Events hier sind interne
// API (ASelect2 ↔ Select2List), nicht die öffentliche Schnittstelle.
@Component({
  props: [
    'items',
    'selection',
    'getTitle',
    'getSubtitle',
    'getIcon',
    'isItemDisabled',
    {
      allowExclude: false,
      // Checkbox vorn pro Zeile: macht den Auswahl-Zustand bei Mehrfachauswahl
      // klar sichtbar (besonders bei nur 1 Eintrag). Nur Anzeige des „gewählt"-
      // Zustands — die Polarität (include/exclude) zeigt weiter der Nicht-Button.
      showCheckbox: false,
      isLoading: false,
      hasMore: false
    }
  ]
})
export default class Select2List extends Vue {
  observer = null
  activeIndex = -1

  mounted () {
    this.setupObserver()
  }

  // Vom Elternteil (ASelect2) beim Öffnen ohne Suchfeld aufgerufen: Fokus auf
  // die Liste + erstes Element aktiv (§14).
  focusFirst () {
    this.$el.querySelector('.scroll').focus()
    this.activeIndex = this.items.length ? 0 : -1
  }

  moveActive (delta) {
    if (!this.items.length) {
      return
    }
    this.$el.querySelector('.scroll').focus()
    const n = this.items.length
    this.activeIndex = ((this.activeIndex + delta) % n + n) % n
    const row = this.$el.querySelector('.row-' + this.activeIndex)
    if (row) {
      row.scrollIntoView({ block: 'nearest' })
    }
  }

  activeModel () {
    return this.activeIndex >= 0 ? this.items[this.activeIndex] : null
  }

  // Enter = einschließen/toggeln (§14), Shift+Enter = ausschließen.
  activateEnter () {
    const model = this.activeModel()
    if (model && !this.rowDisabled(model)) {
      this.$emit('toggle', model)
    }
  }

  activateExclude () {
    if (!this.allowExclude) {
      return
    }
    const model = this.activeModel()
    if (model && !this.rowDisabled(model)) {
      this.$emit('exclude', model)
    }
  }

  beforeDestroy () {
    this.teardownObserver()
  }

  @Watch('hasMore')
  hasMoreChanged () {
    // Sentinel taucht erst auf/verschwindet, wenn sich hasMore ändert.
    this.$nextTick(() => this.setupObserver())
  }

  setupObserver () {
    this.teardownObserver()

    const sentinel = this.$refs.sentinel
    if (!sentinel) {
      return
    }

    this.observer = new IntersectionObserver(entries => {
      const entry = entries[0]
      if (entry.isIntersecting && this.hasMore && !this.isLoading) {
        this.$emit('loadMore')
      }
    }, {
      root: this.$refs.scroll,
      rootMargin: '100px'
    })

    this.observer.observe(sentinel)
  }

  teardownObserver () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }

  isSelected (model) {
    return this.selection.some(e => e.model.equals(model))
  }

  polarityOf (model) {
    const entry = this.selection.find(e => e.model.equals(model))
    return entry ? entry.polarity : null
  }

  rowDisabled (model) {
    return this.isItemDisabled ? this.isItemDisabled(model) : false
  }

  title (model) {
    return this.getTitle ? this.getTitle(model) : model.getTitle()
  }

  subtitle (model) {
    if (this.getSubtitle) {
      return this.getSubtitle(model)
    }
    return model.getSubtitle ? model.getSubtitle() : null
  }

  onRowClick (model) {
    if (this.rowDisabled(model)) {
      return
    }
    this.$emit('toggle', model)
  }

  onExcludeClick (model) {
    if (this.rowDisabled(model)) {
      return
    }
    this.$emit('exclude', model)
  }
}
</script>

<style scoped lang="scss">
// a-table-row bringt Hover/Selected/Active/disabled + Cursor selbst mit.
// Eigene Styles nur fürs Nötigste: Scroll, Zell-Overrides, Polaritätsfarben,
// Zeilen-Flexbox und der nicht-Button.

.select2List {
  display: flex;
  flex-direction: column;
  min-height: 0;

  .scroll {
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    outline: none;
  }

  // a-table-Defaults aufheben: max-width 300px (für echte Tabellen) und das
  // rechte Zell-Padding (sonst großer Spalt zur Scrollbar). Die Zelle selbst
  // ist die Zeilen-Flexbox (Icon | Text | nicht-Button); volle Breite + min-width
  // 0, damit lange Titel abschneiden statt die Liste zu verbreitern.

  :deep(.a-table-row > *) {
    display: flex;
    align-items: center;
    gap: .5rem;
    width: 100%;
    max-width: none;
    min-width: 0;
    padding-right: 0;
    cursor: pointer;

    // Anker für den absolut gelegten nicht-Button.
    position: relative;
  }

  :deep(.a-table-row.included) {
    color: #2E7D32;
  }

  :deep(.a-table-row.excluded) {
    color: #C62828;
  }

  // Durchstreichen nur den Titel (nicht den nicht-Button).

  :deep(.a-table-row.excluded) .rowTitle {
    text-decoration: line-through;
  }

  // Langer Titel schneidet ab (…) statt die Liste zu verbreitern.

  .rowTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // Nicht-Button nur bei Zeilen-Hover sichtbar (auch der aktive). Der
  // Ausschluss-Zustand bleibt an der roten/durchgestrichenen Zeile erkennbar.
  // Absolut über dem Textende statt als eigene Flex-Spalte: reserviert keine
  // Breite (auch unsichtbar belegte er sonst Platz und kappte den Titel),
  // sondern überdeckt den Titel nur während des Hovers.

  .excludeBtn {
    visibility: hidden;
    position: absolute;
    right: .5rem;
    top: 50%;
    transform: translateY(-50%);

    // Liegt über dem Text — zwei Ränder heben ihn ab: innen eine dezente Linie
    // (gegen den Zeilen-Hover-Hintergrund), außen ein 5px-Ring in der
    // Hover-Hintergrundfarbe (#F4F4F4, ATableRow), der Luft zum überdeckten
    // Text schafft (Button wirkt „freigestellt"). Ring als outline, NICHT als
    // box-shadow — das globale `.v-btn { box-shadow: none !important }` würde
    // einen Shadow-Ring schlucken. Die Border braucht !important, weil Vuetifys
    // Farbklasse (.grey.lighten-3 bzw. .error) border-color per !important
    // plattzieht.
    border: 1px solid rgba(0, 0, 0, .1) !important;
    outline: 5px solid #F4F4F4;

    &.active {
      border-color: transparent !important;
    }

    // Vuetifys x-small-Button bringt min-width 36px + breites Padding mit —
    // über dem Text soll er so schmal wie möglich sein.

    &.v-btn {
      min-width: 0;
      padding: 0 .25rem;
    }
  }

  // Tastatur-aktive Zeile hat einen anderen Hintergrund (#EEEEFF, ATableRow) —
  // der Freisteller-Ring zieht mit.

  :deep(.a-table-row.active) .excludeBtn {
    outline-color: #EEEEFF;
  }

  :deep(.a-table-row:hover) .excludeBtn {
    visibility: visible;
  }

  // Checkbox vorn (Mehrfachauswahl): kompakt, kein Eigen-Margin (die Zeile bringt
  // den gap mit). flex-shrink 0, damit sie bei langen Titeln nicht gequetscht wird.

  .rowCheckbox {
    flex: 0 0 auto;
    margin: 0;

    // Vuetify setzt margin-right: 8px aufs Selection-Control — die Zeile bringt
    // den gap schon mit, daher hier weg.

    :deep(.v-input--selection-controls__input) {
      margin-right: 0;
    }
  }

  // Endlos-Scroll-Ziel: braucht Höhe, damit der IntersectionObserver feuert.

  .sentinel {
    height: 1px;
  }

  .notFound {
    padding: .5rem 1rem;
    color: rgba(0, 0, 0, .6);
  }
}
</style>
