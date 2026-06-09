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
      <!-- Reiner Text statt Chips (wie die übrigen Felder): erster Name per
           Ellipsis auf die Feldbreite gekappt, "+ N" für den Rest. Ausschluss
           mit "nicht " markiert (im Feld sonst nicht sichtbar). -->
      <template #selection="{ item, index }">
        <span
          v-if="index === 0"
          class="fieldText"
        >
          <span class="fieldFirst">
            {{ committedPolarityOf(item) === 'exclude' ? 'nicht ' : '' }}{{ getTitle ? getTitle(item) : item.getTitle() }}
          </span>
          <span
            v-if="committedModels.length > 1"
            class="fieldMore grey--text"
          >
            +{{ committedModels.length - 1 }}
          </span>
        </span>
      </template>
    </v-select>

    <!-- z-index wie ASearchSelect (Overlay 299, Popup 300): über dem
         flying-context (200), damit das Popup nicht dahinter verschwindet. -->
    <v-overlay
      :value="isOpen"
      :z-index="299"
      :opacity="0"
    />

    <!-- Ein-Popup: ein Panel mit (optionalem) Tabs + Suchfeld + Trefferliste -->
    <div :class="panelCssClass">
      <!-- v-menu__content--active markiert das Popup als Stack-Teilnehmer für
           Vuetify: dessen getMaxZIndex() (mixins/stackable) scannt nur Elemente
           mit dieser bzw. der v-dialog-Klasse und liest deren z-index. Da das
           Popup ein eigenes div (kein echtes v-menu) ist, „faken" wir die Klasse
           hier — sie hat in Vuetify keine weitere Wirkung außer dem Stack-Scan.
           Folge: ein aus dem Popup geöffneter Dialog bekommt max(200, 300)+2 =
           302 und liegt korrekt ÜBER dem Popup (wie ein Dialog aus EditModal). -->
      <div
        v-if="isOpen"
        :class="['popup elevation-6 v-menu__content--active', 'open-' + openDirection]"
        :style="cwm_popupWidthStyle"
      >
        <!-- Linearer Lade-Spinner am oberen Popup-Rand (wie Select1), während
             Suche/Daten laden. -->
        <a-loading-indicator
          class="topLoader"
          absolute
          :isLoading="isLoading"
        />

        <!-- Suchfeld immer sichtbar; rechts ein Auswahl-Chip ("N ausgewählt")
             zum Umschalten auf die Auswahl-Ansicht (blau = aktiv) und (×) löscht
             alle. Klick ins Suchfeld → zurück zur Trefferliste. -->
        <div
          v-if="showSearchField"
          class="search"
        >
          <a-text-field
            ref="search"
            :value="search"
            :label="searchLabel"
            clearable
            hide-details
            @input="onSearchInput"
            @focus="activeTab = 'search'"
            @keydown.native.down.prevent="focusList"
            @keydown.native.esc.prevent="onSearchEsc"
            @keydown.native.enter.ctrl.prevent="applyIfMultiple"
          >
            <!-- Anzahl-Chip innen rechts im Suchfeld: schaltet auf die
                 Auswahl-Ansicht um (blau = aktiv). -->
            <template #append>
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
            </template>
          </a-text-field>
        </div>

        <!-- Trefferliste (Default) -->
        <select2-list
          v-if="activeTab === 'search'"
          ref="list"
          :items="displayItems"
          :stickyCount="isDynamic ? topSpecialCount : 0"
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

        <!-- Footer (nur echte Mehrfachauswahl): Übernehmen / Verwerfen. Entfällt
             bei behavesSingle (nur 1 Eintrag) — dann committet der Klick sofort.
             Erst NACH dem Laden zeigen: vorher steht nicht fest, ob es bei 1 Eintrag
             bleibt (behavesSingle) — sonst flackerte der Footer beim Öffnen. -->
        <div
          v-if="showFooter"
          class="footer"
        >
          <!-- Kompakt (passt auch ins schmale Popup, §1): Verwerfen = X-Icon,
               Übernehmen = "OK". -->
          <v-btn
            x-small
            text
            icon
            class="footerBtn"
            :tabindex="-1"
            title="Verwerfen"
            @click="discardAndClose"
          >
            <v-icon small>
              $closeIcon
            </v-icon>
          </v-btn>
          <v-btn
            x-small
            class="footerBtn"
            color="green white--text"
            @click="apply"
          >
            OK
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
import { select2Cache, buildRequestCacheKey } from '../services/select-cache/Select2Cache'
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
      // Suchfeld hart abschalten (Default an). Für Scroll-Listen, die bewusst nur
      // durchgeblättert, nicht durchsucht werden — auch bei mehreren Seiten (§4).
      hasSearch: true,
      pageSize: 30,
      // Sonder-Items (§5): feste Zusatz-Einträge, die keine echten Optionen sind
      // (z.B. "ohne Rechnungsstelle"). Jedes Item trägt seine Position selbst
      // (`position: 'top'|'bottom'`). Die Filter-Hülle mappt server `append` → position.
      specialItems: () => [],
      // Popup-Breitenklemmung (§1): die aus der Feldbreite berechnete Breite wird
      // auf [popupMinWidth, popupMaxWidth] (px) begrenzt. null = keine Grenze.
      // Eigene Namen statt minWidth/maxWidth, weil ComponentWidthMixin maxWidth
      // bereits für die FELD-Breite belegt (Kollision vermeiden).
      // Default 200px Mindestbreite, damit schmale Filter-Felder kein Mini-Popup
      // bekommen.
      popupMinWidth: 150,
      popupMaxWidth: null
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
  // Wurde mindestens eine Seite geladen? Erst danach ist `hasMore` aussagekräftig
  // (steuert, ob das Suchfeld bei einseitigen Listen entfällt — siehe showSearchField).
  loaded = false
  isLoading = false
  loadToken = 0
  searchDebounce = null
  // Unterdrückt den search-Watcher genau einmal (beim programmatischen Leeren in open()).
  suppressSearchWatch = false

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
    // Beim Öffnen wird search programmatisch geleert und direkt geladen (open());
    // dieser Watcher-Lauf würde sonst einen zweiten, debounced Request anstoßen.
    if (this.suppressSearchWatch) {
      this.suppressSearchWatch = false
      return
    }
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

  // Suchfeld nur zeigen, wenn es etwas zu suchen gibt: dynamische Quelle UND die
  // Liste passt nicht auf eine Seite (`hasMore`). Bei einer einseitigen Liste
  // (z.B. 8 Auftragsstatus) ist Suchen sinnlos → kein Suchfeld.
  //
  // Zwei Sonderfälle, die das Feld trotzdem sichtbar halten müssen:
  // - Schon getippt (`search`): nach dem Tippen kann die Liste auf 1 Seite
  //   schrumpfen (`hasMore` false) — das Feld muss bleiben, sonst lässt sich die
  //   Suche nicht mehr ändern/leeren.
  // - Noch nichts geladen (`!loaded`): `hasMore` ist erst nach der ersten Seite
  //   bekannt. Bis dahin Feld zeigen, statt es kurz zu verstecken und nachträglich
  //   aufpoppen zu lassen.
  get showSearchField () {
    if (!this.isDynamic || !this.hasSearch) {
      return false
    }
    return this.hasMore || !!this.search || !this.loaded
  }

  // Such-Label wie bei ASearchSelect: "Suche <label>" (z.B. "Suche SpraMi").
  // Ein explizit gesetztes searchPlaceholder hat Vorrang.
  get searchLabel () {
    if (this.searchPlaceholder) {
      return this.searchPlaceholder
    }
    return this.label ? `Suche ${this.label}` : 'Suche'
  }

  // `items`/`options` sind Props (feste Liste). Bewusst NICHT `items` als
  // Getter benennen — das würde den gleichnamigen Prop verdecken.
  get staticItems () {
    return this.items || this.options || []
  }

  // Reine Treffer/Optionen (ohne Sonder-Items).
  get baseItems () {
    return this.isDynamic ? this.searchResults : this.staticItems
  }

  // Sonder-Items nach Position getrennt. Beim Tippen verhalten sie sich wie
  // normale Einträge — clientseitig nach Titel-Match ein-/ausblenden (§5).
  matchingSpecialItems (position) {
    const items = (this.specialItems || []).filter(i => (i.position || 'bottom') === position)
    if (!this.search) {
      return items
    }
    const q = this.search.toLowerCase()
    return items.filter(i => this.itemTitle(i).toLowerCase().includes(q))
  }

  itemTitle (model) {
    return this.getTitle ? this.getTitle(model) : model.getTitle()
  }

  // Untere Sonder-Items lassen sich nur dann verlässlich ans Listenende setzen,
  // wenn die ganze Liste auf einer Seite liegt — sonst (Pagination greift,
  // `hasMore`) würden sie zwischen den bisher geladenen Treffern und den noch
  // nachkommenden Seiten hängen, also faktisch mitten in der Liste. In dem Fall
  // ziehen wir alle Sonder-Items nach oben (sticky), damit sie sichtbar bleiben.
  get collapseSpecialToTop () {
    return this.isDynamic && this.hasMore
  }

  // Was die Liste anzeigt: Sonder-Items oben (vor den Treffern, bei dynamischer
  // Liste angepinnt), dann die Treffer, dann Sonder-Items unten — Letzteres nur,
  // solange die Liste auf einer Seite passt (§5, siehe collapseSpecialToTop).
  get displayItems () {
    if (this.collapseSpecialToTop) {
      return [
        ...this.matchingSpecialItems('top'),
        ...this.matchingSpecialItems('bottom'),
        ...this.baseItems
      ]
    }
    return [
      ...this.matchingSpecialItems('top'),
      ...this.baseItems,
      ...this.matchingSpecialItems('bottom')
    ]
  }

  // Anzahl der oben angepinnten Sonder-Items (für sticky-Rendering in Select2List).
  // Bei collapseSpecialToTop sind auch die unteren Sonder-Items mit oben.
  get topSpecialCount () {
    const top = this.matchingSpecialItems('top').length
    return this.collapseSpecialToTop
      ? top + this.matchingSpecialItems('bottom').length
      : top
  }

  // --- Laden (nur dynamisch) -----------------------------------------------

  async loadResults ({ reset = false } = {}) {
    if (!this.isDynamic) {
      return
    }

    // Bei reset (neue Suche) die alte Liste NICHT sofort leeren — sonst ist sie
    // während des Ladens leer und das Popup springt. Die neuen Treffer ersetzen
    // sie erst unten, wenn sie da sind.
    if (reset) {
      this.page = 1
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
    this.loaded = true

    this.isLoading = false
  }

  loadMore () {
    if (this.isLoading || !this.hasMore) {
      return
    }
    this.page++
    this.loadResults()
  }

  // Lädt eine Seite. cacheResults=true → JEDE Anfrage (jede Seite, auch mit
  // Suchbegriff) läuft über den globalen Cache; gleicher Key (Resource, Action,
  // Felder, Filter, Suche, Seite) → ein Request, danach aus dem Cache.
  // cacheResults=false (Default) → immer frisch vom Server, nie Cache.
  fetchPage (page) {
    if (this.cacheResults) {
      return select2Cache.loadCached(this.cacheKey(page), () => this.requestPage(page))
    }
    return this.requestPage(page)
  }

  requestPage (page) {
    return this.buildListAction(page).hideError().load()
  }

  // Cache-Key über die geteilte Schlüssel-Quelle (buildRequestCacheKey) — dieselbe
  // Funktion nutzt die main.js-Vorwärmung, damit Lookup und Prime auf denselben
  // Eintrag zeigen. Bezieht Felder/Filter/Suche/Seite ein.
  cacheKey (page) {
    return buildRequestCacheKey(this.optionsRequest(), {
      q: this.search,
      page,
      pageSize: this.pageSize
    })
  }

  // Suche + Seite als Filter (für Request und Cache-Key gleichermaßen).
  pageFilters (page) {
    return { q: this.search, page, page_size: this.pageSize }
  }

  // Baut die ListAction der Datenquelle und setzt Suche + Seite als Filter.
  // `optionsRequest()` liefert einen ApiRequest (wie field.createOptionsRequest()).
  // addFilters merged auf die bestehenden Request-Filter, ersetzt sie nicht.
  buildListAction (page) {
    const request = this.optionsRequest()
      .addFilters(this.pageFilters(page))
    return ListAction.fromRequest(request)
  }

  // --- Auswahl-Helfer ------------------------------------------------------

  // Mehrfachauswahl, die sich aber wie Single bedient: wenn nur EIN Eintrag
  // wählbar ist (vollständig geladen, `displayItems.length === 1`), ist eine
  // Draft-/Übernehmen-Bar sinnlos — ein Klick wählt und schließt sofort, kein
  // Footer. Das **Wertformat** bleibt am Prop `multiple` hängen (toOuter/fromOuter
  // unverändert, sonst bräche die Filter-Hülle, die ein Array erwartet) — nur das
  // Bedien-VERHALTEN kippt.
  get behavesSingle () {
    return this.multiple && !this.hasMore && this.displayItems.length === 1
  }

  // Footer (X/OK) nur bei echter Mehrfachauswahl UND erst, wenn die Items geladen
  // sind: bei dynamischer Quelle vor dem ersten Laden noch nicht (da ist weder die
  // Trefferliste noch behavesSingle entschieden) — bei fester Liste sofort.
  get showFooter () {
    return this.multiple && !this.behavesSingle && (!this.isDynamic || this.loaded)
  }

  // Die im Popup aktive Auswahl: Mehrfach → Draft (Arbeitskopie), Einfach (auch
  // behavesSingle) → committed (Klick committet sofort, kein Draft nötig). Liste +
  // Chips lesen hierüber, damit beide Modi denselben Code teilen.
  get activeSelection () {
    return this.multiple && !this.behavesSingle ? this.draft : this.committed
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

  // Es gibt etwas Auswählbares zum Umschalten (Auswahl-Chip sichtbar). Nicht bei
  // behavesSingle (nur 1 Eintrag, kein Mehrfach-Bedienmodell).
  get showTabs () {
    return this.multiple && !this.behavesSingle && this.activeSelection.length > 0
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
  // Einfach (auch behavesSingle: nur 1 Eintrag) → sofort committen und schließen.
  commitSelection (next) {
    if (this.multiple && !this.behavesSingle) {
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

  // Tippen im Suchfeld wechselt zurück in die Trefferliste (falls gerade die
  // Auswahl-Ansicht aktiv ist) — sonst sucht man, sieht aber die Auswahl.
  onSearchInput (value) {
    this.search = value
    this.activeTab = 'search'
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

    // Dynamische Quelle: bei JEDEM Öffnen frisch laden — Suchbegriff der vorigen
    // Sitzung zurücksetzen, damit nicht ein alter Such-Rest wie ein aktiver Filter
    // wirkt (§4). Die committed-Auswahl bleibt unberührt; nur der flüchtige Such-
    // String/die Trefferliste werden neu aufgebaut. Der cacheResults-Cache greift
    // davon unabhängig weiter (gleicher Key → aus dem Cache).
    // search='' kann den @Watch('search') auslösen; der würde einen zweiten,
    // debounced Request anstoßen. Daher den Watcher für diesen einen Reset
    // unterdrücken (nur wenn search sich wirklich ändert) und EINMAL direkt laden.
    if (this.isDynamic) {
      if (this.search) {
        this.suppressSearchWatch = true
        this.search = ''
      }
      // Fokus erst NACH dem ersten Laden setzen: vorher ist `showSearchField`
      // noch unentschieden (loaded=false ⇒ true), und bei einer einseitigen Liste
      // gäbe es danach gar kein Suchfeld — der Fokus müsste auf die Liste. Erst
      // wenn geladen ist, steht fest, wohin (Suchfeld vs. erstes Element).
      this.loadResults({ reset: true }).then(() => this.focusInitial())
    }

    this.$nextTick(() => {
      // Popupbreite = Feldbreite − 1rem (links/rechts eingerückt), wie bei
      // ASearchSelect (FormFieldSearchSelect.calculateSelectorSize). Optional auf
      // [popupMinWidth, popupMaxWidth] geklemmt (§1).
      const field = this.$el.querySelector('.field')
      if (field) {
        this.setPopupWidth(this.clampPopupWidth(field.offsetWidth - this.remToPx(1)))
      }
      this.positionize()
      // Feld-Fokus abgeben, BEVOR das Suchfeld fokussiert wird — sonst behält das
      // v-select seinen is-focused-Zustand und Feld+Suchfeld wirken beide
      // fokussiert (und der Re-Fokus nach Verwerfen wird mehrdeutig). v-selects
      // eigene blur() räumt den internen isFocused-State (input.blur() nicht).
      if (this.$refs.field && this.$refs.field.blur) {
        this.$refs.field.blur()
      }
      // Feste Liste (kein Laden): Fokus sofort. Bei dynamischer Quelle setzt der
      // .then() nach loadResults den Fokus, sobald feststeht, ob es ein Suchfeld
      // gibt — hier nicht doppelt.
      if (!this.isDynamic) {
        this.focusInitial()
      }
    })

    this.coe_watchCancel()
  }

  // Fokus beim Öffnen: ins Suchfeld, wenn eines gerendert wird — sonst (einseitige
  // Liste, hasSearch=false, feste Liste) aufs erste Listenelement, damit Pfeiltasten
  // und Enter sofort die Liste steuern statt die Seite im Hintergrund zu scrollen
  // (§14). Wird erst aufgerufen, wenn feststeht, ob ein Suchfeld da ist (bei
  // dynamischer Quelle nach dem ersten Laden, sonst im open()-nextTick).
  focusInitial () {
    if (!this.isOpen) {
      return
    }
    this.$nextTick(() => {
      if (this.showSearchField && this.$refs.search) {
        this.$refs.search.setFocus(true)
      } else {
        this.focusList()
      }
    })
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
      // Kein Platz nach unten → an der Unterkante ausrichten (Popup wächst nach
      // oben). Der Callback meldet, welche Variante griff: alternativePositionY
      // === true ⇒ nach oben geklappt ('up').
      // diffX MUSS hier erneut gesetzt werden: PositionConfig.clone() (in
      // alternativeY) kopiert targetDiffX/Y nicht mit, sonst läge das Popup im
      // Up-Fall 8px weiter links als im Down-Fall.
      .alternativeY(p => {
        p.anchorBottom().targetBottom().diffX('.5rem').diffY('-.5rem')
      })
      .onPosition(({ alternativePositionY }) => {
        this.openDirection = alternativePositionY ? 'up' : 'down'
      })

    this.urp_registerPositionWatcher(position)
  }

  setPopupWidth (width) {
    this.cwm_popupWidth_ = width
  }

  // Breite (px) auf [popupMinWidth, popupMaxWidth] klemmen; null = keine Grenze.
  // Floor bei 0 (ein extrem schmales Feld dürfte keine negative Breite ergeben).
  // Rückgabe als px-String fürs Style.
  clampPopupWidth (px) {
    let width = Math.max(0, px)
    if (this.popupMinWidth != null) {
      width = Math.max(width, this.popupMinWidth)
    }
    if (this.popupMaxWidth != null) {
      width = Math.min(width, this.popupMaxWidth)
    }
    return `${width}px`
  }

  remToPx (rem) {
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    return rem * fontSize
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
  // In Grid-Spalten (a-grid cols-N) bleibt das Feld auf Spaltenbreite, statt mit
  // langem Auswahl-Text mitzuwachsen — Voraussetzung dafür, dass die Ellipsis greift.
  width: 100%;
  min-width: 0;

  .field {
    cursor: pointer;
  }

  // Clear-× dauerhaft sichtbar (Vuetify zeigt es sonst nur bei Hover) — wie ASelect.

  .field :deep(.v-input__icon--clear) {
    opacity: 1;
  }

  // Auswahl-Text auf die Feldbreite begrenzen. Damit die Ellipsis greift,
  // braucht jede Stufe der Flex-Kette min-width: 0 (selections → fieldText →
  // fieldFirst), sonst diktiert der Text die Breite und spreizt das Feld.

  .field :deep(.v-select__selections) {
    flex-wrap: nowrap;
    min-width: 0;
  }

  // max-width statt voller Breite: der Text-Block ist nur so breit wie nötig,
  // damit "+ N" direkt hinter dem (ggf. gekappten) Namen steht statt am Feldrand.

  .fieldText {
    display: flex;
    align-items: baseline;
    max-width: 100%;
  }

  .fieldFirst {
    flex: 0 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .fieldMore {
    flex: none;
    margin-left: .25rem;
    margin-right: 2px;
    white-space: nowrap;
    font-size: .8125rem;
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
    z-index: 300;

    // Das Popup trägt die Fake-Klasse v-menu__content--active (Template), damit
    // Vuetify es im z-index-Stack mitzählt. Diese Klasse bringt aus Vuetify
    // jedoch `pointer-events: none` mit (VMenu.sass) — hier zurücksetzen, sonst
    // wäre das Popup unklickbar. Höhere Spezifität (.select2Panel .popup)
    // schlägt Vuetifys Single-Class-Regel.
    pointer-events: auto;

    background: white;
    max-height: 40vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: .5rem;
  }

  // Beim Hochklappen (Popup über dem Feld) klebt das Suchfeld an der dem Feld
  // zugewandten (unteren) Kante: Liste oben, dann Suchfeld, Footer bleibt unten
  // (UX: Aktionsbuttons immer am unteren Rand, nicht feldfern nach oben). Per
  // `order` statt column-reverse. Der topLoader ist position:absolute und bleibt
  // davon unberührt.

  .popup.open-up {
    .select2List {
      order: 1;
    }

    .search {
      order: 2;
      // Mehr Luft zwischen Liste und Suchfeld in der invertierten Lage (§1).
      margin-top: 1rem;
      margin-bottom: 2px;
    }

    .footer {
      order: 3;
      // Footer rückt näher ans Suchfeld als im Normalfall (down).
      margin-top: 1rem;
    }
  }

  // Linearer Lade-Spinner bündig am oberen Popup-Rand (über das Padding hinweg).

  .topLoader {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .search {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-top: 2px;
    margin-bottom: .5rem;
  }

  .search > .v-input {
    flex: 1 1 auto;
  }

  // Auswahl-Umschalt-Chip neben dem Suchfeld.

  .countChip {
    cursor: pointer;
  }

  // Button-Reihe wie die Edit-Form-Buttons: rechtsbündig, kleiner Gap, keine
  // Trennlinie zur Liste.

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: .5rem;
    margin-top: 1.5rem;
  }

  // Größe zwischen x-small (20px) und small (28px): Vuetify bietet dazwischen
  // nichts, daher per CSS auf 24px Höhe + leicht größere Schrift.

  .footerBtn.v-btn {
    height: 24px;
    font-size: .75rem;
  }
}
</style>
