import {
  mdiAlarmLightOutline,
  mdiChevronRight,
  mdiClose,
  mdiDotsVertical,
  mdiLogoutVariant,
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
      logoutIcon: mdiLogoutVariant,
      plusIcon: mdiPlus,
      pencilIcon: mdiPencil
    }
  },
  breakpoint: {
    mobileBreakpoint: 'sm'
  }
})
