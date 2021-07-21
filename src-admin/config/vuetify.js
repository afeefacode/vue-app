import {
  mdiAlarmLightOutline,
  mdiCalendar,
  mdiChevronRight,
  mdiClose,
  mdiDelete,
  mdiDotsHorizontal,
  mdiDotsVertical,
  mdiLogoutVariant,
  mdiMagnify,
  mdiPencil,
  mdiPlus,
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
      dotsVerticalIcon: mdiDotsVertical,
      dotsHorizontalIcon: mdiDotsHorizontal,
      logoutIcon: mdiLogoutVariant,
      plusIcon: mdiPlus,
      pencilIcon: mdiPencil,
      trashCanIcon: mdiDelete,
      calendarIcon: mdiCalendar,
      searchIcon: mdiMagnify
    }
  },
  breakpoint: {
    mobileBreakpoint: 'sm'
  }
})
