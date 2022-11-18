<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      left
      width="280"
      class="menubar"
    >
      <v-container
        flex-column
        align-center
        fill-height
      >
        <router-link
          :to="{name: rootRouteName}"
          class="logoContainer d-flex flex-column align-center pa-6"
        >
          <img
            v-if="logoUrl"
            class="logo"
            :src="logoUrl"
          >
          <div class="text-button">
            {{ title }}
          </div>
        </router-link>

        <component
          :is="SidebarMenu"
          class="px-0 mt-0 flex-grow-1"
        />

        <v-container
          v-if="hasAuthService"
          d-flex
          align-center
          gap-4
          pa-6
          pb-8
        >
          <div class="d-flex align-center gap-3">
            <v-avatar
              color="primary white--text"
              size="40"
            >
              {{ account.first_name.charAt(0).toUpperCase() }}{{ account.last_name.charAt(0).toUpperCase() }}
            </v-avatar>

            <div>
              <div class="accountName">
                {{ account.first_name }}
                <template v-if="$auth.roles[0]">
                  ({{ $auth.roles[0].title }})
                </template>
              </div>

              <div class="body-2 d-flex align-center">
                <v-icon class="ml-n1 mr-1">
                  $logoutIcon
                </v-icon>
                <a @click="logout()">Logout</a>
              </div>
            </div>

            <a-context-menu>
              <a-context-menu-item
                :to="{name: 'settings', params: {accountId: account.id}}"
              >
                <v-icon>$pencilIcon</v-icon>
                Einstellungen
              </a-context-menu-item>
            </a-context-menu>
          </div>
        </v-container>
      </v-container>
    </v-navigation-drawer>

    <a-loading-indicator
      fixed
      top
      left
      class="loadingIndicator"
      :isLoading="isLoading"
      :color="loaderColor"
    />

    <v-main id="v-main">
      <a-row
        class="topbar"
        align-start
      >
        <v-app-bar-nav-icon
          class="sidebarToggleButton mr-2 ml-3"
          @click="toggleDrawer"
        />

        <a-breadcrumbs />
      </a-row>

      <v-container
        fluid
        class="pa-8 pt-0"
      >
        <sticky-header />

        <router-view :class="{isLoading}" />
      </v-container>

      <sticky-footer-container />
    </v-main>

    <a-dialog id="app" />

    <a-save-indicator />

    <sidebar />

    <flying-context-container />
  </div>
</template>

<script>
import { Component, Vue, Watch } from '@a-vue'
import { LoadingEvent } from '@a-vue/events'
import { adminConfig } from '@a-admin/config/AdminConfig'
import { sleep } from '@a-vue/utils/timeout'
import AppBarButtons from './app/AppBarButtons'
import AppBarTitleContainer from './app/AppBarTitleContainer'
import FlyingContextContainer from './FlyingContextContainer'
import StickyFooterContainer from './StickyFooterContainer'
import Sidebar from './Sidebar'
import StickyHeader from './StickyHeader'
import '../styles.scss'

@Component({
  components: {
    AppBarButtons,
    AppBarTitleContainer,
    FlyingContextContainer,
    StickyFooterContainer,
    Sidebar,
    StickyHeader
  }
})
export default class App extends Vue {
  drawer = true
  isLoading = false

  created () {
    this.$events.on(LoadingEvent.START_LOADING, this.startLoading)
    this.$events.on(LoadingEvent.STOP_LOADING, this.stopLoading)
    this.$emit('appLoaded')
  }

  get SidebarMenu () {
    return adminConfig.app.components.SidebarMenu
  }

  get logoUrl () {
    return adminConfig.app.logo
  }

  get account () {
    if (this.hasAuthService) {
      return this.$auth.account
    }
    return null
  }

  get title () {
    return adminConfig.app.title
  }

  get loaderColor () {
    return adminConfig.app.loaderColor
  }

  get rootRouteName () {
    return adminConfig.app.rootRouteName || 'root'
  }

  startLoading () {
    this.isLoading = true
  }

  stopLoading () {
    this.isLoading = false
  }

  toggleDrawer () {
    this.drawer = !this.drawer
  }

  get hasAuthService () {
    return !!this.$auth
  }

  logout () {
    this.$auth.logout()
  }
}
</script>


<style lang="scss" scoped>
.accountName {
  line-height: 1.2;
  word-break: break-all;
}

.logoContainer {
  text-decoration: none;
}

.logo {
  max-height: 80px;
  max-width: 90%;
}

.isLoading {
  opacity: .6;
}

.sidebarToggleButton {
  width: 36px !important;
  height: 36px !important;
  margin-top: 1px;
}

.topbar {
  position: relative;
  width: 100%;
  left: 0;
  top: 0;
  padding: .2rem 1.1rem;
  background-color: white;
}

.a-breadcrumbs {
  margin-top: 7px;
}

.menubar {
  // background: #666666 !important;
}

#sidebar {
  // background: #F4F4F4 !important;
}
</style>
