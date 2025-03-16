class AdminConfig {
  authService = null

  app = {
    logo: null,
    title: null,
    loaderColor: null,
    rootRouteName: null,
    appLoaderMinDuration: null,
    saveLoaderMinDuration: null,

    components: {
      Splash: null,
      SidebarMenu: null
    },

    icons: {}
  }

  config = {
    has2FA: false
  }
}

export const adminConfig = new AdminConfig()
