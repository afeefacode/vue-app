<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixeds
      left
    >
      <v-container
        flex-column
        align-start
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
              </div>

              <div class="body-2 d-flex align-center">
                <v-icon class="ml-n1 mr-1">
                  $logoutIcon
                </v-icon>
                <a @click="logout()">Logout</a>
              </div>
            </div>

            <a-context-menu triggerIcon="$dotsVerticalIcon">
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

    <v-navigation-drawer
      v-if="false"
      app
      clipped
      right
    >
      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          link
        >
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      flat
      dense
      color="#FAFAFA"
    >
      <div class="d-flex align-start mt-n2">
        <v-app-bar-nav-icon
          class="sidebarToggleButton mr-2 ml-n1"
          @click="toggleDrawer"
        />
        <a-breadcrumbs class="mt-2" />
      </div>

      <a-loading-indicator
        fixed
        top
        left
        class="loadingIndicator"
        :isLoading="isLoading"
        :color="loaderColor"
      />
    </v-app-bar>

    <v-main>
      <v-container
        fluid
        class="pa-4"
      >
        <div class="d-flex align-center">
          <app-bar-title-container class="flex-grow-1 mb-4" />
          <app-bar-buttons class="mr-2  mb-4" />
        </div>

        <router-view :class="{isLoading}" />
      </v-container>
    </v-main>

    <a-dialog id="app" />

    <a-save-indicator />
  </div>
</template>

<script>
import { Component, Vue, Watch } from '@a-vue'
import { LoadingEvent } from '@a-vue/events'
import { appConfig } from '@a-admin/config/AppConfig'
import { sleep } from '@a-vue/utils/timeout'
import AppBarButtons from './app/AppBarButtons'
import AppBarTitleContainer from './app/AppBarTitleContainer'
import '../styles.scss'

@Component({
  components: {
    AppBarButtons,
    AppBarTitleContainer
  }
})
export default class App extends Vue {
  drawer = true
  mainDrawer = false
  isLoading = false
  account = null

  created () {
    this.$events.on(LoadingEvent.START_LOADING, this.startLoading)
    this.$events.on(LoadingEvent.STOP_LOADING, this.stopLoading)

    if (this.hasAuthService) {
      this.account = appConfig.authService.getAccount()
    }

    this.$emit('appLoaded')
  }

  get SidebarMenu () {
    return appConfig.components.SidebarMenu
  }

  get logoUrl () {
    return appConfig.app.logo
  }

  get title () {
    return appConfig.app.title
  }

  get loaderColor () {
    return appConfig.app.loaderColor
  }

  get rootRouteName () {
    return appConfig.app.rootRouteName || 'root'
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

  @Watch('drawer')
  async drawerChanged () {
    if (this.drawer) {
      this.mainDrawer = false
    } else {
      await sleep(0.1)
      this.mainDrawer = true
    }
  }

  get hasAuthService () {
    return !!appConfig.authService
  }

  logout () {
    appConfig.authService.forwardToLogoutEndpoint()
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
</style>
