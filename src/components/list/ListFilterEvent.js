import { BaseEvent } from '@a-vue/plugins/event-bus/BaseEvent'

export class ListFilterEvent extends BaseEvent {
  static CHANGE = 'ListFilterEvent:change'
}
