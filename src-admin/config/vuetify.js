import {
  mdiAlarmLightOutline,
  mdiAlert,
  mdiArrowLeft,
  mdiArrowRight,
  mdiCalendar,
  mdiCheck,
  mdiCheckBold,
  mdiChevronRight,
  mdiClose,
  mdiCloseCircle,
  mdiCloseThick,
  mdiCurrencyEur,
  mdiDelete,
  mdiDotsHorizontal,
  mdiDotsVertical,
  mdiDownload,
  mdiFilter,
  mdiInformationOutline,
  mdiLock,
  mdiLockOpenVariant,
  mdiLogoutVariant,
  mdiMagnify,
  mdiMenuDown,
  mdiMenuRight,
  mdiMenuUp,
  mdiPalette,
  mdiPencil,
  mdiPencilCircle,
  mdiPlus,
  mdiPlusCircle,
  mdiPrinter,
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
      alertIcon: mdiAlert,
      closeIcon: mdiClose,
      closeCircleIcon: mdiCloseCircle,
      closeBoldIcon: mdiCloseThick,
      dotsVerticalIcon: mdiDotsVertical,
      dotsHorizontalIcon: mdiDotsHorizontal,
      logoutIcon: mdiLogoutVariant,
      plusIcon: mdiPlus,
      pencilIcon: mdiPencil,
      pencilCircleIcon: mdiPencilCircle,
      trashCanIcon: mdiDelete,
      calendarIcon: mdiCalendar,
      searchIcon: mdiMagnify,
      lockIcon: mdiLock,
      lockOpenIcon: mdiLockOpenVariant,
      checkIcon: mdiCheck,
      checkBoldIcon: mdiCheckBold,
      arrowLeftIcon: mdiArrowLeft,
      arrowRightIcon: mdiArrowRight,
      caretDownIcon: mdiMenuDown,
      caretUpIcon: mdiMenuUp,
      caretRightIcon: mdiMenuRight,
      printerIcon: mdiPrinter,
      euroSymbol: mdiCurrencyEur,
      paletteIcon: mdiPalette,
      addIcon: mdiPlusCircle,
      filterIcon: mdiFilter,
      infoIcon: mdiInformationOutline,
      downloadIcon: mdiDownload
    }
  },
  breakpoint: {
    mobileBreakpoint: 'sm'
  }
})
