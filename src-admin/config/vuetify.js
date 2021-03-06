import {
  mdiAlarmLightOutline,
  mdiArrowLeft,
  mdiCalendar,
  mdiCheck,
  mdiCheckBold,
  mdiChevronRight,
  mdiClose,
  mdiCloseThick,
  mdiDelete,
  mdiDotsHorizontal,
  mdiDotsVertical,
  mdiLock,
  mdiLogoutVariant,
  mdiMagnify,
  mdiMenuDown,
  mdiMenuUp,
  mdiPencil,
  mdiPlus,
  mdiPrinter,
  mdiThumbUpOutline,
  mdiCurrencyEur
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
      closeBoldIcon: mdiCloseThick,
      dotsVerticalIcon: mdiDotsVertical,
      dotsHorizontalIcon: mdiDotsHorizontal,
      logoutIcon: mdiLogoutVariant,
      plusIcon: mdiPlus,
      pencilIcon: mdiPencil,
      trashCanIcon: mdiDelete,
      calendarIcon: mdiCalendar,
      searchIcon: mdiMagnify,
      lockIcon: mdiLock,
      checkIcon: mdiCheck,
      checkBoldIcon: mdiCheckBold,
      arrowLeftIcon: mdiArrowLeft,
      caretDownIcon: mdiMenuDown,
      caretUpIcon: mdiMenuUp,
      printerIcon: mdiPrinter,
      euroSymbol: mdiCurrencyEur
    }
  },
  breakpoint: {
    mobileBreakpoint: 'sm'
  }
})
