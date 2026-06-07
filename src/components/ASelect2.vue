<template>
  <div
    :class="['a-select2', widthClass, { isOpen }]"
    :style="cwm_widthStyle"
    @click="toggleOpen"
    @keydown.enter.prevent="open"
    @keydown.space.prevent="open"
  >
    <!-- Feld = v-select (outlined, dense, multiple): VSelect bestimmt "dirty"
         über die Auswahl-Länge, daher floatet das Label nativ korrekt (im Feld
         wenn leer, in der Rahmenlinie wenn gewählt). Die Chips kommen aus dem
         #selection-Slot. Das eigene Menü ist unterdrückt (menuProps value:false),
         der Klick auf das Feld öffnet stattdessen unser eigenes Popup. -->
    <v-select
      ref="field"
      class="field"
      :value="committedModels"
      :items="committedModels"
      multiple
      readonly
      dense
      outlined
      hide-details
      returnObject
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable && !!committed.length"
      :appendIcon="'$dropdown'"
      :menuProps="{ value: false }"
      :tabindex="disabled ? -1 : 0"
      @click:clear="clear"
    >
      <template #selection="{ item }">
        <select2-chip
          :item="item"
          :polarity="committedPolarityOf(item)"
          :getTitle="getTitle"
          :disabled="disabled"
          @remove="removeModel(item)"
        />
      </template>
    </v-select>

    <!-- z-index bewusst unter Vuetify-Dialogen (~200+), damit die
         Verwerfen-Rückfrage über dem Popup liegt (siehe close()). -->
    <v-overlay
      :value="isOpen"
      :z-index="190"
      :opacity="0"
    />

    <!-- Ein-Popup: ein Panel mit (optionalem) Tabs + Suchfeld + Trefferliste -->
    <div :class="panelCssClass">
      <div
        v-if="isOpen"
        class="popup elevation-6"
        :style="cwm_popupWidthStyle"
      >
        <!-- Suchfeld immer sichtbar; rechts ein Auswahl-Chip ("N ausgewählt")
             zum Umschalten auf die Auswahl-Ansicht (blau = aktiv) und (×) löscht
             alle. Klick ins Suchfeld → zurück zur Trefferliste. -->
        <div
          v-if="isDynamic"
          class="search"
        >
          <a-text-field
            ref="search"
            :value="search"
            :label="searchPlaceholder || 'Suche'"
            clearable
            hide-details
            @input="search = $event"
            @focus="activeTab = 'search'"
            @keydown.native.down.prevent="focusList"
            @keydown.native.esc.prevent="onSearchEsc"
            @keydown.native.enter.ctrl.prevent="applyIfMultiple"
          />
          <select2-chip
            v-if="multiple && activeSelection.length"
            class="countChip"
            :closable="false"
            :color="activeTab === 'selection' ? 'primary' : undefined"
            :text-color="activeTab === 'selection' ? 'white' : undefined"
            @click.native="toggleSelectionView"
          >
            {{ activeSelection.length }}
          </select2-chip>
        </div>

        <!-- Trefferliste (Default) -->
        <select2-list
          v-if="activeTab === 'search'"
          ref="list"
          :items="displayItems"
          :selection="activeSelection"
          :getTitle="getTitle"
          :getSubtitle="getSubtitle"
          :getIcon="getIcon"
          :isItemDisabled="isItemDisabled"
          :allowExclude="allowExclude"
          :isLoading="isLoading"
          :hasMore="hasMore"
          @toggle="onRowClick"
          @exclude="onExcludeClick"
          @loadMore="loadMore"
          @backtab="focusSearch"
          @apply="applyIfMultiple"
        >
          <template #row="{ item, selected }">
            <slot
              name="row"
              :item="item"
              :selected="selected"
              :polarity="polarityOf(item)"
            />
          </template>

          <template #not-found>
            <slot name="not-found" />
          </template>
        </select2-list>

        <!-- Auswahl-Tab: nur die aktuell gewählten Items -->
        <select2-list
          v-else
          :items="selectedItems"
          :selection="activeSelection"
          :getTitle="getTitle"
          :getSubtitle="getSubtitle"
          :getIcon="getIcon"
          :allowExclude="allowExclude"
          @toggle="onRowClick"
          @exclude="onExcludeClick"
        >
          <template #row="{ item, selected }">
            <slot
              name="row"
              :item="item"
              :selected="selected"
              :polarity="polarityOf(item)"
            />
          </template>
        </select2-list>

        <!-- Footer (nur Mehrfachauswahl): Übernehmen / Verwerfen -->
        <div
          v-if="multiple"
          class="footer"
        >
          <v-btn
            text
            small
            @click="discardAndClose"
          >
            Verwerfen
          </v-btn>
          <v-btn
            text
            small
            color="primary"
            @click="apply"
          >
            Übernehmen
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Watch, Mixins } from '@a-vue'
import { UsesPositionServiceMixin } from '../services/position/UsesPositionServiceMixin'
import { PositionConfig } from '../services/PositionService'
import { CancelOnEscMixin } from '@a-vue/services/escape/CancelOnEscMixin'
import { DialogEvent } from '@a-vue/events'
import { ListAction } from '@a-vue/api-resources/ApiActions'
import { select2Cache, buildCacheKey } from '../services/select-cache/Select2Cache'
import { randomCssClass } from '../utils/random'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'
import Select2Chip from './select2/Select2Chip'
import Select2List from './select2/Select2List'

// ASelect2 — Multi-Filter-Komponente (Variante F/G aus #276).
//
// Feste oder dynamische Datenquelle, Einzel-/Mehrfachauswahl, Ein-/Ausschluss
// (Polarität), Übernehmen/Verwerfen, Endlos-Scroll, Tastatursteuerung.
//
// Datenquelle bestimmt den Modus (kein expliziter Prop): `options`/`items`
// (Array) → feste Liste, kein Suchfeld; `optionsRequest` (Function) →
// dynamische Suche + Endlos-Scroll.
//
// Interne Repräsentation der Auswahl ist immer ein Array<{model, polarity}>
// ("Selection"), auch im Einfach-Modus (Länge 0 oder 1). `polarity` ist ohne
// Ausschluss konstant 'include'. Die Modus-Abhängigkeit steckt nur im Emit
// (siehe toOuter()) — so muss der innere Code keine Sonderfälle kennen.
@Component({
  props: [
    'options',
    'optionsRequest',
    'items',
    'max',
    'sortFn',
    'getTitle',
    'getSubtitle',
    'getIcon',
    'label',
    'placeholder',
    'searchPlaceholder',
    'value',
    {
      multiple: false,
      allowExclude: false,
      disabled: false,
      clearable: false,
      cacheResults: false,
      pageSize: 30
    }
  ],
  components: {
    Select2Chip,
    Select2List
  }
})
export default class ASelect2 extends Mixins(ComponentWidthMixin, UsesPositionServiceMixin, CancelOnEscMixin) {
  selectId = randomCssClass(10)
  isOpen = false

  // Außen bestätigte Auswahl (Spiegel von `value`). Im Feld werden immer die
  // committed-Chips gezeigt — der Draft lebt nur im offenen Popup.
  committed = []
  // Arbeitskopie im Popup (Mehrfachauswahl). Klicks ändern den Draft; erst
  // "Übernehmen" schreibt draft → committed (Last-Write-Wins, kein Merge).
  // Im Einfach-Modus ungenutzt: dort committet ein Klick sofort und schließt.
  draft = []

  // Mehrfachauswahl-Tabs (Etappe 3)
  activeTab = 'search'

  // Dynamische Suche (Etappe 2)
  search = ''
  searchResults = []
  page = 1
  hasMore = false
  count = null
  isLoading = false
  loadToken = 0
  searchDebounce = null

  openDirection = 'down'

  mounted () {
    this.syncCommittedFromValue()
  }

  destroyed () {
    this.close()
  }

  @Watch('value')
  syncCommittedFromValue () {
    this.committed = this.fromOuter(this.value)
  }

  @Watch('search')
  searchChanged () {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce)
    }
    this.searchDebounce = setTimeout(() => {
      this.loadResults({ reset: true })
    }, 250)
  }

  // Wird im Auswahl-Tab der letzte Eintrag entfernt, verschwinden die Tabs
  // (showTabs braucht ≥1). Dann zurück auf den Suche-Tab, sonst hinge man im
  // leeren Auswahl-Tab ("Nichts gefunden") ohne Tableiste fest.
  @Watch('showTabs')
  showTabsChanged () {
    if (!this.showTabs) {
      this.activeTab = 'search'
    }
  }

  // --- Datenquelle ---------------------------------------------------------

  get isDynamic () {
    return typeof this.optionsRequest === 'function'
  }

  // `items`/`options` sind Props (feste Liste). Bewusst NICHT `items` als
  // Getter benennen — das würde den gleichnamigen Prop verdecken.
  get staticItems () {
    return this.items || this.options || []
  }

  // Was die Liste anzeigt: feste Liste oder dynamische Treffer.
  get displayItems () {
    return this.isDynamic ? this.searchResults : this.staticItems
  }

  // --- Laden (nur dynamisch) -----------------------------------------------

  async loadResults ({ reset = false } = {}) {
    if (!this.isDynamic) {
      return
    }

    if (reset) {
      this.page = 1
      this.searchResults = []
    }

    this.isLoading = true
    const token = ++this.loadToken

    const result = await this.fetchPage(this.page)

    // Veraltete Antwort (neue Suche/Seite zwischenzeitlich gestartet) verwerfen.
    if (token !== this.loadToken) {
      return
    }

    if (!result || !result.models) {
      this.isLoading = false
      return
    }

    const { models, meta } = result
    this.searchResults = reset ? models : [...this.searchResults, ...models]
    this.count = meta.count_search != null ? meta.count_search : this.searchResults.length
    this.hasMore = this.searchResults.length < this.count

    this.isLoading = false
  }

  loadMore () {
    if (this.isLoading || !this.hasMore) {
      return
    }
    this.page++
    this.loadResults()
  }

  // Lädt eine Seite — bei cacheResults und stabiler Liste (keine Suche, 1. Seite)
  // über den globalen Cache, sonst direkt. So teilen sich mehrere Selects auf
  // dieselbe stabile Liste einen Request (Etappe 6).
  fetchPage (page) {
    if (this.cacheResults && !this.search && page === 1) {
      return select2Cache.loadCached(this.cacheKey(page), () => this.requestPage(page))
    }
    return this.requestPage(page)
  }

  requestPage (page) {
    return this.buildListAction(page).hideError().load()
  }

  cacheKey (page) {
    const request = this.optionsRequest().getApiRequest()
    const action = request.getAction()
    return buildCacheKey(
      action.getResource().getType(),
      action.getName(),
      { ...request.getParams(), page_size: this.pageSize, page }
    )
  }

  // Baut die ListAction der Datenquelle und setzt Suche + Seite als Filter.
  // `optionsRequest()` liefert einen ApiRequest (wie field.createOptionsRequest()).
  // addFilters merged auf die bestehenden Request-Filter, ersetzt sie nicht.
  buildListAction (page) {
    const request = this.optionsRequest()
      .addFilters({ q: this.search, page, page_size: this.pageSize })
    return ListAction.fromRequest(request)
  }

  // --- Auswahl-Helfer ------------------------------------------------------

  // Die im Popup aktive Auswahl: Mehrfach → Draft (Arbeitskopie), Einfach →
  // committed (Klick committet sofort, kein Draft nötig). Liste + Chips lesen
  // hierüber, damit beide Modi denselben Code teilen.
  get activeSelection () {
    return this.multiple ? this.draft : this.committed
  }

  get sortedSelection () {
    if (this.sortFn) {
      return [...this.committed].sort((a, b) => this.sortFn(a.model, b.model))
    }
    return this.committed
  }

  // Models der committed-Auswahl (für das v-select-Feld: value + items + Chips).
  get committedModels () {
    return this.sortedSelection.map(e => e.model)
  }

  // Polarität aus der committed-Auswahl (Feld-Chips zeigen den bestätigten Stand,
  // nicht den Popup-Draft — anders als polarityOf, das den aktiven Draft liest).
  committedPolarityOf (model) {
    const entry = this.committed.find(e => e.model.equals(model))
    return entry ? entry.polarity : null
  }

  removeModel (model) {
    const entry = this.committed.find(e => e.model.equals(model))
    if (entry) {
      this.removeEntry(entry)
    }
  }

  polarityOf (model) {
    const entry = this.activeSelection.find(e => e.model.equals(model))
    return entry ? entry.polarity : null
  }

  get maxReached () {
    return this.max != null && this.activeSelection.length >= this.max
  }

  isItemDisabled (model) {
    if (this.disabled) {
      return true
    }
    // Bei erreichtem Max bleiben nur schon gewählte Items klickbar (zum Abwählen).
    return this.maxReached && !this.activeSelection.some(e => e.model.equals(model))
  }

  // --- Tabs / Auswahl-Tab --------------------------------------------------

  // Es gibt etwas Auswählbares zum Umschalten (Auswahl-Chip sichtbar).
  get showTabs () {
    return this.multiple && this.activeSelection.length > 0
  }

  // Models der aktuellen Auswahl (für die Auswahl-Ansicht).
  get selectedItems () {
    return this.activeSelection.map(e => e.model)
  }

  // Auswahl-Chip-Klick: zwischen Trefferliste und Auswahl-Ansicht umschalten.
  toggleSelectionView () {
    this.activeTab = this.activeTab === 'selection' ? 'search' : 'selection'
  }

  // --- Interaktion ---------------------------------------------------------

  // Name-Klick = include/deselect (Spec): reiner Toggle "im Set ja/nein",
  // unabhängig von der Polarität. Gewählt (include ODER exclude) → raus;
  // nicht gewählt → include. Polarität ändert nur der "nicht"-Button.
  onRowClick (model) {
    if (this.isItemDisabled(model)) {
      return
    }

    const next = this.polarityOf(model) === null
      ? this.withItem(this.activeSelection, model, 'include')
      : this.withoutItem(this.activeSelection, model)

    this.commitSelection(next)
  }

  // "nicht"-Button (nur bei allowExclude): include ⇄ exclude, neu → exclude.
  onExcludeClick (model) {
    if (this.isItemDisabled(model)) {
      return
    }

    const polarity = this.polarityOf(model)
    let next
    if (polarity === null) {
      next = this.withItem(this.activeSelection, model, 'exclude')
    } else if (polarity === 'exclude') {
      next = this.setItemPolarity(this.activeSelection, model, 'include')
    } else {
      next = this.setItemPolarity(this.activeSelection, model, 'exclude')
    }

    this.commitSelection(next)
  }

  // Schreibt die neue Auswahl: Mehrfach → in den Draft, Popup bleibt offen;
  // Einfach → sofort committen und schließen.
  commitSelection (next) {
    if (this.multiple) {
      this.draft = next
      return
    }
    this.committed = next
    this.emitChange()
    this.close()
  }

  withItem (selection, model, polarity) {
    return [...selection, { model, polarity }]
  }

  withoutItem (selection, model) {
    return selection.filter(e => !e.model.equals(model))
  }

  setItemPolarity (selection, model, polarity) {
    return selection.map(e => e.model.equals(model) ? { model: e.model, polarity } : e)
  }

  // Übernehmen: Draft → committed, emit, schließen (Last-Write-Wins).
  apply () {
    this.committed = [...this.draft]
    this.emitChange()
    this.close({ skipDiscardCheck: true, returnFocus: true })
  }

  // --- Tastatur (§14) ------------------------------------------------------

  focusList () {
    if (this.$refs.list && this.$refs.list.focusFirst) {
      this.$refs.list.focusFirst()
    }
  }

  focusSearch () {
    if (this.$refs.search) {
      this.$refs.search.setFocus(true)
    }
  }

  // Esc im Suchfeld: mit Text → Suche leeren (offen bleiben); leer → schließen.
  onSearchEsc () {
    if (this.search) {
      this.search = ''
      return
    }
    // Esc = bewusst abbrechen, aber im Feld bleiben (Fokus zurück).
    this.close({ returnFocus: true })
  }

  applyIfMultiple () {
    if (this.multiple) {
      this.apply()
    }
  }

  get isDirty () {
    return !this.selectionEquals(this.draft, this.committed)
  }

  selectionEquals (a, b) {
    if (a.length !== b.length) {
      return false
    }
    return a.every(ea => b.some(eb => eb.model.equals(ea.model) && eb.polarity === ea.polarity))
  }

  // Verwerfen-Button schließt direkt ohne Rückfrage (laut Spec). Die
  // Verwerfen-Rückfrage gilt nur für Esc/Außenklick (in close()).
  discardAndClose () {
    this.close({ skipDiscardCheck: true, returnFocus: true })
  }

  removeEntry (entry) {
    if (this.disabled) {
      return
    }
    this.committed = this.committed.filter(e => e !== entry)
    this.emitChange()
  }

  clear () {
    this.committed = []
    this.emitChange()
  }

  // --- Außenformat ---------------------------------------------------------

  // Selection (intern) → Außenwert. Form-Hülle bindet Models; ohne Ausschluss
  // pures Model bzw. Model[], mit Ausschluss {model, polarity}.
  toOuter (selection) {
    const wrap = entry => this.allowExclude
      ? { model: entry.model, polarity: entry.polarity }
      : entry.model

    if (this.multiple) {
      return selection.map(wrap)
    }
    return selection.length ? wrap(selection[0]) : null
  }

  // Außenwert → Selection (intern). Gegenrichtung zu toOuter().
  fromOuter (value) {
    if (value == null) {
      return []
    }
    const unwrap = v => {
      if (v && v.polarity && v.model) {
        return { model: v.model, polarity: v.polarity }
      }
      return { model: v, polarity: 'include' }
    }
    const list = Array.isArray(value) ? value : [value]
    return list.filter(v => v != null).map(unwrap)
  }

  emitChange () {
    this.$emit('change', this.toOuter(this.committed))
  }

  // --- Popup öffnen/schließen + Positionierung -----------------------------

  toggleOpen (event) {
    if (this.disabled) {
      return
    }
    // Klick auf das Clear-× (Vuetify) nicht als Feld-Öffnen werten.
    if (event && event.target.closest('.v-input__icon--clear')) {
      return
    }
    this.isOpen ? this.close() : this.open()
  }

  open () {
    window.addEventListener('mousedown', this.onClickOutside)

    const container = this.getContainer()
    container.appendChild(this.popUp)

    // Draft-Snapshot beim Öffnen (Mehrfachauswahl). Außen-Änderungen während
    // das Popup offen ist berühren nur committed, nicht den Draft.
    this.draft = [...this.committed]
    this.activeTab = 'search'

    this.isOpen = true

    // Lazy-Load: dynamische Liste erst beim Öffnen laden.
    if (this.isDynamic && !this.searchResults.length) {
      this.loadResults({ reset: true })
    }

    this.$nextTick(() => {
      // Popupbreite = Feldbreite − 2rem (links/rechts je ~1rem eingerückt),
      // wie bei ASearchSelect (FormFieldSearchSelect.calculateSelectorSize).
      const field = this.$el.querySelector('.field')
      if (field) {
        this.setPopupWidth(`calc(${field.offsetWidth}px - 1rem)`)
      }
      this.positionize()
      // Feld-Fokus abgeben, BEVOR das Suchfeld fokussiert wird — sonst behält das
      // v-select seinen is-focused-Zustand und Feld+Suchfeld wirken beide
      // fokussiert (und der Re-Fokus nach Verwerfen wird mehrdeutig). v-selects
      // eigene blur() räumt den internen isFocused-State (input.blur() nicht).
      if (this.$refs.field && this.$refs.field.blur) {
        this.$refs.field.blur()
      }
      // Fokus ins Suchfeld; ohne Suchfeld (kurze feste Liste) aufs erste Element (§14).
      if (this.isDynamic && this.$refs.search) {
        this.$refs.search.setFocus(true)
      } else {
        this.focusList()
      }
    })

    this.coe_watchCancel()
  }

  // skipDiscardCheck: true, wenn der Aufrufer den Zustand bereits geklärt hat
  // (apply/discardAndClose) — dann keine erneute Verwerfen-Rückfrage.
  // returnFocus: Fokus aufs Feld zurück (Übernehmen/Verwerfen/Esc — die
  // Komponente bleibt aktiv). Bei Außenklick NICHT, da bewusst verlassen.
  async close ({ skipDiscardCheck = false, returnFocus = false } = {}) {
    if (!this.isOpen) {
      return
    }

    // Mehrfachauswahl mit ungespeicherten Draft-Änderungen → rückfragen.
    if (!skipDiscardCheck && this.multiple && this.isDirty) {
      const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
        title: 'Änderungen verwerfen?',
        message: 'Die Auswahl wurde geändert. Sollen die Änderungen verworfen werden?',
        yesButton: 'Verwerfen'
      }))
      if (result !== DialogEvent.RESULT_YES) {
        return
      }
    }

    const fieldInput = this.$el.querySelector('.field input')

    // returnFocus (Esc/Übernehmen/Verwerfen): Fokus direkt vom Popup aufs Feld
    // umsetzen — KEIN blur dazwischen, sonst fällt der Fokus auf body.
    // Sonst (Außenklick): Fokus aus dem Popup nehmen, damit er nicht aufs Feld
    // springt.
    if (returnFocus) {
      if (fieldInput) {
        fieldInput.focus()
      }
    } else if (document.activeElement && this.popUp.contains(document.activeElement)) {
      document.activeElement.blur()
    }

    this.urp_unregisterPositionWatchers()
    window.removeEventListener('mousedown', this.onClickOutside)

    this.$el.appendChild(this.popUp)

    this.isOpen = false

    // Falls Vuetify nach dem Verschieben den Fokus räumt: nochmal setzen.
    if (returnFocus && fieldInput) {
      requestAnimationFrame(() => fieldInput.focus())
    }

    this.coe_unwatchCancel()
  }

  getContainer () {
    return document.querySelector('.v-application')
  }

  get widthClass () {
    if (this.width === 'auto') {
      return 'width-auto'
    }
  }

  get panelCssClass () {
    return 'select2Panel-' + this.selectId
  }

  get popUp () {
    return this.getContainer().querySelector('.' + this.panelCssClass)
  }

  positionize () {
    // Popup liegt ÜBER dem Feld, ~.5rem nach innen eingerückt (oben/links).
    // Mit der um 1rem schmaleren Breite ergibt sich rechts derselbe Abstand.
    const position = new PositionConfig()
      .setAnchor(this, '.field')
      .setTarget(
        document.documentElement,
        '.' + this.panelCssClass + ' .popup'
      )
      .anchorTop().targetTop()
      .anchorLeft().targetLeft()
      .diffX('.5rem').diffY('.5rem')
      // Kein Platz nach unten → an der Unterkante ausrichten (nach oben).
      .alternativeY(p => {
        p.anchorBottom().targetBottom().diffY('-.5rem')
      })

    this.urp_registerPositionWatcher(position)
  }

  setPopupWidth (width) {
    this.cwm_popupWidth_ = width
  }

  coe_cancelOnEsc () {
    // Esc = bewusst abbrechen, aber im Feld bleiben (Fokus zurück).
    this.close({ returnFocus: true })
    return false // stop esc propagation
  }

  onClickOutside (e) {
    const popUp = this.popUp
    if (!popUp || popUp.contains(e.target)) {
      return
    }
    const field = this.$el.querySelector('.field')
    if (field && field.contains(e.target)) {
      return
    }
    this.close()
  }
}
</script>

<style scoped lang="scss">
// Feld = outlined v-select: Rahmen, Label, Chips, Fokus kommen von Vuetify.
// Eigene Styles nur fürs Positionieren des Popups und den Klick-Cursor.
.a-select2 {
  position: relative;

  .field {
    cursor: pointer;
  }

  // Clear-× dauerhaft sichtbar (Vuetify zeigt es sonst nur bei Hover) — wie ASelect.
  .field :deep(.v-input__icon--clear) {
    opacity: 1;
  }
}
</style>

<style lang="scss">
// Das Popup wird per appendChild in .v-application verschoben — daher nicht scoped.
// Optik wie das Such-Select-Popup: weiße, abgerundete, leicht erhabene Karte.

[class^="select2Panel-"],
[class*=" select2Panel-"] {
  .popup {
    position: absolute;
    z-index: 191;
    background: white;
    max-height: 40vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: .5rem;
  }

  .search {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-bottom: .5rem;
  }

  .search > .v-input {
    flex: 1 1 auto;
  }

  // Auswahl-Umschalt-Chip neben dem Suchfeld.
  .countChip {
    cursor: pointer;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    margin: .5rem -.5rem -.5rem;
    padding: .25rem;
    border-top: 1px solid rgba(0, 0, 0, .08);
  }
}
</style>
