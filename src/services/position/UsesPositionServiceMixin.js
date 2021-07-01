import { Component, Vue } from 'vue-property-decorator'

import { positionService } from '../PositionService'

@Component
export class UsesPositionServiceMixin extends Vue {
  urp_watchers = []

  urp_registerPositionWatcher (position) {
    const watcher = positionService.register(position)
    this.urp_watchers.push(watcher)
  }

  urp_unregisterPositionWatchers () {
    this.urp_watchers.forEach(w => {
      positionService.unregister(w)
    })
  }

  urp_update () {
    this.urp_watchers.forEach(w => {
      w.update()
    })
  }

  destroyed () {
    this.urp_unregisterPositionWatchers()
  }
}
