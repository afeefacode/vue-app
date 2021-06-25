<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
    >
      <v-container
        flex-column
        align-start
        fill-height
      >
        <div class="ma-2">
          <v-app-bar-nav-icon @click="drawer = !drawer" />
        </div>

        <component
          :is="SidebarMenu"
          class="mt-8"
          flex-grow-1
        />

        <div class="flex-grow-1 d-flex flex-column justify-end align-end">
          <div class="ma-4 d-flex align-center">
            <v-avatar
              color="primary white--text"
              size="40"
              class="mr-4"
            >
              {{ account.first_name.charAt(0) }}{{ account.last_name.charAt(0) }}
            </v-avatar>

            <div>
              <div>{{ account.first_name }} {{ account.last_name }}</div>
              <v-icon class="ml-n1">
                $logoutIcon
              </v-icon> <a @click="logout()">Logout</a>
            </div>
          </div>
        </div>
      </v-container>
    </v-navigation-drawer>

    <v-main>
      <a-loading-indicator :isLoading="isLoading" />

      <v-container
        fluid
        class="pa-8"
      >
        <v-row
          align="center"
          class="mb-8"
          style="height: 36px;"
        >
          <v-app-bar-nav-icon
            v-if="!drawer"
            class="mr-2"
            size="2rem"
            @click="drawer = !drawer"
          />

          <a-breadcrumbs class="ma-0" />
        </v-row>

        <router-view :class="{isLoading}" />
      </v-container>
    </v-main>

    <a-dialog />
    <a-alert />
    <a-save-indicator />
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { LoadingEvent } from '@a-vue/events'
import { appConfig } from '@a-admin/config/AppConfig'

@Component
export default class App extends Vue {
  drawer = true
  isLoading = false

  created () {
    this.$events.on(LoadingEvent.START_LOADING, this.startLoading)
    this.$events.on(LoadingEvent.STOP_LOADING, this.stopLoading)

    this.$emit('appLoaded')
  }

  get SidebarMenu () {
    return appConfig.components.SidebarMenu
  }

  startLoading () {
    this.isLoading = true
  }

  stopLoading () {
    this.isLoading = false
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
.breadcrumbs {
  margin-bottom: 2rem;
}

.isLoading {
  opacity: .6;
}
</style>
