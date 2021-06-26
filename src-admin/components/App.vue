<template>
  <v-app>
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
        <div class="d-flex flex-column pa-6">
          <img
            v-if="logoUrl"
            class="logo"
            :src="logoUrl"
          >

          <div class="appTitle text-button">
            {{ title }}
          </div>
        </div>

        <component
          :is="SidebarMenu"
          class="px-0 mt-0 flex-grow-1"
        />

        <v-container
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
              {{ account.first_name.charAt(0) }}{{ account.last_name.charAt(0) }}
            </v-avatar>

            <div>
              <div class="accountName">
                {{ account.first_name }}
              </div>

              <div class="body-2">
                <v-icon class="ml-n1 mr-1">
                  $logoutIcon
                </v-icon>
                <a @click="logout()">Logout</a>
              </div>
            </div>

            <v-menu
              v-if="false"
              top
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  class="contextButton"
                  v-bind="attrs"
                  v-on="on"
                >
                  $dotsVerticalIcon
                </v-icon>
              </template>

              <v-list
                class="pa-0"
              >
                <v-list-item @click="logout()">
                  <v-list-item-icon class="ma-0 mr-2 align-self-center">
                    <v-icon class="ml-n1 mr-1">
                      $logoutIcon
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>
                    Logout
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
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

    <v-main>
      <a-loading-indicator
        class="loadingIndicator"
        :isLoading="isLoading"
      />

      <div class="breadcrumbsContainer d-flex align-center px-3 py-2 mb-8">
        <v-app-bar-nav-icon
          size="2rem"
          @click="toggleDrawer"
        />

        <a-breadcrumbs class="" />
      </div>

      <v-container
        fluid
        class="pa-6 mt-12"
      >
        <router-view :class="{isLoading}" />
      </v-container>
    </v-main>

    <a-dialog />
    <a-alert />
    <a-save-indicator />
  </v-app>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LoadingEvent } from '@a-vue/events'
import { appConfig } from '@a-admin/config/AppConfig'
import { sleep } from '@a-vue/utils/timeout'
import '../styles.scss'

@Component
export default class App extends Vue {
  drawer = true
  mainDrawer = false
  isLoading = false

  created () {
    this.$events.on(LoadingEvent.START_LOADING, this.startLoading)
    this.$events.on(LoadingEvent.STOP_LOADING, this.stopLoading)

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

  logout () {
    appConfig.authService.forwardToLogoutEndpoint()
  }

  get account () {
    return appConfig.authService.getAccount()
  }
}
</script>


<style lang="scss" scoped>
.accountName {
  line-height: 1.2;
  word-break: break-all;
  text-overflow: ellipsis;
}

.logo {
  max-height: 80px;
  max-width: 90%;
}

.isLoading {
  opacity: .6;
}

.breadcrumbsContainer {
  position:fixed;
  background: #FAFAFA;
  width: 100%;
  z-index: 1;
}

.loadingIndicator {
  position:fixed;
  z-index:2;
}
</style>
