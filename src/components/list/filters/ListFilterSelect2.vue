<template>
  <a-select2
    :optionsRequest="optionsRequest"
    :value="selectValue"
    :label="label"
    :placeholder="placeholder"
    :getIcon="getIcon"
    :specialItems="specialItems"
    :multiple="filter.multiple"
    :allowExclude="allowExclude"
    clearable
    v-bind="$attrs"
    @change="onChange"
  >
    <template
      v-if="$scopedSlots.row"
      #row="slotProps"
    >
      <slot
        name="row"
        v-bind="slotProps"
      />
    </template>
  </a-select2>
</template>

<script>
import { Component, Mixins, Watch } from '@a-vue'
import { ListFilterMixin } from '../ListFilterMixin'
import { ApiAction } from '@a-vue/api-resources/ApiAction'

// Filter-Hülle für ASelect2 mit Polarität (löst die `not_`-Quickfix-Filter ab).
//
// Die Hülle bindet `filter.value` (Liste {id, polarity} aus dem
// PolarizedSelectFilter) und übersetzt zwischen Ids (URL/Request) und Models
// (die ASelect2 anzeigt/emittiert). Der `filterChangedFromInside`-Guard
// verhindert, dass das Nachladen beim eigenen Setzen erneut feuert.
@Component({
  props: [
    'placeholder',
    {
      allowExclude: true,
      getIcon: { type: Function, default: m => m.getIcon() }
    }
  ]
})
export default class ListFilterSelect2 extends Mixins(ListFilterMixin) {
  selectValue = []
  filterChangedFromInside = false

  created () {
    this.onFilterValueChanged()
  }

  @Watch('filter.value')
  async onFilterValueChanged () {
    if (this.filterChangedFromInside) {
      return
    }
    this.selectValue = await this.loadSelectValue(this.filter.value)
    // Bar-Chip (eingeklappte Leiste) auch beim initialen Laden mit lesbaren
    // Namen befüllen — nicht erst nach einer Änderung.
    this.displayValue = this.toDisplayString(this.selectValue)
    this.displayTitle = this.toDisplayTitle(this.selectValue)
  }

  // Token-Array (Filterwert, z.B. ['2', 'n-5']) → {model, polarity}[] für ASelect2.
  // Lädt die Vorauswahl-Models über die `get`-Action je ID (Muster aus
  // ListFilterSearchSelect.createLoadSelectedItemRequest, auf N IDs erweitert) —
  // die List-Action der Resource hat i.d.R. keinen id-Filter, daher get statt list.
  async loadSelectValue (value) {
    const tokens = Array.isArray(value) ? value : []
    if (!tokens.length) {
      return []
    }

    const specials = this.specialItems
    const entries = tokens.map(t => this.parseToken(t))
    const loaded = await Promise.all(
      entries.map(async entry => {
        // Sonder-Items sind Pseudo-Werte (z.B. "none") ohne echte Resource —
        // lokal aus den Filter-Options auflösen, nicht per get-Action laden.
        const special = specials.find(s => String(s.id) === String(entry.id))
        if (special) {
          return { model: special, polarity: entry.polarity }
        }
        const model = await this.loadModelById(entry.id)
        return model ? { model, polarity: entry.polarity } : null
      })
    )
    return loaded.filter(Boolean)
  }

  async loadModelById (id) {
    const request = this.filter.createOptionsRequest()
    const getAction = this.$apiResources.getAction({
      resourceType: request.getAction().getResource().getType(),
      actionName: 'get'
    })
    request.action(getAction).params({ id })
    return ApiAction.fromRequest(request).hideError().execute()
  }

  optionsRequest () {
    return this.filter.createOptionsRequest().addFilters(this.optionRequestParams || {})
  }

  // Sonder-Items (§5): die Filter-`options` (Server: `{title, value, append}`) in
  // anzeigbare Pseudo-Models wandeln und `append` → `position` mappen (`append
  // === true → 'bottom'` (ans Ende), sonst `'top'`). Ab hier kennt die Komponente
  // nur noch `position`. Bewusst KEIN echtes Model (Model.defaults braucht einen
  // registrierten Type, den Pseudo-Werte wie "none" nicht haben) — ein leichtes
  // Objekt mit getTitle/equals/getIcon reicht für Liste, Feld-Text und Bar-Chip.
  get specialItems () {
    const options = (this.filter && this.filter.options) || []
    return options.map(o => this.toSpecialModel(o))
  }

  // Icon der Filter-Resource (z.B. OrderStatus.icon) — Sonder-Items zeigen
  // dasselbe Icon wie die echten Einträge der Liste. Models tragen ihr Icon als
  // `static icon` (Model.getIcon = this.constructor.icon). Der Model-Typ steckt in
  // der Action-Response (nicht im Resource-Typ — der wäre z.B.
  // 'SPRINT.OrderStatusResource' und träfe keine registrierte Model-Class).
  get specialItemIcon () {
    const response = this.filter.createOptionsRequest().getAction().getResponse()
    const type = response && response.getType()
    const ModelClass = type && this.$apiResources.getModelClass(type)
    return (ModelClass && ModelClass.icon) || null
  }

  toSpecialModel (option) {
    const icon = this.specialItemIcon
    // `type: 'special'` grenzt Sonder-Items von echten Models ab: echte Models
    // tragen ihren Resource-Typ (z.B. 'Sprint'), nie 'special'. Dadurch ist
    // equals() in beide Richtungen sauber (special≠echtes Model) und der
    // Listen-`:key` (`type + '-' + id`) kollidiert nicht mit echten Einträgen,
    // selbst wenn eine ID-Zeichenkette zufällig gleich ist.
    return {
      id: option.value,
      type: 'special',
      title: option.title,
      position: option.append ? 'bottom' : 'top',
      getTitle: () => option.title,
      getIcon: () => icon,
      equals (other) {
        return other && other.type === 'special' && String(other.id) === String(option.value)
      }
    }
  }

  // {model, polarity} (Einfach) bzw. {model, polarity}[] (Mehrfach) von ASelect2
  // → Token-Array (Filterwert). Einfachauswahl emittiert KEIN Array (api §1), daher
  // hier auf Array normalisieren — die Hülle arbeitet intern einheitlich mit Arrays.
  onChange (value) {
    this.filterChangedFromInside = true

    const selection = this.toSelectionArray(value)
    const tokens = selection.map(e => this.toToken(e.model.id, e.polarity))
    this.filter.value = tokens.length ? tokens : null
    this.selectValue = selection
    this.displayValue = this.toDisplayString(this.selectValue)
    this.displayTitle = this.toDisplayTitle(this.selectValue)

    this.$nextTick(() => {
      this.filterChangedFromInside = false
    })
  }

  // ASelect2-Außenwert → immer Array: Mehrfach ist schon ein Array, Einfach ein
  // einzelnes {model, polarity} (oder null bei leerer Auswahl).
  toSelectionArray (value) {
    if (!value) {
      return []
    }
    return Array.isArray(value) ? value : [value]
  }

  // 'n-5' → {id: '5', polarity: 'exclude'}; '2' → {id: '2', polarity: 'include'}.
  parseToken (token) {
    const str = String(token)
    if (str.startsWith('n-')) {
      return { id: str.slice(2), polarity: 'exclude' }
    }
    return { id: str, polarity: 'include' }
  }

  toToken (id, polarity) {
    return polarity === 'exclude' ? `n-${id}` : `${id}`
  }

  // Lesbare Beschriftung für das Bar-Chip (eingeklappte Filterleiste):
  // erster Name (lange gekappt) + "+ N" für den Rest, damit der Chip auch bei
  // vielen/langen Namen kurz bleibt. Ausschluss mit "nicht " markiert.
  toDisplayString (selection) {
    if (!selection || !selection.length) {
      return null
    }
    const first = selection[0]
    const label = (first.polarity === 'exclude' ? 'nicht ' : '') + first.model.getTitle()
    const truncated = label.length > 25 ? label.slice(0, 25).trimEnd() + '…' : label
    const rest = selection.length - 1
    return rest > 0 ? `${truncated} +${rest}` : truncated
  }

  // Vollständige Liste für den Bar-Chip-Tooltip (Hover): ALLE Items, eins pro
  // Zeile, Ausschluss mit "nicht " markiert. Der Chip selbst zeigt nur die kurze
  // toDisplayString-Form.
  toDisplayTitle (selection) {
    if (!selection || !selection.length) {
      return null
    }
    return selection
      .map(e => (e.polarity === 'exclude' ? 'nicht ' : '') + e.model.getTitle())
      .join('\n')
  }
}
</script>
