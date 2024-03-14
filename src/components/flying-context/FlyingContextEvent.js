import { BaseEvent } from '@a-vue/plugins/event-bus/BaseEvent'

export class FlyingContextEvent extends BaseEvent {
  static HIDE_ALL = 'FlyingContextEvent:hide-all'
  static START_HIDE_CONTEXT = 'FlyingContextEvent:start-hide-context'
}
