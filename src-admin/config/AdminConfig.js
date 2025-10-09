class AdminConfig {
  authService = null

  app = {
    logo: null,
    title: null,
    loaderColor: null,
    rootRouteName: null,
    appLoaderMinDuration: null,
    saveLoaderMinDuration: null,
    show_dev_skin: false,

    components: {
      Splash: null,
      SidebarMenu: null,
      HelpPage: null
    },

    icons: {},

    translations: []
  }

  config = {
    has2FA: false
  }
}

export const adminConfig = new AdminConfig()
