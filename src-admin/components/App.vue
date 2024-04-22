<template>
  <div class="admin">
    <v-overlay
      fixed
      :value="sidebarsFloating"
      @click="closeFloatingSidebars"
    />

    <div class="main-layout">
      <navigation-bar :has="$has" />

      <div
        id="v-main"
        :class="{marginRight: hasFloatingInformationBar}"
      >
        <a-loading-indicator
          :isLoading="!!numLoadingRequests"
          :color="loaderColor"
        />

        <sticky-header />

        <div class="pa-8 pt-4">
          <router-view :class="{isLoading: !!numLoadingRequests}" />
        </div>

        <sticky-footer-container />
      </div>

      <information-bar />
    </div>

    <a-dialog id="app" />

    <a-save-indicator />

    <flying-context-container />

    <div id="popupContainer" />

    <a-dialog
      id="autologout"
      ref="autologoutDialog"
    >
      {{ autoLogoutMessage }}
    </a-dialog>
  </div>
</template>

<script>
import { Component, Vue, Watch } from '@a-vue'
import { LoadingEvent, DialogEvent } from '@a-vue/events'
import { adminConfig } from '@a-admin/config/AdminConfig'
import { sleep } from '@a-vue/utils/timeout'
import AppBarButtons from './app/AppBarButtons'
import AppBarTitleContainer from './app/AppBarTitleContainer'
import FlyingContextContainer from './FlyingContextContainer'
import StickyFooterContainer from './StickyFooterContainer'
import NavigationBar from './NavigationBar'
import InformationBar from './InformationBar'
import StickyHeader from './StickyHeader'
import '../styles.scss'
import { mdiBackburger } from '@mdi/js'
import { SidebarEvent } from '@a-admin/events'
import { sidebarService } from './sidebar/SidebarService'

@Component({
  components: {
    AppBarButtons,
    AppBarTitleContainer,
    NavigationBar,
    InformationBar,
    FlyingContextContainer,
    StickyFooterContainer,
    StickyHeader
  }
})
export default class App extends Vue {
  $hasOptions = ['settings']

  drawer = true
  closeMenuIcon = mdiBackburger
  numLoadingRequests = 0

  sidebarsFloating = false
  hasFloatingInformationBar = false

  autoLogoutChannel = new BroadcastChannel('auth.autologout')
  autoLogoutStartSeconds = 0
  autoLogoutStartRemainingSeconds = 0
  autoLogoutRemainingSeconds = 0
  autoLogoutRemainingInterval = null

  created () {
    this.$events.on(LoadingEvent.START_LOADING, this.startLoading)
    this.$events.on(LoadingEvent.STOP_LOADING, this.stopLoading)

    this.$events.on(SidebarEvent.STATUS, ({payload: {hasFloatingOverlay, mobile, information}}) => {
      this.sidebarsFloating = hasFloatingOverlay
      this.hasFloatingInformationBar = mobile && information
    })

    this.autoLogoutChannel.addEventListener('message', e => {
      if (e.data.type === 'autoLogoutStart') {
        this.autoLogoutStartSeconds = this.getCurrentSeconds()
        this.autoLogoutStartRemainingSeconds = e.data.remainingSeconds
        this.autoLogoutRemainingSeconds = e.data.remainingSeconds

        this.autoLogoutRemainingInterval = setInterval(() => {
          const secondsSinceStart = this.getCurrentSeconds() - this.autoLogoutStartSeconds
          this.autoLogoutRemainingSeconds = this.autoLogoutStartRemainingSeconds - secondsSinceStart
        }, 1000)

        this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
          id: 'autologout',
          title: 'Inaktivität',
          yesButton: 'Bitte nicht'
        }))
      }
      if (e.data.type === 'autoLogoutStop') {
        clearInterval(this.autoLogoutRemainingInterval)
        const dialog = this.$refs.autologoutDialog
        if (dialog) {
          dialog.cancel()
        }
      }
    })

    this.sidebarsFloating = sidebarService.hasFloatingOverlay
    this.hasFloatingInformationBar = sidebarService.mobile && sidebarService.information

    this.$emit('appLoaded')
  }

  get autoLogoutMessage () {
    return `Sie werden in ${this.autoLogoutRemainingSeconds} Sekunden abgemeldet.`
  }

  getCurrentSeconds () {
    return Math.round(new Date().getTime() / 1000)
  }

  closeFloatingSidebars () {
    sidebarService.closeAllFloating()
  }

  get loaderColor () {
    return adminConfig.app.loaderColor
  }

  startLoading () {
    this.numLoadingRequests++
  }

  stopLoading () {
    this.numLoadingRequests--
  }
}
</script>


<style lang="scss" scoped>
.isLoading {
  opacity: .6;
}

.main-layout {
  display: flex;
}

.loadingIndicator {
  z-index: 3;
  position: sticky;
  top: 0;
}

#v-main.marginRight {
  margin-right: 60px;
}

#popupContainer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 400;
}
</style>
