import {
  mdiAlarmLightOutline,
  mdiChevronRight,
  mdiClose,
  mdiDotsVertical,
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiThumbUpOutline
} from '@mdi/js'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
    values: {
      chevronRightIcon: mdiChevronRight,
      thumbsUpIcon: mdiThumbUpOutline,
      alarmIcon: mdiAlarmLightOutline,
      closeIcon: mdiClose,
      sortAscIcon: mdiSortAlphabeticalAscending,
      sortDescIcon: mdiSortAlphabeticalDescending,
      dotsVerticalIcon: mdiDotsVertical
    }
  },
  breakpoint: {
    mobileBreakpoint: 'sm'
  }
})
