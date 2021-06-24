import { BaseEvent } from '@a-vue/plugins/event-bus/BaseEvent'

export class AlertEvent extends BaseEvent {
  static ERROR = 'AlertEvent:error'
  static MESSAGE = 'AlertEvent:message'
}
