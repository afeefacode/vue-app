<template>
  <div
    id="navigation-bar"
    :class="{mobile}"
  >
    <div class="toggleButton">
      <v-app-bar-nav-icon
        title="Menü schließen"
        @click="hideSidebar"
      >
        <v-icon>{{ closeMenuIcon }}</v-icon>
      </v-app-bar-nav-icon>
    </div>

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
      <div class="d-flex align-center gap-4">
        <v-avatar
          color="primary white--text"
          size="40"
        >
          {{ account.first_name.charAt(0).toUpperCase() }}{{ account.last_name.charAt(0).toUpperCase() }}
        </v-avatar>

        <div>
          <div class="accountName">
            {{ account.first_name }}

            <div
              v-if="$auth.roles[0]"
              class="grey--text text-body-2 mb-1"
            >
              {{ $auth.roles[0].title }}
            </div>
          </div>

          <div class="body-2 d-flex align-center">
            <v-icon class="ml-n1 mr-1">
              $logoutIcon
            </v-icon>
            <a @click="logout()">Logout</a>
          </div>
        </div>

        <a-context-menu v-if="$has.settings">
          <a-context-menu-item
            :to="{name: 'settings', params: {accountId: account.id}}"
          >
            <v-icon>$pencilIcon</v-icon>
            Einstellungen
          </a-context-menu-item>
        </a-context-menu>
      </div>
    </v-container>
  </div>
</template>

<script>
import { Component, Vue, Watch } from '@a-vue'
import { mdiBackburger } from '@mdi/js'
import { adminConfig } from '@a-admin/config/AdminConfig'
import { SidebarEvent } from '@a-admin/events'
import { sidebarService } from './sidebar/SidebarService'

@Component
export default class NavigationBar extends Vue {
  $hasOptions = ['settings']

  closeMenuIcon = mdiBackburger

  visible = true
  mobile = false

  created () {
    this.$events.on(SidebarEvent.STATUS, ({payload: {navigation, mobile}}) => {
      this.visible = navigation
      this.mobile = mobile
    })

    this.mobile = sidebarService.mobile
  }

  @Watch('visible')
  visibleChanged () {
    this.$el.style.marginLeft = this.visible ? 0 : '-300px'
  }

  hideSidebar () {
    sidebarService.setNavigation(false)
  }

  get rootRouteName () {
    return adminConfig.app.rootRouteName || 'root'
  }

  get logoUrl () {
    return adminConfig.app.logo
  }

  get title () {
    return adminConfig.app.title
  }

  get SidebarMenu () {
    return adminConfig.app.components.SidebarMenu
  }

  get hasAuthService () {
    return !!this.$auth
  }

  get account () {
    if (this.hasAuthService) {
      return this.$auth.account
    }
    return null
  }

  logout () {
    this.$auth.logout()
  }
}
</script>

<style lang="scss" scoped>
#navigation-bar {
  position: relative;

  flex: 0 0 300px;
  width: 300px;
  height: 100vh;
  overflow: hidden;

  border-right: 1px solid rgba(0, 0, 0, .12);
  transition: all .2s;

  background: white;
  padding-top: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.mobile {
    position: fixed;
    box-shadow: 0 0 7px #00000066;
    z-index: 199;
  }
}

.toggleButton {
  position: absolute;
  top: 0;
  right: .3rem;
}

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
</style>
