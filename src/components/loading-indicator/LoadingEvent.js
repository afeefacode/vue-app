import { BaseEvent } from '@a-vue/plugins/event-bus/BaseEvent'

export class LoadingEvent extends BaseEvent {
  static START_LOADING = 'LoadingEvent:start'
  static STOP_LOADING = 'LoadingEvent:stop'
}
