import {
  mdiAlarmLightOutline,
  mdiChevronRight,
  mdiClose,
  mdiDotsVertical,
  mdiLogoutVariant,
  mdiPencil,
  mdiPlus,
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
      dotsVerticalIcon: mdiDotsVertical,
      logoutIcon: mdiLogoutVariant,
      plusIcon: mdiPlus,
      pencilIcon: mdiPencil
    }
  },
  breakpoint: {
    mobileBreakpoint: 'sm'
  }
})
