import { eventBus } from '@a-vue/plugins/event-bus/EventBus'

import { SidebarEvent } from './SidebarEvent'

export class SidebarState {
  navigation = false
  informationDerailed = false
  informationRailed = false
  mobile = false

  constructor (service) {
    this.navigation = service.navigation
    this.information = service.information
    this.informationRailed = service.informationRailed
    this.mobile = service.mobile
    this.hasFloatingOverlay = service.hasFloatingOverlay
  }
}

class SidebarService {
  navigation = true
  information = false
  informationRailed = false
  mobile = false

  constructor () {
    window.addEventListener('resize', () => this.checkIsMobile())

    this.checkIsMobile()
  }

  checkIsMobile () {
    const old = this.mobile

    const width = window.innerWidth
    this.mobile = width < 1200

    if (old !== this.mobile) {
      if (!this.mobile) { // expand if destop
        this.navigation = true
      }

      if (this.information) { // rail if mobile, derail if desktop
        this.informationRailed = this.mobile
      }

      eventBus.dispatch(new SidebarEvent(SidebarEvent.STATUS, new SidebarState(this)))
    }
  }

  setNavigation (navigation) {
    if (this.navigation === navigation) {
      return
    }

    this.navigation = navigation

    eventBus.dispatch(new SidebarEvent(SidebarEvent.STATUS, new SidebarState(this)))
  }

  setInformation (information) {
    if (this.information === information) {
      return
    }

    this.information = information

    if (information) { // rail if mobile, derail if desktop
      this.informationRailed = this.mobile
    }

    eventBus.dispatch(new SidebarEvent(SidebarEvent.STATUS, new SidebarState(this)))
  }

  setRailInformation (rail) {
    if (this.informationRailed === rail) {
      return
    }

    this.informationRailed = rail

    eventBus.dispatch(new SidebarEvent(SidebarEvent.STATUS, new SidebarState(this)))
  }

  closeAllFloating () {
    this.setNavigation(false)
    this.setRailInformation(true)
  }

  toggleAll () {
    const visible = !this.navigation
    this.setNavigation(visible)

    if (this.information) {
      if (this.mobile) {
        this.setRailInformation(true)
      } else {
        this.setRailInformation(!visible)
      }
    }
  }

  get hasFloatingOverlay () {
    if (!this.mobile) {
      return false
    }

    if (this.navigation) {
      return true
    }

    if (this.information) {
      return !this.informationRailed
    }

    return false
  }
}

export const sidebarService = new SidebarService()
