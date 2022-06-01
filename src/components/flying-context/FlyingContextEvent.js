import { BaseEvent } from '@a-vue/plugins/event-bus/BaseEvent'

export class FlyingContextEvent extends BaseEvent {
  static HIDE_ALL = 'FlyingContextEvent:hide-all'
}
