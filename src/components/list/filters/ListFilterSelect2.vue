<template>
  <a-select2
    :optionsRequest="optionsRequest"
    :value="selectValue"
    :label="label"
    :placeholder="placeholder"
    :getIcon="getIcon"
    multiple
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

    const entries = tokens.map(t => this.parseToken(t))
    const loaded = await Promise.all(
      entries.map(async entry => {
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

  // {model, polarity}[] (von ASelect2) → Token-Array (Filterwert).
  onChange (value) {
    this.filterChangedFromInside = true

    const tokens = (value || []).map(e => this.toToken(e.model.id, e.polarity))
    this.filter.value = tokens.length ? tokens : null
    this.selectValue = value || []
    this.displayValue = this.toDisplayString(this.selectValue)

    this.$nextTick(() => {
      this.filterChangedFromInside = false
    })
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
}
</script>
